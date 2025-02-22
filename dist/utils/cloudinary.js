"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: "dv4dlmp4e",
    api_key: "464513458841612",
    api_secret: "VxFfeGaNMPPudxcq0GWcsh6zfRk",
});
exports.default = cloudinary_1.v2;
