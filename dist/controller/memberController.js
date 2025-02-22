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
exports.viewMemberStatus = exports.updateMemberAvatar = exports.updateMemberProfile = exports.makePaymentWithMembersID = exports.makePaymentMembers = exports.viewTotalMembers = exports.viewBranchesLeaderUnit = exports.viewBranchLeaderStatus = exports.updateMemberLeaderEmail = exports.verifyMember = exports.createMember = exports.loginMember = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const email_1 = require("../utils/email");
const mongoose_1 = require("mongoose");
const branchLeaderModel_1 = __importDefault(require("../model/branchLeaderModel"));
const unitLeaderModel_1 = __importDefault(require("../model/unitLeaderModel"));
const memberModel_1 = __importDefault(require("../model/memberModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const LGA_AdminModel_1 = __importDefault(require("../model/LGA_AdminModel"));
const moment_1 = __importDefault(require("moment"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
dotenv_1.default.config();
const loginMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const adminData = yield memberModel_1.default.findOne({ entryID });
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
exports.loginMember = loginMember;
const createMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitLeaderID } = req.params;
        const { name, location } = req.body;
        const unitLeader = yield unitLeaderModel_1.default.findById(unitLeaderID);
        const id = node_crypto_1.default.randomBytes(6).toString("hex");
        if (unitLeader &&
            (unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.role) === "Unit Leader" &&
            (unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.verify) === true) {
            const member = yield memberModel_1.default.create({
                name,
                unitLeaderID,
                LGALeaderID: unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.LGALeaderID,
                branchLeaderID: unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.branchLeaderID,
                location,
                entryID: id,
            });
            (0, email_1.addMemberEmail)(member, unitLeader);
            return res.status(201).json({
                message: "creating member",
                data: member,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "Error creating member",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating member",
            data: error.message,
            status: 404,
        });
    }
});
exports.createMember = createMember;
const verifyMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { memberID } = req.params;
        const memberInfo = yield memberModel_1.default.findById(memberID);
        const unitLeader = yield unitLeaderModel_1.default.findById(memberInfo === null || memberInfo === void 0 ? void 0 : memberInfo.unitLeaderID);
        if (unitLeader) {
            const member = yield memberModel_1.default.findByIdAndUpdate(memberID, { verify: true }, { new: true });
            unitLeader.member.push(new mongoose_1.Types.ObjectId(member === null || member === void 0 ? void 0 : member._id));
            unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.save();
            const getBranchUnitMemberCount = yield branchLeaderModel_1.default.findById(unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.branchLeaderID);
            let unitLeaderData = [];
            for (let i of getBranchUnitMemberCount === null || getBranchUnitMemberCount === void 0 ? void 0 : getBranchUnitMemberCount.unitLeader) {
                let unit = yield unitLeaderModel_1.default.findById(i);
                unitLeaderData.push(unit === null || unit === void 0 ? void 0 : unit.member);
            }
            const branchLeader = yield branchLeaderModel_1.default.findByIdAndUpdate(unitLeader === null || unitLeader === void 0 ? void 0 : unitLeader.branchLeaderID, {
                branch_members: (_a = unitLeaderData === null || unitLeaderData === void 0 ? void 0 : unitLeaderData.flat()) === null || _a === void 0 ? void 0 : _a.length,
                branch_units: (_b = getBranchUnitMemberCount === null || getBranchUnitMemberCount === void 0 ? void 0 : getBranchUnitMemberCount.unitLeader) === null || _b === void 0 ? void 0 : _b.length,
            }, { new: true });
            let count = 0;
            const getLGALeader = yield LGA_AdminModel_1.default.findById(branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.LGA_AdminID);
            let unitData = [];
            for (let i of getLGALeader === null || getLGALeader === void 0 ? void 0 : getLGALeader.branchLeader) {
                const unitCount = yield branchLeaderModel_1.default.findByIdAndUpdate(i, {
                    branch_members: getLGALeader === null || getLGALeader === void 0 ? void 0 : getLGALeader.branchLeader.length,
                }, { new: true });
                unitData.push(unitCount === null || unitCount === void 0 ? void 0 : unitCount.unitLeader);
            }
            let memberData = [];
            for (let i of unitData.flat()) {
                const memberCount = yield unitLeaderModel_1.default.findByIdAndUpdate(i, {
                    branch_members: getLGALeader === null || getLGALeader === void 0 ? void 0 : getLGALeader.branchLeader.length,
                }, { new: true });
                memberData.push(memberCount === null || memberCount === void 0 ? void 0 : memberCount.member);
            }
            const readLGA = yield LGA_AdminModel_1.default.findByIdAndUpdate(branchLeader === null || branchLeader === void 0 ? void 0 : branchLeader.LGA_AdminID, {
                lga_branches: (_c = getLGALeader === null || getLGALeader === void 0 ? void 0 : getLGALeader.branchLeader) === null || _c === void 0 ? void 0 : _c.length,
                lga_units: (_d = unitData.flat()) === null || _d === void 0 ? void 0 : _d.length,
                lga_members: memberData.flat().length,
            }, { new: true });
            return res.status(201).json({
                message: "LGA has verified Branch Leader created successfully",
                // data: member,
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
exports.verifyMember = verifyMember;
const updateMemberLeaderEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.updateMemberLeaderEmail = updateMemberLeaderEmail;
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
const viewTotalMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branch = yield (memberModel_1.default === null || memberModel_1.default === void 0 ? void 0 : memberModel_1.default.find());
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
exports.viewTotalMembers = viewTotalMembers;
const makePaymentMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { memberID } = req.params;
        const member = yield (memberModel_1.default === null || memberModel_1.default === void 0 ? void 0 : memberModel_1.default.findById(memberID));
        const unit = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findById(member === null || member === void 0 ? void 0 : member.unitLeaderID));
        const branch = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(member === null || member === void 0 ? void 0 : member.branchLeaderID));
        const lga = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(branch === null || branch === void 0 ? void 0 : branch.LGA_AdminID));
        yield (memberModel_1.default === null || memberModel_1.default === void 0 ? void 0 : memberModel_1.default.findByIdAndUpdate(memberID, {
            operation: [
                ...member === null || member === void 0 ? void 0 : member.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        const unx = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findByIdAndUpdate(member === null || member === void 0 ? void 0 : member.unitLeaderID, {
            operation: [
                ...unit === null || unit === void 0 ? void 0 : unit.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        const brx = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findByIdAndUpdate(member === null || member === void 0 ? void 0 : member.branchLeaderID, {
            operation: [
                ...branch === null || branch === void 0 ? void 0 : branch.operation,
                {
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        const lgax = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findByIdAndUpdate(branch === null || branch === void 0 ? void 0 : branch.LGA_AdminID, {
            operation: [
                ...lga === null || lga === void 0 ? void 0 : lga.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        return res.status(200).json({
            message: "viewing member Leader record",
            data: member,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            error: error.message,
        });
    }
});
exports.makePaymentMembers = makePaymentMembers;
const makePaymentWithMembersID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { entryID } = req.body;
        const member = yield (memberModel_1.default === null || memberModel_1.default === void 0 ? void 0 : memberModel_1.default.findOne({ entryID }));
        let memberID = member === null || member === void 0 ? void 0 : member._id;
        const unit = yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findById(member === null || member === void 0 ? void 0 : member.unitLeaderID));
        const branch = yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findById(member === null || member === void 0 ? void 0 : member.branchLeaderID));
        const lga = yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findById(branch === null || branch === void 0 ? void 0 : branch.LGA_AdminID));
        yield (memberModel_1.default === null || memberModel_1.default === void 0 ? void 0 : memberModel_1.default.findByIdAndUpdate(memberID, {
            operation: [
                ...member === null || member === void 0 ? void 0 : member.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        yield (unitLeaderModel_1.default === null || unitLeaderModel_1.default === void 0 ? void 0 : unitLeaderModel_1.default.findByIdAndUpdate(member === null || member === void 0 ? void 0 : member.unitLeaderID, {
            operation: [
                ...unit === null || unit === void 0 ? void 0 : unit.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        yield (branchLeaderModel_1.default === null || branchLeaderModel_1.default === void 0 ? void 0 : branchLeaderModel_1.default.findByIdAndUpdate(member === null || member === void 0 ? void 0 : member.branchLeaderID, {
            operation: [
                ...branch === null || branch === void 0 ? void 0 : branch.operation,
                {
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        yield (LGA_AdminModel_1.default === null || LGA_AdminModel_1.default === void 0 ? void 0 : LGA_AdminModel_1.default.findByIdAndUpdate(branch === null || branch === void 0 ? void 0 : branch.LGA_AdminID, {
            operation: [
                ...lga === null || lga === void 0 ? void 0 : lga.operation,
                {
                    time: (0, moment_1.default)(Date.now()).format("LLLL"),
                    cost: 3000,
                    memberID,
                    memberNmae: member === null || member === void 0 ? void 0 : member.name,
                    unitLeader: unit === null || unit === void 0 ? void 0 : unit.name,
                    unitLeaderID: unit === null || unit === void 0 ? void 0 : unit._id,
                    branchLeader: branch === null || branch === void 0 ? void 0 : branch.name,
                    branchLeaderID: branch === null || branch === void 0 ? void 0 : branch._id,
                    LGALeader: lga === null || lga === void 0 ? void 0 : lga._id,
                    LGALeaderID: lga === null || lga === void 0 ? void 0 : lga._id,
                },
            ],
        }, { new: true }));
        return res.status(200).json({
            message: "viewing member Leader record",
            // data: member,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            error: error.message,
        });
    }
});
exports.makePaymentWithMembersID = makePaymentWithMembersID;
const updateMemberProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { phone, bio, name } = req.body;
        const stateAdminLGA = yield memberModel_1.default.findByIdAndUpdate(id, {
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
exports.updateMemberProfile = updateMemberProfile;
const updateMemberAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield memberModel_1.default.findById(id);
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
            const user = yield memberModel_1.default.findByIdAndUpdate(id, {
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
exports.updateMemberAvatar = updateMemberAvatar;
const viewMemberStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { memberID } = req.params;
        const LGALeader = yield memberModel_1.default.findById(memberID);
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
exports.viewMemberStatus = viewMemberStatus;
