import { Request, Response } from "express";
import crypto from "node:crypto";
import adminModel from "../model/adminModel";
import { verifiedEmail } from "../utils/email";
import jwt from "jsonwebtoken";
import env from "dotenv";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";
import LGA_AdminModel from "../model/LGA_AdminModel";
import memberModel from "../model/memberModel";
import moment from "moment";
import path from "node:path";
import fs from "node:fs";
import _ from "lodash";
import cloudinary from "../utils/cloudinary";
env.config();

export const createStateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name } = req.body;

    const id = crypto.randomBytes(6).toString("hex");

    const stateAdmin = await adminModel.create({
      email,
      name,
      entryID: id,
      status: "admin",
    });

    verifiedEmail(stateAdmin);

    return res.status(201).json({
      message: "creating state Admin",
      data: stateAdmin,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating state Admin",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyStateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;

    const stateAdminData = await adminModel.findById(stateAdminID);

    if (stateAdminData) {
      const stateAdmin = await adminModel.findByIdAndUpdate(
        stateAdminID,
        { verify: true },
        { new: true }
      );

      return res.status(201).json({
        message: "stateAdmin verified successfully",
        data: stateAdmin,
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
      message: "Error verifying stateAdmin",
    });
  }
};

export const viewStateAdminStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;

    const stateAdmin = await adminModel.findById(stateAdminID);

    return res.status(200).json({
      message: "viewing stateAdmin record",
      data: stateAdmin,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying stateAdmin",
    });
  }
};

