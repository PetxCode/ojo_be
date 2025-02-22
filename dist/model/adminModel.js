"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminModel = new mongoose_1.Schema({
    bio: {
        type: String,
    },
    phone: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "admin",
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
    best_performing: {
        type: [],
    },
    LGA_Admin: {
        type: [],
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("admins", adminModel);
