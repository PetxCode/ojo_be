import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import { Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";
import memberModel from "../model/memberModel";
import jwt from "jsonwebtoken";
import env from "dotenv";
import LGA_AdminModel from "../model/LGA_AdminModel";
import moment from "moment";
import _ from "lodash";
import path from "node:path";
import fs from "node:fs";
import cloudinary from "../utils/cloudinary";
env.config();

export const loginMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { entryID } = req.body;

    const adminData = await memberModel.findOne({ entryID });

    if (adminData) {
      if (adminData?.verify) {
        let token = jwt.sign({ id: adminData?._id }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          message: "Admin login successfully",
          data: token,
          status: 200,
        });
      } else {
        return res.status(404).json({
          message: "Admin not verified",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "can't find admin",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      data: error.message,
      status: 404,
    });
  }
};

export const createMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { unitLeaderID } = req.params;
    const { name, location } = req.body;

    const unitLeader: unitLeaderData | null = await unitLeaderModel.findById(
      unitLeaderID
    );
    const id = crypto.randomBytes(6).toString("hex");

    if (
      unitLeader &&
      unitLeader?.role === "Unit Leader" &&
      unitLeader?.verify === true
    ) {
      const member = await memberModel.create({
        name,
        unitLeaderID,
        LGALeaderID: unitLeader?.LGALeaderID,
        branchLeaderID: unitLeader?.branchLeaderID,
        location,
        entryID: id,
      });

      addMemberEmail(member, unitLeader);

      return res.status(201).json({
        message: "creating member",
        data: member,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "Error creating member",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating member",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyMember = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { memberID } = req.params;

    const memberInfo: any = await memberModel.findById(memberID);

    const unitLeader = await unitLeaderModel.findById(memberInfo?.unitLeaderID);

    if (unitLeader) {
      const member: any = await memberModel.findByIdAndUpdate(
        memberID,
        { verify: true },
        { new: true }
      );

      unitLeader.member.push(new Types.ObjectId(member?._id!));
      unitLeader?.save();

      const getBranchUnitMemberCount: any = await branchLeaderModel.findById(
        unitLeader?.branchLeaderID
      );

      let unitLeaderData: any[] = [];
      for (let i of getBranchUnitMemberCount?.unitLeader) {
        let unit = await unitLeaderModel.findById(i);
        unitLeaderData.push(unit?.member);
      }

      const branchLeader = await branchLeaderModel.findByIdAndUpdate(
        unitLeader?.branchLeaderID,
        {
          branch_members: unitLeaderData?.flat()?.length,
          branch_units: getBranchUnitMemberCount?.unitLeader?.length,
        },
        { new: true }
      );

      let count: number = 0;
      const getLGALeader: any = await LGA_AdminModel.findById(
        branchLeader?.LGA_AdminID
      );

      let unitData: any[] = [];

      for (let i of getLGALeader?.branchLeader) {
        const unitCount = await branchLeaderModel.findByIdAndUpdate(
          i,
          {
            branch_members: getLGALeader?.branchLeader.length,
          },
          { new: true }
        );
        unitData.push(unitCount?.unitLeader);
      }

      let memberData = [];
      for (let i of unitData.flat()) {
        const memberCount = await unitLeaderModel.findByIdAndUpdate(
          i,
          {
            branch_members: getLGALeader?.branchLeader.length,
          },
          { new: true }
        );
        memberData.push(memberCount?.member);
      }

      const readLGA = await LGA_AdminModel.findByIdAndUpdate(
        branchLeader?.LGA_AdminID,
        {
          lga_branches: getLGALeader?.branchLeader?.length,
          lga_units: unitData.flat()?.length,
          lga_members: memberData.flat().length,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "LGA has verified Branch Leader created successfully",
        // data: member,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "error finding LGA Admin",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying LGA Admin ",
    });
  }
};

export const updateMemberLeaderEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { unitLeaderID } = req.params;
    const { email } = req.body;

    const brancherLeaderData = await unitLeaderModel.findById(unitLeaderID);

    if (brancherLeaderData) {
      const branchLeaderUpdated: any = await unitLeaderModel.findByIdAndUpdate(
        unitLeaderID,
        { email, verify: true },
        { new: true }
      );

      return res.status(201).json({
        message: "unit Leader email created successfully",
        data: branchLeaderUpdated,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "error finding stateAdmin",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying stateAdmin ",
    });
  }
};

export const viewBranchLeaderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { branchLeaderID } = req.params;

    const branchLeader = await branchLeaderModel.findById(branchLeaderID);

    return res.status(200).json({
      message: "viewing Branch Leader record",
      data: branchLeader,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying branchLeader",
    });
  }
};

