"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memberModel = new mongoose_1.Schema({
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
        default: "member",
    },
    verify: {
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
    plateNumber: {
        type: String,
    },
    nin_Number: {
        type: String,
    },
    location: {
        type: String,
    },
    operation: {
        type: [],
    },
    payment: {
        type: [],
    },
    branchLeaderID: {
        type: String,
    },
    LGALeaderID: {
        type: String,
    },
    unitLeaderID: {
        type: String,
    },
    unitLeader: {
        type: mongoose_1.Types.ObjectId,
        ref: "unitLeaders",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("members", memberModel);
