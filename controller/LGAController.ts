import { Request, Response } from "express";
import crypto from "node:crypto";
import adminModel from "../model/adminModel";
import { addMemberEmail } from "../utils/email";
import LGA_AdminModel from "../model/LGA_AdminModel";
import { Types } from "mongoose";
import { adminUserData } from "../utils/interfaces";

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
      stateAdminData?.role === "admin" &&
      stateAdminData?.verify === true
    ) {
      const lgaLeader = await LGA_AdminModel.create({
        name,
        adminID: stateAdminID,
        location,
        entryID: id,
      });

      addMemberEmail(lgaLeader, stateAdminData);

      return res.status(201).json({
        message: "creating LGA Leader",
        data: lgaLeader,
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
    const { LGALeaderID } = req.params;

    const LGALeaderData: any = await LGA_AdminModel.findById(LGALeaderID);

    const stateAdminData = await adminModel.findById(LGALeaderData?.adminID);

    if (stateAdminData) {
      const stateAdminLGA: any = await LGA_AdminModel.findByIdAndUpdate(
        LGALeaderID,
        { verify: true },
        { new: true }
      );

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
