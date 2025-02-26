"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberEmail = exports.verifiedEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });
// const url: string = process.env.APP_URL_DEPLOY!;
const url = "https://nurtw-project.web.app";
// const url: string = "https://nurtw-project.web.app";
let adminUserModel;
const verifiedEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientSecret: GOOGLE_SECRET,
                clientId: GOOGLE_ID,
                refreshToken: GOOGLE_REFRESH,
                accessToken,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
        }, "secretCode", {
            expiresIn: "5m",
        });
        let devURL = `${url}/auth/api/verify-admin/${token}`;
        let URL = `${url}/auth/api/verify-admin/${token}`;
        const myPath = path_1.default.join(__dirname, "../views/index.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            link: URL,
            tokenCode: user === null || user === void 0 ? void 0 : user.entryID,
            userName: user === null || user === void 0 ? void 0 : user.name,
        });
        const mailerOption = {
            from: "Road Safety 🚌🚌🚀❤️ <codelabbest@gmail.com>",
            to: user.email,
            subject: "Account Verification",
            html,
        };
        yield transporter.sendMail(mailerOption);
    }
    catch (error) {
        console.error();
    }
});
exports.verifiedEmail = verifiedEmail;
const addMemberEmail = (member, getUser, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // addMemberEmail(lgaLeader, stateAdminData);
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientSecret: GOOGLE_SECRET,
                clientId: GOOGLE_ID,
                refreshToken: GOOGLE_REFRESH,
                accessToken,
            },
        });
        let devURL = `${url}/?${token}`;
        const myPath = path_1.default.join(__dirname, "../views/memberAdded.ejs");
        const html = yield ejs_1.default.renderFile(myPath, {
            relationship: member.role,
            firstName: member.name,
            location: member.location,
            role: member.role,
            link: devURL,
            value: `${member.role !== "member" ? "the Lead Person for" : "a member of"}`,
        });
        const mailerOption = {
            from: "Road Safety 🚌🚌🚀❤️<codelabbest@gmail.com>",
            to: getUser.email,
            subject: `creating ${member === null || member === void 0 ? void 0 : member.role} Notification`,
            html,
        };
        yield transporter.sendMail(mailerOption);
    }
    catch (error) {
        console.error();
    }
});
exports.addMemberEmail = addMemberEmail;
