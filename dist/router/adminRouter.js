"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-admin").post(adminController_1.createStateAdmin);
router.route("/login").post(adminController_1.loginAdmin);
router.route("/update-info/:stateAdminID").patch(adminController_1.updateAdminProfile);
router.route("/update-avatar/:adminID").patch(multer_1.fileUpload, adminController_1.updateUserAvatar);
router.route("/verify-admin/:stateAdminID").get(adminController_1.verifyStateAdmin);
router
    .route("/best-performing-admin-unit/:adminID")
    .get(adminController_1.bestPerformingUnitFromAmdn);
router.route("/monthly-performance/:adminID").get(adminController_1.monthlyPerformance);
router
    .route("/admin-monthly-performance/:adminID")
    .get(adminController_1.monthlyPerformanceAdmin);
router
    .route("/admin-daily-performance-cost/:adminID")
    .get(adminController_1.dailyPerformanceAdmin);
router.route("/branch-daily-performance-cost/:adminID").get(adminController_1.branchOperation);
router.route("/view-admin-status/:stateAdminID").get(adminController_1.viewStateAdminStatus);
router.route("/view-admin-lga/:stateAdminID").get(adminController_1.viewStateAdminViewLGA);
router.route("/view-all-member/").get(adminController_1.viewingMembers);
exports.default = router;
// branchOperation;
