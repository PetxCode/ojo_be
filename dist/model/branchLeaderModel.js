"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const branchLeaderModel = new mongoose_1.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
        default: "Branch Leader",
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
    location: {
        type: String,
    },
    phone: {
        type: String,
    },
    bio: {
        type: String,
    },
    branch_units: {
        type: Number,
    },
    branch_members: {
        type: Number,
    },
    branch_operation: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "branch_operations",
        },
    ],
    best_performing: {
        type: [],
    },
    operation: {
        type: [],
    },
    daily_operation: {
        type: [],
    },
    unitLeader: {
        type: [],
    },
    LGA_Admin: {
        type: mongoose_1.Types.ObjectId,
        ref: "LGA_Admins",
    },
    LGA_AdminID: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("branchLeaders", branchLeaderModel);
