import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import LGA_AdminModel from "../model/LGA_AdminModel";
import { Types } from "mongoose";
import { branchLeaderData, LGA_AdminUserData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";
import jwt from "jsonwebtoken";
import env from "dotenv";
import moment from "moment";
import _ from "lodash";
import unitLeaderModel from "../model/unitLeaderModel";
import path from "node:path";
import fs from "node:fs";
import cloudinary from "../utils/cloudinary";
env.config();

export const loginBranch = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { entryID } = req.body;

    const adminData = await branchLeaderModel.findOne({ entryID });

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

export const createBranchLeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGALeaderID } = req.params;
    const { name, location } = req.body;

    const LGALeader: LGA_AdminUserData | null = await LGA_AdminModel.findById(
      LGALeaderID
    );
    const id = crypto.randomBytes(6).toString("hex");

    if (
      LGALeader &&
      LGALeader?.email &&
      LGALeader?.role === "LGA Admin" &&
      LGALeader?.verify === true
    ) {
      const branchLeader = {
        name,
        LGA_AdminID: LGALeaderID,
        location,
        entryID: id,
        role: "Branch Officer",
      };

      const token = jwt.sign(
        { name, LGA_AdminID: LGALeaderID, location, entryID: id },
        "just"
      );

      addMemberEmail(branchLeader, LGALeader, token);

      LGA_AdminModel.findByIdAndUpdate(
        LGALeaderID,
        {
          lga_branches: LGALeader?.lga_branches + 1,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "creating LGA-Branch Leader",
        data: branchLeader,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "Error creating LGA-Branch Leader",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating LGA-Branch Leader",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyBranchLeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const LGALeader = await LGA_AdminModel.findById(req.body?.LGA_AdminID);

    if (LGALeader) {
      const stateAdminLGA: any = await branchLeaderModel.create(req.body);

      LGALeader.branchLeader.push(new Types.ObjectId(stateAdminLGA?._id!));
      LGALeader?.save();

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

export const updateBranchLeaderEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { branchLeaderID } = req.params;
    const { email } = req.body;

    const brancherLeaderData = await branchLeaderModel.findById(branchLeaderID);

    if (brancherLeaderData) {
      const branchLeaderUpdated: any =
        await branchLeaderModel.findByIdAndUpdate(
          branchLeaderID,
          { email, verify: true },
          { new: true }
        );

      return res.status(201).json({
        message: "Branch Leader email created successfully",
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

export const viewTotalBranches = async (req: Request, res: Response) => {
  try {
    const branch = await branchLeaderModel?.find();

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

export const outComeCost = async (req: Request, res: Response) => {
  try {
    const { branchID } = req.params;

    const unit: any = await branchLeaderModel?.findById(branchID);
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

export const branchDriversOpration = async (req: Request, res: Response) => {
  try {
    const { branchID } = req.params;
    const unit = await branchLeaderModel?.findById(branchID);

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

    let option = await branchLeaderModel?.findByIdAndUpdate(
      branchID,
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
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      err: error.message,
    });
  }
};

export const bestPerformingUnit = async (req: Request, res: Response) => {
  try {
    const { branchID } = req.params;
    const branch: any = await branchLeaderModel?.findByIdAndUpdate(branchID);

    let xArr: any[] = [];

    for (let i of branch?.unitLeader) {
      const unit = await unitLeaderModel.findById(i);
      const x = unit?.operation;
      const sumByDay = _.groupBy(x, (item: any) => {
        return moment(item.time, "dddd, MMMM D, YYYY h:mm A").format(
          "YYYY-MM-DD"
        );
      });

      const dailySums = _.mapValues(sumByDay, (group: any) => {
        return {
          cost: _.sumBy(group, "cost"),
          unitLeaderID: group[0]?.unitLeaderID,
        };
      });

      const sortedDailySums = Object.fromEntries(
        Object.entries(dailySums).sort((a: any, b: any) => a[1] - b[1])
      );

      console.log("x: ", sortedDailySums);

      xArr.push(sortedDailySums);
    }

    console.log(xArr);

    return res.status(200).json({
      message: "viewing Branch Officer record",
      data: xArr,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const updateBranchProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { phone, bio, name, email } = req.body;

    const stateAdminLGA = await branchLeaderModel.findByIdAndUpdate(
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

export const updateBranchAvatar = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const getUser = await branchLeaderModel.findById(id);
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

      const user = await branchLeaderModel.findByIdAndUpdate(
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
