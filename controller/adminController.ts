import { Request, Response } from "express";
import crypto from "node:crypto";
import adminModel from "../model/adminModel";
import { verifiedEmail } from "../utils/email";

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