export const viewStateAdminViewLGA = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;

    const stateAdminLGA = await adminModel.findById(stateAdminID).populate({
      path: "LGA_Admin",
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

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { entryID } = req.body;

    const adminData: any = await adminModel.findOne({ entryID });
    const branchData: any = await branchLeaderModel.findOne({ entryID });
    const unitData: any = await unitLeaderModel.findOne({ entryID });
    const LGAData: any = await LGA_AdminModel.findOne({ entryID });
    const memberData: any = await memberModel.findOne({ entryID });

    if (adminData) {
      if (adminData?.verify) {
        let token = jwt.sign({ data: adminData }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(201).json({
          message: "Admin login successfully",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "Admin not verified",
          status: 404,
        });
      }
    } else if (LGAData) {
      if (LGAData?.verify) {
        let token = jwt.sign({ data: LGAData }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(201).json({
          message: "LGA Admin login successfully",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "LGA Admin not verified",
          status: 404,
        });
      }
    } else if (branchData) {
      if (branchData?.verify) {
        let token = jwt.sign({ data: branchData }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(201).json({
          message: "Branch Leader login successfully",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "Branch Leader not verified",
          status: 404,
        });
      }
    } else if (unitData) {
      if (unitData?.verify) {
        let token = jwt.sign({ data: unitData }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(201).json({
          message: "Unit Leader login successfully",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "Unit Leader not verified",
          status: 404,
        });
      }
    } else if (memberData) {
      if (memberData?.verify) {
        let token = jwt.sign({ data: memberData }, process.env.SECRET_KEY!, {
          expiresIn: "1d",
        });

        return res.status(201).json({
          message: "member login successfully",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "member not verified",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "something went wrong with the Login",
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

export const bestPerformingUnitFromAmdn = async (
  req: Request,
  res: Response
) => {
  try {
    const { adminID } = req.params;
    const admin: any = await adminModel?.findById(adminID);
    let getAdminLGA: any[] = [];

    for (let i of admin.LGA_Admin) {
      const LGA: any = await LGA_AdminModel?.findById(i);
      getAdminLGA?.push(LGA?.branchLeader);
    }

    let getBranchesUnitsID: any[] = [];

    for (let i of getAdminLGA.flat()) {
      const LGA: any = await branchLeaderModel?.findById(i);

      getBranchesUnitsID?.push(LGA?.unitLeader);
    }

    let xArr: any[] = [];

    for (let i of getBranchesUnitsID.flat()) {
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
          unitName: group[0]?.location,
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
      data: xArr.flat(),
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const updateAdminProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;
    const { phone, bio, name, email } = req.body;

    const stateAdminLGA = await adminModel.findByIdAndUpdate(
      stateAdminID,
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

export const updateUserAvatar = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser = await adminModel.findById(adminID);
    if (getUser) {
      let filePath = path.join(__dirname, "../utils/uploads/media");

      const deleteFilesInFolder = (folderPath: any) => {
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);

          files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
          });
        } else {
          console.debug(`The folder '${folderPath}' does not exist.`);
        }
      };

      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path
      );

      const user = await adminModel.findByIdAndUpdate(
        adminID,
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

export const monthlyPerformanceAdmin = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser: any = await adminModel.findById(adminID).populate({
      path: "LGA_Admin",
    });

    let operate: any = [];

    for (let i of getUser?.LGA_Admin) {
      const LGA: any = await LGA_AdminModel.findById(i);
      operate = [...operate, ...LGA?.operation];
    }

    const sumByMonth = _.groupBy(operate.flat(), (item: any) => {
      return moment(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
        ? moment(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM")
        : moment(item.time).format("YYYY-MM");
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

    return res.status(201).json({
      message: "User update successfully",
      data: monthlySumsArray,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const monthlyPerformance = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser: any = await adminModel.findById(adminID).populate({
      path: "LGA_Admin",
    });

    for (let i of getUser?.LGA_Admin) {
      const LGA: any = await LGA_AdminModel.findById(i);
      console.log(LGA);
    }

    return res.status(201).json({
      message: "User update successfully",
      data: getUser,
      status: 201,
    });
  } catch (error: any) {
    return res
      .status(400) // Changed to 400 for a more appropriate error status
      .json({ message: "User not update", error: error.message });
  }
};

export const dailyPerformanceAdmin = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser: any = await adminModel.findById(adminID).populate({
      path: "LGA_Admin",
    });

    let operate: any = [];

    for (let i of getUser?.LGA_Admin) {
      const LGA: any = await LGA_AdminModel.findById(i);
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

export const branchOperation = async (req: any, res: Response) => {
  try {
    const { adminID } = req.params;

    const getUser: any = await adminModel.findById(adminID).populate({
      path: "LGA_Admin",
    });

    let operate: any = [];

    for (let i of getUser?.LGA_Admin) {
      const LGA: any = await LGA_AdminModel.findById(i);
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

// export const branchOperation = async (req: any, res: Response) => {
//   try {
//     const { adminID } = req.params;

//     const getUser: any = await adminModel.findById(adminID).populate({
//       path: "LGA_Admin",
//     });

//     let operate: any = [];
//     let operateII: any = [];

//     for (let i of getUser?.LGA_Admin) {
//       const LGA: any = await LGA_AdminModel.findById(i);
//       operateII = [...operateII, LGA?.branchLeader].flat();
//     }

//     for (let i of operateII) {
//       const LGA: any = await branchLeaderModel.findById(i);
//       operate = [...operate, LGA?.operation].flat();
//     }

//     const sumByMonth = _.groupBy(operate.flat(), "branchLeaderID");

//     const monthlySums = _.mapValues(sumByMonth, (group) => {
//       return _.sumBy(group, "cost");
//     });

//     const monthlySumsArray = Object.entries(monthlySums).map(
//       ([month, cost]) => ({
//         month,
//         cost,
//       })
//     );

//     const breakTotal: any = monthlySumsArray
//       .sort((a: any, b: any) => a.cost + b.cost)
//       .map((el: any) => {
//         return {
//           id: el.month,
//           cost: el.cost,
//           branchLeader: el?.branchLeader,
//           branchLeaderID: el?.branchLeaderID,
//         };
//       });

//     const breakData: any = monthlySumsArray.slice(0, 6);

//     return res.status(201).json({
//       message: "User update successfully",
//       main: breakTotal,
//       data: breakData,
//       status: 201,
//     });
//   } catch (error: any) {
//     return res
//       .status(400) // Changed to 400 for a more appropriate error status
//       .json({ message: "User not update", error: error.message });
//   }
// };

export const viewingMembers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { stateAdminID } = req.params;
    const { phone, bio, name, email } = req.body;

    const members = await memberModel.find();

    return res.status(200).json({
      message: "viewing members record",
      data: members,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying stateAdminLGA",
    });
  }
};
