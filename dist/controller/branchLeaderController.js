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
exports.updateBranchAvatar = exports.updateBranchProfile = exports.bestPerformingUnit = exports.branchDriversOpration = exports.outComeCost = exports.viewTotalBranches = exports.viewBranchesLeaderUnit = exports.viewBranchLeaderStatus = exports.updateBranchLeaderEmail = exports.verifyBranchLeader = exports.createBranchLeader = exports.loginBranch = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const email_1 = require("../utils/email");
const LGA_AdminModel_1 = __importDefault(require("../model/LGA_AdminModel"));
const mongoose_1 = require("mongoose");
const branchLeaderModel_1 = __importDefault(require("../model/branchLeaderModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const unitLeaderModel_1 = __importDefault(require("../model/unitLeaderModel"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
dotenv_1.default.config();
const loginBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const adminData = yield branchLeaderModel_1.default.findOne({ entryID });
        if (adminData) {
            if (adminData === null || adminData === void 0 ? void 0 : adminData.verify) {
                let token = jsonwebtoken_1.default.sign({ id: adminData === null || adminData === void 0 ? void 0 : adminData._id }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(200).json({
                    message: "Admin login successfully",
                    data: token,
                    status: 200,
                });
            }
            else {
                return res.status(404).json({
                    message: "Admin not verified",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "can't find admin",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
            status: 404,
        });
    }
});
exports.loginBranch = loginBranch;
const createBranchLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { LGALeaderID } = req.params;
        const { name, location } = req.body;
        const LGALeader = yield LGA_AdminModel_1.default.findById(LGALeaderID);
        const id = node_crypto_1.default.randomBytes(6).toString("hex");
        if (LGALeader &&
            (LGALeader === null || LGALeader === void 0 ? void 0 : LGALeader.role) === "LGA Admin" &&
            (LGALeader === null || LGALeader === void 0 ? void 0 : LGALeader.verify) === true) {
            const branchLeader = yield branchLeaderModel_1.default.create({
                name,
                LGA_AdminID: LGALeaderID,
                location,
                entryID: id,
            });
            (0, email_1.addMemberEmail)(branchLeader, LGALeader);
            LGA_AdminModel_1.default.findByIdAndUpdate(LGALeaderID, {
                lga_branches: (LGALeader === null || LGALeader === void 0 ? void 0 : LGALeader.lga_branches) + 1,
            }, { new: true });
            return res.status(201).json({
                message: "creating LGA-Branch Leader",
                data: branchLeader,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "Error creating LGA-Branch Leader",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating LGA-Branch Leader",
            data: error.message,
            status: 404,
        });
    }
});
exports.createBranchLeader = createBranchLeader;
const verifyBranchLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchLeaderID } = req.params;
        const LGALeaderData = yield branchLeaderModel_1.default.findById(branchLeaderID);
        const LGALeader = yield LGA_AdminModel_1.default.findById(LGALeaderData === null || LGALeaderData === void 0 ? void 0 : LGALeaderData.LGA_AdminID);
        if (LGALeader) {
            const stateAdminLGA = yield branchLeaderModel_1.default.findByIdAndUpdate(branchLeaderID, { verify: true }, { new: true });
            LGALeader.branchLeader.push(new mongoose_1.Types.ObjectId(stateAdminLGA === null || stateAdminLGA === void 0 ? void 0 : stateAdminLGA._id));
            LGALeader === null || LGALeader === void 0 ? void 0 : LGALeader.save();
            return res.status(201).json({
                message: "LGA has verified Branch Leader created successfully",
                data: stateAdminLGA,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "error finding LGA Admin",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying LGA Admin ",
        });
    }
});
exports.verifyBranchLeader = verifyBranchLeader;
const updateBranchLeaderEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchLeaderID } = req.params;
        const { email } = req.body;
        const brancherLeaderData = yield branchLeaderModel_1.default.findById(branchLeaderID);
        if (brancherLeaderData) {
            const branchLeaderUpdated = yield branchLeaderModel_1.default.findByIdAndUpdate(branchLeaderID, { email, verify: true }, { new: true });
            return res.status(201).json({
                message: "Branch Leader email created successfully",
                data: branchLeaderUpdated,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "error finding stateAdmin",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying stateAdmin ",
        });
    }
});
exports.updateBranchLeaderEmail = updateBranchLeaderEmail;
const viewBranchLeaderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchLeaderID } = req.params;
        const branchLeader = yield branchLeaderModel_1.default.findById(branchLeaderID);
        return res.status(200).json({
            message: "viewing Branch Leader record",
            data: branchLeader,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying branchLeader",
        });
    }
});
exports.viewBranchLeaderStatus = viewBranchLeaderStatus;
const viewBranchesLeaderUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchLeaderID } = req.params;
        const branchLeader = yield branchLeaderModel_1.default
            .findById(branchLeaderID)
            .populate({
            path: "unitLeader",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(200).json({
            message: "viewing Branch Leader record",
            data: branchLeader,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Branch Leader",
        });
    }
});
exports.viewBranchesLeaderUnit = viewBranchesLeaderUnit;
const viewTotalBranches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branch = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.find());
        return res.status(200).json({
            message: "viewing Branch Leader record",
            data: branch,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.viewTotalBranches = viewTotalBranches;
const outComeCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchID } = req.params;
        const unit = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(branchID));
        const x = unit === null || unit === void 0 ? void 0 : unit.operation;
        const sumByDay = lodash_1.default.groupBy(x, (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
        });
        const dailySums = lodash_1.default.mapValues(sumByDay, (group) => {
            return lodash_1.default.sumBy(group, "cost");
        });
        const sortedDailySums = Object.fromEntries(Object.entries(dailySums).sort((a, b) => a[1] - b[1]));
        const sumByMonth = lodash_1.default.groupBy(x, (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM");
        });
        const monthlySums = lodash_1.default.mapValues(sumByMonth, (group) => {
            return lodash_1.default.sumBy(group, "cost");
        });
        const sortedMonthlySums = Object.fromEntries(Object.entries(monthlySums).sort((a, b) => a[1] - b[1]));
        return res.status(200).json({
            message: "viewing unit Officer record",
            data: {
                daily: sortedDailySums,
                monthly: sortedMonthlySums,
            },
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.outComeCost = outComeCost;
const branchDriversOpration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchID } = req.params;
        const unit = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(branchID));
        const x = unit === null || unit === void 0 ? void 0 : unit.operation;
        const operation = lodash_1.default.groupBy(x, (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
        });
        const opt = Object.fromEntries(Object.entries(operation).sort((a, b) => a - b));
        let operate = [];
        for (let i of Object.keys(opt)) {
            console.log([`${i}`]);
            let x = lodash_1.default.size(operation[`${i}`]);
            console.log("reading: ", x);
            operate.push(x);
        }
        let option = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findByIdAndUpdate(branchID, {
            daily_operation: operate,
        }, { new: true }));
        return res.status(200).json({
            message: "viewing unit Officer record",
            data: option === null || option === void 0 ? void 0 : option.daily_operation,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            err: error.message,
        });
    }
});
exports.branchDriversOpration = branchDriversOpration;
const bestPerformingUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchID } = req.params;
        const branch = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findByIdAndUpdate(branchID));
        let xArr = [];
        for (let i of branch === null || branch === void 0 ? void 0 : branch.unitLeader) {
            const unit = yield unitLeaderModel_1.default.findById(i);
            const x = unit === null || unit === void 0 ? void 0 : unit.operation;
            const sumByDay = lodash_1.default.groupBy(x, (item) => {
                return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
            });
            const dailySums = lodash_1.default.mapValues(sumByDay, (group) => {
                var _a;
                return {
                    cost: lodash_1.default.sumBy(group, "cost"),
                    unitLeaderID: (_a = group[0]) === null || _a === void 0 ? void 0 : _a.unitLeaderID,
                };
            });
            const sortedDailySums = Object.fromEntries(Object.entries(dailySums).sort((a, b) => a[1] - b[1]));
            console.log("x: ", sortedDailySums);
            xArr.push(sortedDailySums);
        }
        console.log(xArr);
        return res.status(200).json({
            message: "viewing Branch Officer record",
            data: xArr,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.bestPerformingUnit = bestPerformingUnit;
const updateBranchProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { phone, bio, name } = req.body;
        const stateAdminLGA = yield branchLeaderModel_1.default.findByIdAndUpdate(id, {
            phone,
            bio,
            name,
        }, { new: true });
        return res.status(200).json({
            message: "viewing stateAdminLGA record",
            data: stateAdminLGA,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying stateAdminLGA",
        });
    }
});
exports.updateBranchProfile = updateBranchProfile;
const updateBranchAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield branchLeaderModel_1.default.findById(id);
        if (getUser) {
            let filePath = node_path_1.default.join(__dirname, "../utils/uploads/media");
            const deleteFilesInFolder = (folderPath) => {
                if (node_fs_1.default.existsSync(folderPath)) {
                    const files = node_fs_1.default.readdirSync(folderPath);
                    files.forEach((file) => {
                        const filePath = node_path_1.default.join(folderPath, file);
                        node_fs_1.default.unlinkSync(filePath);
                    });
                    console.log(`All files in the folder '${folderPath}' have been deleted.`);
                }
                else {
                    console.log(`The folder '${folderPath}' does not exist.`);
                }
            };
            const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
            const user = yield branchLeaderModel_1.default.findByIdAndUpdate(id, {
                avatar: secure_url,
                avatarID: public_id,
            }, { new: true });
            deleteFilesInFolder(filePath);
            return res
                .status(201)
                .json({ message: "User update successfully", data: user, status: 201 });
        }
        else {
            return res
                .status(400) // Changed to 400 for a more appropriate error status
                .json({ message: "deos not exist" });
        }
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.updateBranchAvatar = updateBranchAvatar;
