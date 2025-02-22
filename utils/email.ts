import nodemail from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import env from "dotenv";

import moment from "moment";
env.config();

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

// const url: string = process.env.APP_URL_DEPLOY!;
const url: string = "https://nurtw-project.web.app";

let adminUserModel: any;

export const verifiedEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "secretCode",
      {
        expiresIn: "5m",
      }
    );

    let devURL: string = `${url}/auth/api/verify-admin/${token}`;
    let URL: string = `${url}/auth/api/verify-admin/${token}`;

    const myPath = path.join(__dirname, "../views/index.ejs");
    const html = await ejs.renderFile(myPath, {
      link: URL,
      tokenCode: user?.entryID,
      userName: user?.name,
    });

    const mailerOption = {
      from: "Road Safety 🚌🚌🚀❤️ <codelabbest@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};

export const addMemberEmail = async (member: any, getUser: any) => {
  try {
    // addMemberEmail(lgaLeader, stateAdminData);

    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
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
    let url = "https://nurtw-project.web.app";
    let devURL: string = `${url}/api/verify-${member?.role
      ?.split(" ")[0]
      .toLowerCase()}-leader/${member._id}`;

    const myPath = path.join(__dirname, "../views/memberAdded.ejs");

    const html = await ejs.renderFile(myPath, {
      relationship: member.role,
      firstName: member.name,
      location: member.location,
      role: member.role,
      link: devURL,
      value: `${
        member.role !== "member" ? "the Lead Person for" : "a member of"
      }`,
    });

    const mailerOption = {
      from: "Road Safety 🚌🚌🚀❤️<codelabbest@gmail.com>",
      to: getUser.email,
      subject: `creating ${member?.role} Notification`,
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};