export const viewBranchesLeaderUnit = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { branchLeaderID } = req.params;

    const branchLeader = await branchLeaderModel
      .findById(branchLeaderID)
      .populate({
        path: "unitLeader",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });

    return res.status(200).json({
      message: "viewing Branch Leader record",
      data: branchLeader,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Branch Leader",
    });
  }
};

export const viewTotalMembers = async (req: Request, res: Response) => {
  try {
    const branch = await memberModel?.find();

    return res.status(200).json({
      message: "viewing Branch Leader record",
      data: branch,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const makePaymentMembers = async (req: Request, res: Response) => {
  try {
    const { memberID } = req.params;
    const member: any = await memberModel?.findById(memberID);

    const unit: any = await unitLeaderModel?.findById(member?.unitLeaderID);

    const branch: any = await branchLeaderModel?.findById(
      member?.branchLeaderID
    );
    const lga: any = await LGA_AdminModel?.findById(branch?.LGA_AdminID);

    await memberModel?.findByIdAndUpdate(
      memberID,
      {
        operation: [
          ...member?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    const unx = await unitLeaderModel?.findByIdAndUpdate(
      member?.unitLeaderID,
      {
        operation: [
          ...unit?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    const brx = await branchLeaderModel?.findByIdAndUpdate(
      member?.branchLeaderID,
      {
        operation: [
          ...branch?.operation,
          {
            memberID,
            memberNmae: member?.name,
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    const lgax = await LGA_AdminModel?.findByIdAndUpdate(
      branch?.LGA_AdminID,
      {
        operation: [
          ...lga?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    return res.status(200).json({
      message: "viewing member Leader record",
      data: member,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const makePaymentWithMembersID = async (req: Request, res: Response) => {
  try {
    const { entryID } = req.body;
    const member: any = await memberModel?.findOne({ entryID });
    let memberID = member?._id;

    const unit: any = await unitLeaderModel?.findById(member?.unitLeaderID);

    const branch: any = await branchLeaderModel?.findById(
      member?.branchLeaderID
    );
    const lga: any = await LGA_AdminModel?.findById(branch?.LGA_AdminID);

    await memberModel?.findByIdAndUpdate(
      memberID,
      {
        operation: [
          ...member?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    await unitLeaderModel?.findByIdAndUpdate(
      member?.unitLeaderID,
      {
        operation: [
          ...unit?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    await branchLeaderModel?.findByIdAndUpdate(
      member?.branchLeaderID,
      {
        operation: [
          ...branch?.operation,
          {
            memberID,
            memberNmae: member?.name,
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    await LGA_AdminModel?.findByIdAndUpdate(
      branch?.LGA_AdminID,
      {
        operation: [
          ...lga?.operation,
          {
            time: moment(Date.now()).format("LLLL"),
            cost: 3000,
            memberID,
            memberNmae: member?.name,
            unitLeader: unit?.name,
            unitLeaderID: unit?._id,
            branchLeader: branch?.name,
            branchLeaderID: branch?._id,
            LGALeader: lga?._id,
            LGALeaderID: lga?._id,
          },
        ],
      },
      { new: true }
    );

    return res.status(200).json({
      message: "viewing member Leader record",
      // data: member,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const updateMemberProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { phone, bio, name } = req.body;

    const stateAdminLGA = await memberModel.findByIdAndUpdate(
      id,
      {
        phone,
        bio,
        name,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "viewing stateAdminLGA record",
      data: stateAdminLGA,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying stateAdminLGA",
    });
  }
};

export const updateMemberAvatar = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const getUser = await memberModel.findById(id);
    if (getUser) {
      let filePath = path.join(__dirname, "../utils/uploads/media");

      const deleteFilesInFolder = (folderPath: any) => {
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);

          files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
          });

          console.log(
            `All files in the folder '${folderPath}' have been deleted.`
          );
        } else {
          console.log(`The folder '${folderPath}' does not exist.`);
        }
      };

      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path
      );

      const user = await memberModel.findByIdAndUpdate(
        id,
        {
          avatar: secure_url,
          avatarID: public_id,
        },
        { new: true }
      );

      deleteFilesInFolder(filePath);

      return res
        .status(201)
        .json({ message: "User update successfully", data: user, status: 201 });
    } else {
      return res
        .status(400) // Changed to 400 for a more appropriate error status
        .json({ message: "deos not exist" });
    }
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const viewMemberStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { memberID } = req.params;

    const LGALeader = await memberModel.findById(memberID);

    return res.status(200).json({
      message: "viewing LGALeader record",
      data: LGALeader,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying LGALeader",
    });
  }
};
