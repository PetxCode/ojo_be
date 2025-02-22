import { model, Schema, Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";

const unitLeaderModel = new Schema<unitLeaderData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    role: {
      type: String,
      default: "Unit Leader",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    canCreate: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    entryID: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },

    branchLeaderID: {
      type: String,
    },
    LGALeaderID: {
      type: String,
    },

    location: {
      type: String,
    },

    unit_members: {
      type: Number,
    },

    unit_operation: [
      {
        type: Types.ObjectId,
        ref: "unit_operations",
      },
    ],

    daily_operation: {
      type: [],
    },

    best_performing: {
      type: [],
    },

    operation: {
      type: [],
    },

    member: {
      type: [],
    },
    branchLeader: {
      type: Types.ObjectId,
      ref: "branchLeaders",
    },
  },
  {
    timestamps: true,
  }
);

export default model<unitLeaderData>("unitLeaders", unitLeaderModel);
