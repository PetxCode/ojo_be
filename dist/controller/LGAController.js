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
exports.updateLGAAvatar = exports.updateLGAProfile = exports.bestPerformingUnitFormLGA = exports.LGADriversOprationNumber = exports.outComeCost = exports.viewLGADetails = exports.viewTotalLGAs = exports.viewLGABranches = exports.viewLGALeaderStatus = exports.updateLGAEmail = exports.verifyLGACreatedByStateAdmin = exports.createLGALeader = exports.loginLGA = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const email_1 = require("../utils/email");
const LGA_AdminModel_1 = __importDefault(require("../model/LGA_AdminModel"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const lodash_1 = __importDefault(require("lodash"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const branchLeaderModel_1 = __importDefault(require("../model/branchLeaderModel"));
const unitLeaderModel_1 = __importDefault(require("../model/unitLeaderModel"));
dotenv_1.default.config();
const loginLGA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const adminData = yield LGA_AdminModel_1.default.findOne({ entryID });
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
exports.loginLGA = loginLGA;
const createLGALeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const { name, location } = req.body;
        const stateAdminData = yield adminModel_1.default.findById(stateAdminID);
        const id = node_crypto_1.default.randomBytes(6).toString("hex");
        if (stateAdminData &&
            (stateAdminData === null || stateAdminData === void 0 ? void 0 : stateAdminData.email) &&
            (stateAdminData === null || stateAdminData === void 0 ? void 0 : stateAdminData.role) === "admin" &&
            (stateAdminData === null || stateAdminData === void 0 ? void 0 : stateAdminData.verify) === true) {
            const token = jsonwebtoken_1.default.sign({
                name,
                adminID: stateAdminID,
                location,
                entryID: id,
            }, "just");
            const userData = {
                name,
                adminID: stateAdminID,
                location,
                entryID: id,
                role: "LGA Officer",
            };
            (0, email_1.addMemberEmail)(userData, stateAdminData, token);
            return res.status(201).json({
                message: "creating LGA Leader",
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "Error creating LGA Leader",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating LGA Leader",
            data: error.message,
            status: 404,
        });
    }
});
exports.createLGALeader = createLGALeader;
const verifyLGACreatedByStateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const stateAdminData = yield adminModel_1.default.findById((_a = req.body) === null || _a === void 0 ? void 0 : _a.adminID);
        if (stateAdminData) {
            const stateAdminLGA = yield LGA_AdminModel_1.default.create(req.body);
            stateAdminData.LGA_Admin.push(new mongoose_1.Types.ObjectId(stateAdminLGA === null || stateAdminLGA === void 0 ? void 0 : stateAdminLGA._id));
            stateAdminData === null || stateAdminData === void 0 ? void 0 : stateAdminData.save();
            return res.status(201).json({
                message: "state Admin verified LGA Leader created successfully",
                data: stateAdminLGA,
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
exports.verifyLGACreatedByStateAdmin = verifyLGACreatedByStateAdmin;
const updateLGAEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { LGALeaderID } = req.params;
        const { email } = req.body;
        const stateAdminData = yield LGA_AdminModel_1.default.findById(LGALeaderID);
        if (stateAdminData) {
            const stateAdminLGA = yield LGA_AdminModel_1.default.findByIdAndUpdate(LGALeaderID, { email, verify: true }, { new: true });
            return res.status(201).json({
                message: "LGA Leader email created successfully",
                data: stateAdminLGA,
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
exports.updateLGAEmail = updateLGAEmail;
const viewLGALeaderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { LGALeaderID } = req.params;
        const LGALeader = yield LGA_AdminModel_1.default.findById(LGALeaderID);
        return res.status(200).json({
            message: "viewing LGALeader record",
            data: LGALeader,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying LGALeader",
        });
    }
});
exports.viewLGALeaderStatus = viewLGALeaderStatus;
const viewLGABranches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { LGALeaderID } = req.params;
        const LGA_Branches = yield LGA_AdminModel_1.default.findById(LGALeaderID).populate({
            path: "branchLeader",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(200).json({
            message: "viewing LGA_Branches record",
            data: LGA_Branches,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying LGA_Branches",
        });
    }
});
exports.viewLGABranches = viewLGABranches;
const viewTotalLGAs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const LGA_Branches = yield LGA_AdminModel_1.default.find();
        return res.status(200).json({
            message: "viewing total LGA record",
            data: LGA_Branches,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying LGA_Branches",
        });
    }
});
exports.viewTotalLGAs = viewTotalLGAs;
const viewLGADetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { LGAID } = req.params;
        const stateAdminLGA = yield LGA_AdminModel_1.default.findById(LGAID).populate({
            path: "branchLeader",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
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
exports.viewLGADetails = viewLGADetails;
const outComeCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lgaID } = req.params;
        const unit = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(lgaID));
        const x = unit === null || unit === void 0 ? void 0 : unit.operation;
        const sumByDay = lodash_1.default.groupBy(x.flat(), (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
        });
        const dailySums = lodash_1.default.mapValues(sumByDay, (group) => {
            return lodash_1.default.sumBy(group, "cost");
        });
        const sortedDailySums = Object.fromEntries(Object.entries(dailySums).sort((a, b) => a[1] - b[1]));
        const sumByMonth = lodash_1.default.groupBy(x.flat(), (item) => {
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
const LGADriversOprationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lgaID } = req.params;
        const unit = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(lgaID));
        const x = unit === null || unit === void 0 ? void 0 : unit.operation;
        const operation = lodash_1.default.groupBy(x === null || x === void 0 ? void 0 : x.flat(), (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
        });
        const opt = Object.fromEntries(Object.entries(operation).sort((a, b) => a - b));
        let operate = [];
        for (let i of Object.keys(opt)) {
            let x = lodash_1.default.size(operation[`${i}`]);
            // operate.push(x);
            operate = [...operate, x];
        }
        let option = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findByIdAndUpdate(lgaID, {
            daily_operation: operate,
        }, { new: true }));
        return res.status(200).json({
            message: "viewing unit Officer record",
            // data: operate,
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
exports.LGADriversOprationNumber = LGADriversOprationNumber;
const bestPerformingUnitFormLGA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchID, LGAID } = req.params;
        const lga = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(LGAID));
        let getBranchesUnits = [];
        for (let i of lga.branchLeader) {
            const branch = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(i));
            getBranchesUnits === null || getBranchesUnits === void 0 ? void 0 : getBranchesUnits.push(branch === null || branch === void 0 ? void 0 : branch.unitLeader);
        }
        let xArr = [];
        for (let i of getBranchesUnits.flat()) {
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
            const dailySumsArray = Object.entries(dailySums).map(([date, data]) => (Object.assign({ date }, data)));
            const sortedDailySumsArray = dailySumsArray.sort((a, b) => b.date.localeCompare(a.date));
            xArr.push(sortedDailySumsArray);
        }
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
exports.bestPerformingUnitFormLGA = bestPerformingUnitFormLGA;
const updateLGAProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { phone, bio, name, email } = req.body;
        console.log(phone, bio, name, email);
        const stateAdminLGA = yield LGA_AdminModel_1.default.findByIdAndUpdate(id, {
            phone,
            bio,
            name,
            email,
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
exports.updateLGAProfile = updateLGAProfile;
const updateLGAAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield LGA_AdminModel_1.default.findById(id);
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
            const user = yield LGA_AdminModel_1.default.findByIdAndUpdate(id, {
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
exports.updateLGAAvatar = updateLGAAvatar;
