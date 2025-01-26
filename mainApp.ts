import { Application, NextFunction, Request, Response } from "express";
import { HTTP } from "./utils/enums";
import { mainError } from "./error/mianError";
import { handleError } from "./error/handleError";

import admin from "./router/adminRouter";
import lga from "./router/lgaLeaderRouter";
import branch from "./router/branchLeaderModel";
import unit from "./router/unitLeaderRoute";
import member from "./router/memberRouter";
export const mainApp = (app: Application) => {
  try {
    app.use("/api", admin);
    app.use("/api", lga);
    app.use("/api", branch);
    app.use("/api", unit);
    app.use("/api", member);

    app.get("/", (req: Request, res: Response) => {
      try {
        res.status(200).json({
          message: "Welcome to Transport API",
        });
      } catch (error) {
        res.status(404).json({
          message: "Error loading",
        });
      }
    });

    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainError({
          name: `Route Error`,
          message: `Route Error: because the page, ${req.originalUrl} doesn't exist`,
          status: HTTP.BAD_REQUEST,
          success: false,
        })
      );
    });
    app.use(handleError);
  } catch (error) {
    return error;
  }
};
