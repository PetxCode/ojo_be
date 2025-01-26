import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { mainApp } from "./mainApp";
import { dbConfig } from "./utils/config";
dotenv.config();

const port: number = parseInt(process.env.PORT!) || 5500;
const app: Application = express();

app.use(cors());
app.use(express.json());

mainApp(app);

const server = app.listen(port, () => {
  console.clear();
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);

  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);

  server.close(() => {
    process.exit(1);
  });
});
