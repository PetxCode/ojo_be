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
exports.viewingMembers = exports.branchOperation = exports.dailyPerformanceAdmin = exports.monthlyPerformance = exports.monthlyPerformanceAdmin = exports.updateUserAvatar = exports.updateAdminProfile = exports.bestPerformingUnitFromAmdn = exports.loginAdmin = exports.viewStateAdminViewLGA = exports.viewStateAdminStatus = exports.verifyStateAdmin = exports.createStateAdmin = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const branchLeaderModel_1 = __importDefault(require("../model/branchLeaderModel"));
const unitLeaderModel_1 = __importDefault(require("../model/unitLeaderModel"));
const LGA_AdminModel_1 = __importDefault(require("../model/LGA_AdminModel"));
const memberModel_1 = __importDefault(require("../model/memberModel"));
const moment_1 = __importDefault(require("moment"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const lodash_1 = __importDefault(require("lodash"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
dotenv_1.default.config();
const createStateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        const id = node_crypto_1.default.randomBytes(6).toString("hex");
        const stateAdmin = yield adminModel_1.default.create({
            email,
            name,
            entryID: id,
            status: "admin",
        });
        (0, email_1.verifiedEmail)(stateAdmin);
        return res.status(201).json({
            message: "creating state Admin",
            data: stateAdmin,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating state Admin",
            data: error.message,
            status: 404,
        });
    }
});
exports.createStateAdmin = createStateAdmin;
const verifyStateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const stateAdminData = yield adminModel_1.default.findById(stateAdminID);
        if (stateAdminData) {
            const stateAdmin = yield adminModel_1.default.findByIdAndUpdate(stateAdminID, { verify: true }, { new: true });
            return res.status(201).json({
                message: "stateAdmin verified successfully",
                data: stateAdmin,
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
            message: "Error verifying stateAdmin",
        });
    }
});
exports.verifyStateAdmin = verifyStateAdmin;
const viewStateAdminStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const stateAdmin = yield adminModel_1.default.findById(stateAdminID);
        return res.status(200).json({
            message: "viewing stateAdmin record",
            data: stateAdmin,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying stateAdmin",
        });
    }
});
exports.viewStateAdminStatus = viewStateAdminStatus;
const viewStateAdminViewLGA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const stateAdminLGA = yield adminModel_1.default.findById(stateAdminID).populate({
            path: "LGA_Admin",
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
exports.viewStateAdminViewLGA = viewStateAdminViewLGA;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const adminData = yield adminModel_1.default.findOne({ entryID });
        const branchData = yield branchLeaderModel_1.default.findOne({ entryID });
        const unitData = yield unitLeaderModel_1.default.findOne({ entryID });
        const LGAData = yield LGA_AdminModel_1.default.findOne({ entryID });
        const memberData = yield memberModel_1.default.findOne({ entryID });
        if (adminData) {
            if (adminData === null || adminData === void 0 ? void 0 : adminData.verify) {
                let token = jsonwebtoken_1.default.sign({ data: adminData }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(201).json({
                    message: "Admin login successfully",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "Admin not verified",
                    status: 404,
                });
            }
        }
        else if (LGAData) {
            if (LGAData === null || LGAData === void 0 ? void 0 : LGAData.verify) {
                let token = jsonwebtoken_1.default.sign({ data: LGAData }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(201).json({
                    message: "LGA Admin login successfully",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "LGA Admin not verified",
                    status: 404,
                });
            }
        }
        else if (branchData) {
            if (branchData === null || branchData === void 0 ? void 0 : branchData.verify) {
                let token = jsonwebtoken_1.default.sign({ data: branchData }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(201).json({
                    message: "Branch Leader login successfully",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "Branch Leader not verified",
                    status: 404,
                });
            }
        }
        else if (unitData) {
            if (unitData === null || unitData === void 0 ? void 0 : unitData.verify) {
                let token = jsonwebtoken_1.default.sign({ data: unitData }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(201).json({
                    message: "Unit Leader login successfully",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "Unit Leader not verified",
                    status: 404,
                });
            }
        }
        else if (memberData) {
            if (memberData === null || memberData === void 0 ? void 0 : memberData.verify) {
                let token = jsonwebtoken_1.default.sign({ data: memberData }, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                return res.status(201).json({
                    message: "member login successfully",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "member not verified",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "something went wrong with the Login",
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
exports.loginAdmin = loginAdmin;
const bestPerformingUnitFromAmdn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const admin = yield (adminModel_1.default === null || adminModel_1.default === void 0 ? void 0 : adminModel_1.default.findById(adminID));
        let getAdminLGA = [];
        for (let i of admin.LGA_Admin) {
            const LGA = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(i));
            getAdminLGA === null || getAdminLGA === void 0 ? void 0 : getAdminLGA.push(LGA === null || LGA === void 0 ? void 0 : LGA.branchLeader);
        }
        let getBranchesUnitsID = [];
        for (let i of getAdminLGA.flat()) {
            const LGA = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(i));
            getBranchesUnitsID === null || getBranchesUnitsID === void 0 ? void 0 : getBranchesUnitsID.push(LGA === null || LGA === void 0 ? void 0 : LGA.unitLeader);
        }
        let xArr = [];
        for (let i of getBranchesUnitsID.flat()) {
            const unit = yield unitLeaderModel_1.default.findById(i);
            const x = unit === null || unit === void 0 ? void 0 : unit.operation;
            const sumByDay = lodash_1.default.groupBy(x, (item) => {
                return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD");
            });
            const dailySums = lodash_1.default.mapValues(sumByDay, (group) => {
                var _a, _b;
                return {
                    cost: lodash_1.default.sumBy(group, "cost"),
                    unitLeaderID: (_a = group[0]) === null || _a === void 0 ? void 0 : _a.unitLeaderID,
                    unitName: (_b = group[0]) === null || _b === void 0 ? void 0 : _b.location,
                };
            });
            const dailySumsArray = Object.entries(dailySums).map(([date, data]) => (Object.assign({ date }, data)));
            const sortedDailySumsArray = dailySumsArray.sort((a, b) => b.date.localeCompare(a.date));
            xArr.push(sortedDailySumsArray);
        }
        return res.status(200).json({
            message: "viewing Branch Officer record",
            data: xArr.flat(),
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.bestPerformingUnitFromAmdn = bestPerformingUnitFromAmdn;
const updateAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const { phone, bio, name, email } = req.body;
        const stateAdminLGA = yield adminModel_1.default.findByIdAndUpdate(stateAdminID, {
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
exports.updateAdminProfile = updateAdminProfile;
const updateUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const getUser = yield adminModel_1.default.findById(adminID);
        if (getUser) {
            let filePath = node_path_1.default.join(__dirname, "../utils/uploads/media");
            const deleteFilesInFolder = (folderPath) => {
                if (node_fs_1.default.existsSync(folderPath)) {
                    const files = node_fs_1.default.readdirSync(folderPath);
                    files.forEach((file) => {
                        const filePath = node_path_1.default.join(folderPath, file);
                        node_fs_1.default.unlinkSync(filePath);
                    });
                }
                else {
                    console.debug(`The folder '${folderPath}' does not exist.`);
                }
            };
            const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
            const user = yield adminModel_1.default.findByIdAndUpdate(adminID, {
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
exports.updateUserAvatar = updateUserAvatar;
const monthlyPerformanceAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const getUser = yield adminModel_1.default.findById(adminID).populate({
            path: "LGA_Admin",
        });
        let operate = [];
        for (let i of getUser === null || getUser === void 0 ? void 0 : getUser.LGA_Admin) {
            const LGA = yield LGA_AdminModel_1.default.findById(i);
            operate = [...operate, ...LGA === null || LGA === void 0 ? void 0 : LGA.operation];
        }
        const sumByMonth = lodash_1.default.groupBy(operate.flat(), (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
                ? (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM")
                : (0, moment_1.default)(item.time).format("YYYY-MM");
        });
        const monthlySums = lodash_1.default.mapValues(sumByMonth, (group) => {
            return lodash_1.default.sumBy(group, "cost");
        });
        const monthlySumsArray = Object.entries(monthlySums).map(([month, cost]) => ({
            month,
            cost,
        }));
        return res.status(201).json({
            message: "User update successfully",
            data: monthlySumsArray,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.monthlyPerformanceAdmin = monthlyPerformanceAdmin;
const monthlyPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const getUser = yield adminModel_1.default.findById(adminID).populate({
            path: "LGA_Admin",
        });
        for (let i of getUser === null || getUser === void 0 ? void 0 : getUser.LGA_Admin) {
            const LGA = yield LGA_AdminModel_1.default.findById(i);
            console.log(LGA);
        }
        return res.status(201).json({
            message: "User update successfully",
            data: getUser,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.monthlyPerformance = monthlyPerformance;
const dailyPerformanceAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const getUser = yield adminModel_1.default.findById(adminID).populate({
            path: "LGA_Admin",
        });
        let operate = [];
        for (let i of getUser === null || getUser === void 0 ? void 0 : getUser.LGA_Admin) {
            const LGA = yield LGA_AdminModel_1.default.findById(i);
            operate = [...operate, ...LGA === null || LGA === void 0 ? void 0 : LGA.operation];
        }
        const sumByMonth = lodash_1.default.groupBy(operate.flat(), (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
                ? (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
                : (0, moment_1.default)(item.time).format("YYYY-MM-DD");
        });
        const monthlySums = lodash_1.default.mapValues(sumByMonth, (group) => {
            return lodash_1.default.sumBy(group, "cost");
        });
        const monthlySumsArray = Object.entries(monthlySums).map(([month, cost]) => ({
            month,
            cost,
        }));
        const breakTotal = monthlySumsArray
            .slice(0, 6)
            .map((el) => el.cost)
            .reduce((a, b) => a + b);
        const breakData = monthlySumsArray.slice(0, 6).map((el) => {
            return {
                date: el.month,
                cost: el.cost,
                percent: (el.cost / breakTotal) * 100,
            };
        });
        return res.status(201).json({
            message: "User update successfully",
            data: breakData,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.dailyPerformanceAdmin = dailyPerformanceAdmin;
const branchOperation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const getUser = yield adminModel_1.default.findById(adminID).populate({
            path: "LGA_Admin",
        });
        let operate = [];
        for (let i of getUser === null || getUser === void 0 ? void 0 : getUser.LGA_Admin) {
            const LGA = yield LGA_AdminModel_1.default.findById(i);
            operate = [...operate, ...LGA === null || LGA === void 0 ? void 0 : LGA.operation];
        }
        const sumByMonth = lodash_1.default.groupBy(operate.flat(), (item) => {
            return (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").isValid()
                ? (0, moment_1.default)(item.time, "dddd, MMMM D, YYYY h:mm A").format("YYYY-MM-DD")
                : (0, moment_1.default)(item.time).format("YYYY-MM-DD");
        });
        const monthlySums = lodash_1.default.mapValues(sumByMonth, (group) => {
            var _a, _b;
            return {
                cost: lodash_1.default.sumBy(group, "cost"),
                branchLeaderID: (_a = group[0]) === null || _a === void 0 ? void 0 : _a.branchLeaderID,
                branchLeader: (_b = group[0]) === null || _b === void 0 ? void 0 : _b.branchLeader,
            };
        });
        const monthlySumsArray = Object.entries(monthlySums).map(([month, data]) => (Object.assign({ month }, data)));
        const breakTotal = monthlySumsArray
            .sort((a, b) => a.cost + b.cost)
            .slice(0, 4)
            .map((el) => el.cost)
            .reduce((a, b) => a + b);
        const breakData = monthlySumsArray
            .sort((a, b) => a.cost + b.cost)
            .slice(0, 4)
            .map((el) => {
            return {
                date: el.month,
                cost: el.cost,
                branchLeaderID: el === null || el === void 0 ? void 0 : el.branchLeaderID,
                branchLeader: el === null || el === void 0 ? void 0 : el.branchLeader,
                percent: (el.cost / breakTotal) * 100,
            };
        });
        return res.status(201).json({
            message: "User update successfully",
            data: breakData,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(400) // Changed to 400 for a more appropriate error status
            .json({ message: "User not update", error: error.message });
    }
});
exports.branchOperation = branchOperation;
// export const branchOperation = async (req: any, res: Response) => {
//   try {
//     const { adminID } = req.params;
//     const getUser: any = await adminModel.findById(adminID).populate({
//       path: "LGA_Admin",
//     });
//     let operate: any = [];
//     let operateII: any = [];
//     for (let i of getUser?.LGA_Admin) {
//       const LGA: any = await LGA_AdminModel.findById(i);
//       operateII = [...operateII, LGA?.branchLeader].flat();
//     }
//     for (let i of operateII) {
//       const LGA: any = await branchLeaderModel.findById(i);
//       operate = [...operate, LGA?.operation].flat();
//     }
//     const sumByMonth = _.groupBy(operate.flat(), "branchLeaderID");
//     const monthlySums = _.mapValues(sumByMonth, (group) => {
//       return _.sumBy(group, "cost");
//     });
//     const monthlySumsArray = Object.entries(monthlySums).map(
//       ([month, cost]) => ({
//         month,
//         cost,
//       })
//     );
//     const breakTotal: any = monthlySumsArray
//       .sort((a: any, b: any) => a.cost + b.cost)
//       .map((el: any) => {
//         return {
//           id: el.month,
//           cost: el.cost,
//           branchLeader: el?.branchLeader,
//           branchLeaderID: el?.branchLeaderID,
//         };
//       });
//     const breakData: any = monthlySumsArray.slice(0, 6);
//     return res.status(201).json({
//       message: "User update successfully",
//       main: breakTotal,
//       data: breakData,
//       status: 201,
//     });
//   } catch (error: any) {
//     return res
//       .status(400) // Changed to 400 for a more appropriate error status
//       .json({ message: "User not update", error: error.message });
//   }
// };
const viewingMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateAdminID } = req.params;
        const { phone, bio, name, email } = req.body;
        const members = yield memberModel_1.default.find();
        return res.status(200).json({
            message: "viewing members record",
            data: members,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying stateAdminLGA",
        });
    }
});
exports.viewingMembers = viewingMembers;
