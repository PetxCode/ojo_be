import { Request, Response } from "express";
import crypto from "node:crypto";
import { addMemberEmail } from "../utils/email";
import { Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";
import branchLeaderModel from "../model/branchLeaderModel";
import unitLeaderModel from "../model/unitLeaderModel";
import memberModel from "../model/memberModel";

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

    const unitLeaderData: any = await memberModel.findById(memberID);

    const LGALeader = await unitLeaderModel.findById(
      unitLeaderData?.unitLeaderID
    );

    if (LGALeader) {
      const stateAdminLGA: any = await memberModel.findByIdAndUpdate(
        memberID,
        { verify: true },
        { new: true }
      );

      LGALeader.member.push(new Types.ObjectId(stateAdminLGA?._id!));
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
