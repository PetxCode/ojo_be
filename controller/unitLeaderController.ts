import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import { Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";

import path from "node:path";
import fs from "node:fs";

import jwt from "jsonwebtoken";
import env from "dotenv";
import LGA_AdminModel from "../model/LGA_AdminModel";
import _ from "lodash";
import moment from "moment";
import cloudinary from "../utils/cloudinary";
env.config();

export const loginUnit = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { entryID } = req.body;

    const adminData = await unitLeaderModel.findOne({ entryID });

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

export const createUnitLeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { branchLeaderID } = req.params;
    const { name, location } = req.body;

    const branchLeader: unitLeaderData | null =
      await branchLeaderModel.findById(branchLeaderID);
    const id = crypto.randomBytes(6).toString("hex");

    if (
      branchLeader &&
      branchLeader?.email &&
      branchLeader?.role === "Branch Leader" &&
      branchLeader?.verify === true
    ) {
      const unitLeader = {
        name,
        role: "Unit Officer",
        branchLeaderID,
        LGALeaderID: branchLeader?.LGALeaderID,

        location,
        entryID: id,
      };

      const token = jwt.sign(unitLeader, "just");

      addMemberEmail(unitLeader, branchLeader, token);

      return res.status(201).json({
        message: "creating unit Leader",
        data: unitLeader,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "Error creating unit Leader",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating unit Leader",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyUnitLeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const branchLeader: any = await branchLeaderModel.findById(
      req.body?.branchLeaderID
    );

    if (branchLeader) {
      const stateAdminLGA: any = await unitLeaderModel.create(req.body);

      branchLeader.unitLeader.push(new Types.ObjectId(stateAdminLGA?._id!));
      branchLeader?.save();

      let unitCount: any[] = [];

      for (let i of branchLeader?.unitLeader) {
        const x = await unitLeaderModel.findById(i);
        unitCount.push(x?.member);
      }

      const xx = await LGA_AdminModel?.findByIdAndUpdate(
        branchLeader?.LGA_AdminID,
        {
          branch_members: unitCount?.flat().length,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "LGA has verified Branch Leader created successfully",
        data: stateAdminLGA,
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

export const updateUnitLeaderEmail = async (
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

export const viewTotalUnit = async (req: Request, res: Response) => {
  try {
    const unit = await unitLeaderModel?.find();

    return res.status(200).json({
      message: "viewing unit Officer record",
      data: unit,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const outComeCost = async (req: Request, res: Response) => {
  try {
    const { unitID } = req.params;

    const unit: any = await unitLeaderModel?.findById(unitID);
    const x = unit?.operation;

    const sumByDay = _.groupBy(x, (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").format(
        "YYYY-MM-DD"
      );
    });

    const dailySums = _.mapValues(sumByDay, (group) => {
      return _.sumBy(group, "cost");
    });

    const sortedDailySums = Object.fromEntries(
      Object.entries(dailySums).sort((a, b) => a[1] - b[1])
    );

    const sumByMonth = _.groupBy(x, (item) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM");
    });

    const monthlySums = _.mapValues(sumByMonth, (group) => {
      return _.sumBy(group, "cost");
    });

    const sortedMonthlySums = Object.fromEntries(
      Object.entries(monthlySums).sort((a, b) => a[1] - b[1])
    );

    return res.status(200).json({
      message: "viewing unit Officer record",
      data: {
        daily: sortedDailySums,
        monthly: sortedMonthlySums,
      },
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const driversOpration = async (req: Request, res: Response) => {
  try {
    const { unitID } = req.params;
    const unit = await unitLeaderModel?.findById(unitID);

    const x = unit?.operation;

    const operation = _.groupBy(x, (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").format(
        "YYYY-MM-DD"
      );
    });

    const opt = Object.fromEntries(
      Object.entries(operation).sort((a: any, b: any) => a - b)
    );

    let operate = [];

    for (let i of Object.keys(opt)) {
      console.log([`${i}`]);
      let x = _.size(operation[`${i}`]);
      console.log("reading: ", x);
      operate.push(x);
    }

    console.log(operate);

    let option = await unitLeaderModel?.findByIdAndUpdate(
      unitID,
      {
        daily_operation: operate,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "viewing unit Officer record",
      data: option?.daily_operation,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const updateUnitProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { phone, bio, name, email } = req.body;

    const stateAdminLGA = await unitLeaderModel.findByIdAndUpdate(
      id,
      {
        phone,
        bio,
        name,
        email,
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

export const updateUnitAvatar = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const getUser = await unitLeaderModel.findById(id);
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

      const user = await unitLeaderModel.findByIdAndUpdate(
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

export const viewUnitLeaderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { unitID } = req.params;

    const LGALeader = await unitLeaderModel.findById(unitID);

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

export const viewUnitLeaderMembers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { unitID } = req.params;

    const unit = await unitLeaderModel
      .findById(unitID)
      .populate("member")
      .exec();

    return res.status(200).json({
      message: "viewing unit record",
      data: unit,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying LGALeader",
    });
  }
};
