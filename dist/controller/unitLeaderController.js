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
exports.viewUnitLeaderMembers = exports.viewUnitLeaderStatus = exports.updateUnitAvatar = exports.updateUnitProfile = exports.driversOpration = exports.outComeCost = exports.viewTotalUnit = exports.viewBranchesLeaderUnit = exports.viewBranchLeaderStatus = exports.updateUnitLeaderEmail = exports.verifyUnitLeader = exports.createUnitLeader = exports.loginUnit = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const email_1 = require("../utils/email");
const mongoose_1 = require("mongoose");
const branchLeaderModel_1 = __importDefault(require("../model/branchLeaderModel"));
const unitLeaderModel_1 = __importDefault(require("../model/unitLeaderModel"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const LGA_AdminModel_1 = __importDefault(require("../model/LGA_AdminModel"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
dotenv_1.default.config();
const loginUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const adminData = yield unitLeaderModel_1.default.findOne({ entryID });
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
exports.loginUnit = loginUnit;
const createUnitLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchLeaderID } = req.params;
        const { name, location } = req.body;
        const branchLeader = yield branchLeaderModel_1.default.findById(branchLeaderID);
        const id = node_crypto_1.default.randomBytes(6).toString("hex");
        if (branchLeader &&
            (branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.email) &&
            (branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.role) === "Branch Leader" &&
            (branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.verify) === true) {
            const unitLeader = {
                name,
                role: "Unit Officer",
                branchLeaderID,
                LGALeaderID: branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.LGALeaderID,
                location,
                entryID: id,
            };
            const token = jsonwebtoken_1.default.sign(unitLeader, "just");
            (0, email_1.addMemberEmail)(unitLeader, branchLeader, token);
            return res.status(201).json({
                message: "creating unit Leader",
                data: unitLeader,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "Error creating unit Leader",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating unit Leader",
            data: error.message,
            status: 404,
        });
    }
});
exports.createUnitLeader = createUnitLeader;
const verifyUnitLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const branchLeader = yield branchLeaderModel_1.default.findById((_a = req.body) === null || _a === void 0 ? void 0 : _a.branchLeaderID);
        if (branchLeader) {
            const stateAdminLGA = yield unitLeaderModel_1.default.create(req.body);
            branchLeader.unitLeader.push(new mongoose_1.Types.ObjectId(stateAdminLGA === null || stateAdminLGA === void 0 ? void 0 : stateAdminLGA._id));
            branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.save();
            let unitCount = [];
            for (let i of branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.unitLeader) {
                const x = yield unitLeaderModel_1.default.findById(i);
                unitCount.push(x === null || x === void 0 ? void 0 : x.member);
            }
            const xx = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findByIdAndUpdate(branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.LGA_AdminID, {
                branch_members: unitCount === null || unitCount === void 0 ? void 0 : unitCount.flat().length,
            }, { new: true }));
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
exports.verifyUnitLeader = verifyUnitLeader;
const updateUnitLeaderEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitLeaderID } = req.params;
        const { email } = req.body;
        const brancherLeaderData = yield unitLeaderModel_1.default.findById(unitLeaderID);
        if (brancherLeaderData) {
            const branchLeaderUpdated = yield unitLeaderModel_1.default.findByIdAndUpdate(unitLeaderID, { email, verify: true }, { new: true });
            return res.status(201).json({
                message: "unit Leader email created successfully",
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
exports.updateUnitLeaderEmail = updateUnitLeaderEmail;
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
const viewTotalUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unit = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.find());
        return res.status(200).json({
            message: "viewing unit Officer record",
            data: unit,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.viewTotalUnit = viewTotalUnit;
const outComeCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitID } = req.params;
        const unit = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findById(unitID));
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
const driversOpration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitID } = req.params;
        const unit = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findById(unitID));
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
        console.log(operate);
        let option = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findByIdAndUpdate(unitID, {
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
        });
    }
});
exports.driversOpration = driversOpration;
const updateUnitProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { phone, bio, name, email } = req.body;
        const stateAdminLGA = yield unitLeaderModel_1.default.findByIdAndUpdate(id, {
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
exports.updateUnitProfile = updateUnitProfile;
const updateUnitAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield unitLeaderModel_1.default.findById(id);
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
            const user = yield unitLeaderModel_1.default.findByIdAndUpdate(id, {
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
exports.updateUnitAvatar = updateUnitAvatar;
const viewUnitLeaderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitID } = req.params;
        const LGALeader = yield unitLeaderModel_1.default.findById(unitID);
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
exports.viewUnitLeaderStatus = viewUnitLeaderStatus;
const viewUnitLeaderMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitID } = req.params;
        const unit = yield unitLeaderModel_1.default
            .findById(unitID)
            .populate("member")
            .exec();
        return res.status(200).json({
            message: "viewing unit record",
            data: unit,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying LGALeader",
        });
    }
});
exports.viewUnitLeaderMembers = viewUnitLeaderMembers;
