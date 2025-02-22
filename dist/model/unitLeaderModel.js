"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const unitLeaderModel = new mongoose_1.Schema({
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
            type: mongoose_1.Types.ObjectId,
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
        type: mongoose_1.Types.ObjectId,
        ref: "branchLeaders",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("unitLeaders", unitLeaderModel);
