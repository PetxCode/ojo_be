import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import LGA_AdminModel from "../model/LGA_AdminModel";
import { Types } from "mongoose";
import { branchLeaderData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";

export const createBranchLeader = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { LGALeaderID } = req.params;
    const { name, location } = req.body;

    const LGALeader: branchLeaderData | null = await LGA_AdminModel.findById(
      LGALeaderID
    );
    const id = crypto.randomBytes(6).toString("hex");

    if (
      LGALeader &&
      LGALeader?.role === "LGA Admin" &&
      LGALeader?.verify === true
    ) {
      const branchLeader = await branchLeaderModel.create({
        name,
        LGA_AdminID: LGALeaderID,
        location,
        entryID: id,
      });

      addMemberEmail(branchLeader, LGALeader);

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
    const { branchLeaderID } = req.params;

    const LGALeaderData: any = await branchLeaderModel.findById(branchLeaderID);

    const LGALeader = await LGA_AdminModel.findById(LGALeaderData?.LGA_AdminID);
    console.log(LGALeader);

    if (LGALeader) {
      const stateAdminLGA: any = await branchLeaderModel.findByIdAndUpdate(
        branchLeaderID,
        { verify: true },
        { new: true }
      );

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
