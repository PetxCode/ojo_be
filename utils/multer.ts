import { Request } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

let filePath = path.join(__dirname, "./uploads/media");

if (!fs.existsSync(filePath)) {
  fs.mkdir(filePath, () => {
    console.log("folder created");
  });
} else {
  console.log("folder exist...");
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, filePath);
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const fileUpload = multer({ storage: storage }).single("file");

export const fileUploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype === "application/json";
    cb(null, true);
  },
}).single("file");
