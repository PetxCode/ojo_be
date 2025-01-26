import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import { Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";

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
      branchLeader?.role === "Branch Leader" &&
      branchLeader?.verify === true
    ) {
      const unitLeader = await unitLeaderModel.create({
        name,
        branchLeaderID,
        location,
        entryID: id,
      });

      addMemberEmail(unitLeader, branchLeader);

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
    const { unitLeaderID } = req.params;

    const LGALeaderData: any = await unitLeaderModel.findById(unitLeaderID);

    const LGALeader = await branchLeaderModel.findById(
      LGALeaderData?.branchLeaderID
    );

    if (LGALeader) {
      const stateAdminLGA: any = await unitLeaderModel.findByIdAndUpdate(
        unitLeaderID,
        { verify: true },
        { new: true }
      );

      LGALeader.unitLeader.push(new Types.ObjectId(stateAdminLGA?._id!));
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
