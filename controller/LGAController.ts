import { Request, Response } from "express";
import crypto from "node:crypto";
import adminModel from "../model/adminModel";
import { addMemberEmail } from "../utils/email";
import LGA_AdminModel from "../model/LGA_AdminModel";
import { Types } from "mongoose";
import { adminUserData } from "../utils/interfaces";
import jwt from "jsonwebtoken";
import env from "dotenv";
import moment from "moment";
import path from "node:path";
import fs from "node:fs";
import _ from "lodash";
import cloudinary from "../utils/cloudinary";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";
import { request } from "node:http";
env.config();

export const loginLGA = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { entryID } = req.body;

    const adminData = await LGA_AdminModel.findOne({ entryID });

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

export const createLGALeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;
    const { name, location } = req.body;

    const stateAdminData: adminUserData | null = await adminModel.findById(
      stateAdminID
    );
    const id = crypto.randomBytes(6).toString("hex");

    if (
      stateAdminData &&
      stateAdminData?.email &&
      stateAdminData?.role === "admin" &&
      stateAdminData?.verify === true
    ) {
      const token = jwt.sign(
        {
          name,
          adminID: stateAdminID,
          location,
          entryID: id,
        },
        "just"
      );

      const userData = {
        name,
        adminID: stateAdminID,
        location,
        entryID: id,
        role: "LGA Officer",
      };

      addMemberEmail(userData, stateAdminData, token);

      return res.status(201).json({
        message: "creating LGA Leader",

        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "Error creating LGA Leader",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating LGA Leader",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyLGACreatedByStateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stateAdminData = await adminModel.findById(req.body?.adminID);

    if (stateAdminData) {
      const stateAdminLGA: any = await LGA_AdminModel.create(req.body);

      stateAdminData.LGA_Admin.push(new Types.ObjectId(stateAdminLGA?._id!));
      stateAdminData?.save();

      return res.status(201).json({
        message: "state Admin verified LGA Leader created successfully",
        data: stateAdminLGA,
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

export const updateLGAEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGALeaderID } = req.params;
    const { email } = req.body;

    const stateAdminData = await LGA_AdminModel.findById(LGALeaderID);

    if (stateAdminData) {
      const stateAdminLGA: any = await LGA_AdminModel.findByIdAndUpdate(
        LGALeaderID,
        { email, verify: true },
        { new: true }
      );

      return res.status(201).json({
        message: "LGA Leader email created successfully",
        data: stateAdminLGA,
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

export const viewLGALeaderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGALeaderID } = req.params;

    const LGALeader = await LGA_AdminModel.findById(LGALeaderID);

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

export const viewLGABranches = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGALeaderID } = req.params;

    const LGA_Branches = await LGA_AdminModel.findById(LGALeaderID).populate({
      path: "branchLeader",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(200).json({
      message: "viewing LGA_Branches record",
      data: LGA_Branches,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying LGA_Branches",
    });
  }
};

export const viewTotalLGAs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const LGA_Branches = await LGA_AdminModel.find();

    return res.status(200).json({
      message: "viewing total LGA record",
      data: LGA_Branches,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying LGA_Branches",
    });
  }
};

export const viewLGADetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGAID } = req.params;

    const stateAdminLGA = await LGA_AdminModel.findById(LGAID).populate({
      path: "branchLeader",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

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

export const outComeCost = async (req: Request, res: Response) => {
  try {
    const { lgaID } = req.params;

    const unit: any = await LGA_AdminModel?.findById(lgaID);
    const x = unit?.operation;

    const sumByDay = _.groupBy(x.flat(), (item: any) => {
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

    const sumByMonth = _.groupBy(x.flat(), (item) => {
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

export const LGADriversOprationNumber = async (req: Request, res: Response) => {
  try {
    const { lgaID } = req.params;
    const unit = await LGA_AdminModel?.findById(lgaID);

    const x = unit?.operation;

    const operation = _.groupBy(x?.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").format(
        "YYYY-MM-DD"
      );
    });

    const opt = Object.fromEntries(
      Object.entries(operation).sort((a: any, b: any) => a - b)
    );

    let operate: any = [];

    for (let i of Object.keys(opt)) {
      let x = _.size(operation[`${i}`]);
      // operate.push(x);
      operate = [...operate, x];
    }

    let option = await LGA_AdminModel?.findByIdAndUpdate(
      lgaID,
      {
        daily_operation: operate,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "viewing unit Officer record",
      // data: operate,
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

export const bestPerformingUnitFormLGA = async (
  req: Request,
  res: Response
) => {
  try {
    const { branchID, LGAID } = req.params;
    const lga: any = await LGA_AdminModel?.findById(LGAID);
    let getBranchesUnits = [];

    for (let i of lga.branchLeader) {
      const branch: any = await branchLeaderModel?.findById(i);
      getBranchesUnits?.push(branch?.unitLeader);
    }

    let xArr: any[] = [];

    for (let i of getBranchesUnits.flat()) {
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

      const dailySumsArray = Object.entries(dailySums).map(([date, data]) => ({
        date,
        ...data,
      }));

      const sortedDailySumsArray = dailySumsArray.sort((a, b) =>
        b.date.localeCompare(a.date)
      );

      xArr.push(sortedDailySumsArray);
    }

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

export const updateLGAProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { phone, bio, name, email } = req.body;

    console.log(phone, bio, name, email);

    const stateAdminLGA = await LGA_AdminModel.findByIdAndUpdate(
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

export const updateLGAAvatar = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const getUser = await LGA_AdminModel.findById(id);
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

      const user = await LGA_AdminModel.findByIdAndUpdate(
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

export const dailyPerformanceLGA = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser: any = await LGA_AdminModel.findById(adminID).populate({
      path: "branchLeader",
    });

    let operate: any = [];

    for (let i of getUser?.LGA_Admin) {
      const LGA: any = await branchLeaderModel.findById(i);
      operate = [...operate, ...LGA?.operation];
    }

    const sumByMonth = _.groupBy(operate.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
        ? moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
        : moment(item.time).format("YYYY-MM-DD");
    });

    const monthlySums = _.mapValues(sumByMonth, (group) => {
      return _.sumBy(group, "cost");
    });

    const monthlySumsArray = Object.entries(monthlySums).map(
      ([month, cost]) => ({
        month,
        cost,
      })
    );

    const breakTotal: any = monthlySumsArray
      .slice(0, 6)
      .map((el) => el.cost)
      .reduce((a: any, b: any) => a + b);

    const breakData: any = monthlySumsArray.slice(0, 6).map((el) => {
      return {
        date: el.month,
        cost: el.cost,
        percent: (el.cost / breakTotal) * 100,
      };
    });

    return res.status(201).json({
      message: "User update successfully",
      data: breakData,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const LGAbranchOperation = async (req: any, res: Response) => {
  try {
    const { LGAID } = req.params;

    const getUser: any = await LGA_AdminModel.findById(LGAID);

    let operate: any = [];

    for (let i of getUser?.branchLeader) {
      const LGA: any = await branchLeaderModel.findById(i);
      operate = [...operate, ...LGA?.operation];
    }

    const sumByMonth = _.groupBy(operate.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
        ? moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
        : moment(item.time).format("YYYY-MM-DD");
    });

    const monthlySums = _.mapValues(sumByMonth, (group) => {
      return {
        cost: _.sumBy(group, "cost"),
        branchLeaderID: group[0]?.branchLeaderID,
        branchLeader: group[0]?.branchLeader,
      };
    });

    const monthlySumsArray = Object.entries(monthlySums).map(
      ([month, data]) => ({
        month,
        ...data,
      })
    );

    const breakTotal: any = monthlySumsArray
      .sort((a: any, b: any) => a.cost + b.cost)
      .slice(0, 4)
      .map((el) => el.cost)
      .reduce((a: any, b: any) => a + b);

    const breakData: any = monthlySumsArray
      .sort((a: any, b: any) => a.cost + b.cost)
      .slice(0, 4)
      .map((el) => {
        return {
          date: el.month,
          cost: el.cost,
          branchLeaderID: el?.branchLeaderID,
          branchLeader: el?.branchLeader,
          percent: (el.cost / breakTotal) * 100,
        };
      });

    return res.status(201).json({
      message: "User update successfully",
      data: breakData,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const LGAdailyPerformanceLGA = async (req: any, res: Response) => {
  try {
    const { LGAID } = req.params;

    const getUser: any = await LGA_AdminModel.findById(LGAID);
    let operate: any = [];

    for (let i of getUser?.branchLeader) {
      const LGA: any = await branchLeaderModel.findById(i);
      operate = [...operate, ...LGA?.operation];
    }

    const sumByMonth = _.groupBy(operate.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
        ? moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
        : moment(item.time).format("YYYY-MM-DD");
    });

    const monthlySums = _.mapValues(sumByMonth, (group) => {
      return _.sumBy(group, "cost");
    });

    const monthlySumsArray = Object.entries(monthlySums).map(
      ([month, cost]) => ({
        month,
        cost,
      })
    );

    const breakTotal: any = monthlySumsArray
      .slice(0, 6)
      .map((el) => el.cost)
      .reduce((a: any, b: any) => a + b);

    const breakData: any = monthlySumsArray.slice(0, 6).map((el) => {
      return {
        date: el.month,
        cost: el.cost,
        percent: (el.cost / breakTotal) * 100,
      };
    });

    return res.status(201).json({
      message: "User update successfully",
      data: breakData,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const unitMembersLGA = async (req: any, res: Response) => {
  try {
    const { LGAID } = req.params;

    const getUser: any = await LGA_AdminModel.findById(LGAID);
    let operate: any = [];
    let operateUnit: any = [];

    console.log(getUser);

    for (let i of getUser?.branchLeader) {
      const LGA: any = await branchLeaderModel.findById(i);
      operateUnit = [...operateUnit, ...LGA?.unitLeader].flat();
    }

    for (let i of operateUnit) {
      const LGA: any = await unitLeaderModel.findById(i);
      operate = [...operate, ...LGA?.operation];
    }

    const sumByMonth = _.groupBy(operate.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
        ? moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
        : moment(item.time).format("YYYY-MM-DD");
    });

    const monthlySums = _.mapValues(sumByMonth, (group) => {
      return {
        cost: _.sumBy(group, "cost"),
        unitLeaderID: group[0]?.unitLeaderID,
        unitLeader: group[0]?.unitLeader,
      };
    });

    const monthlySumsArray = Object.entries(monthlySums).map(
      ([month, data]) => ({
        month,
        ...data,
      })
    );

    const breakData: any = monthlySumsArray
      .slice(0, 6)
      .sort((a: any, b: any) => a + b)
      .map((el) => {
        return {
          unitLeaderID: el?.unitLeaderID,
          unitLeader: el?.unitLeader,
          date: el.month,
          cost: el.cost,
        };
      });

    return res.status(201).json({
      message: "User update successfully",
      data: breakData,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};
