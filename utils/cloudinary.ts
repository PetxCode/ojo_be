import { v2 as cloudinary } from "cloudinary";
import env from "dotenv";
env.config();

cloudinary.config({
  cloud_name: "dv4dlmp4e",
  api_key: "464513458841612",
  api_secret: "VxFfeGaNMPPudxcq0GWcsh6zfRk",
});

export default cloudinary;
