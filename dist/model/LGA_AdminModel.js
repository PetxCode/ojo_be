"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminUserModel = new mongoose_1.Schema({
    phone: {
        type: String,
    },
    bio: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
        default: "LGA Admin",
    },
    verify: {
        type: Boolean,
        default: true,
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
    location: {
        type: String,
    },
    avatar: {
        type: String,
    },
    adminID: {
        type: String,
    },
    avatarID: {
        type: String,
    },
    lga_branches: {
        type: Number,
    },
    lga_units: {
        type: Number,
    },
    best_performing: {
        type: [],
    },
    lga_members: {
        type: Number,
    },
    operation: [
        {
            type: [],
        },
    ],
    daily_operation: [
        {
            type: [],
        },
    ],
    branchLeader: {
        type: [],
    },
    admin: {
        type: mongoose_1.Types.ObjectId,
        ref: "admins",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("LGA_Admins", adminUserModel);
