"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const enums_1 = require("./utils/enums");
const mianError_1 = require("./error/mianError");
const handleError_1 = require("./error/handleError");
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const lgaLeaderRouter_1 = __importDefault(require("./router/lgaLeaderRouter"));
const branchLeaderModel_1 = __importDefault(require("./router/branchLeaderModel"));
const unitLeaderRoute_1 = __importDefault(require("./router/unitLeaderRoute"));
const memberRouter_1 = __importDefault(require("./router/memberRouter"));
const mainApp = (app) => {
    try {
        app.use("/api", adminRouter_1.default);
        app.use("/api", lgaLeaderRouter_1.default);
        app.use("/api", branchLeaderModel_1.default);
        app.use("/api", unitLeaderRoute_1.default);
        app.use("/api", memberRouter_1.default);
        app.get("/", (req, res) => {
            try {
                res.status(200).json({
                    message: "Welcome to Transport API",
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Error loading",
                });
            }
        });
        app.all("*", (req, res, next) => {
            next(new mianError_1.mainError({
                name: `Route Error`,
                message: `Route Error: because the page, ${req.originalUrl} doesn't exist`,
                status: enums_1.HTTP.BAD_REQUEST,
                success: false,
            }));
        });
        app.use(handleError_1.handleError);
    }
    catch (error) {
        return error;
    }
};
exports.mainApp = mainApp;
