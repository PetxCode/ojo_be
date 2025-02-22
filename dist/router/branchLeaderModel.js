"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branchLeaderController_1 = require("../controller/branchLeaderController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-branch-leader/:LGALeaderID").post(branchLeaderController_1.createBranchLeader);
router.route("/login").post(branchLeaderController_1.loginBranch);
router.route("/verify-branch-leader/:branchLeaderID").get(branchLeaderController_1.verifyBranchLeader);
router.route("/all-branches").get(branchLeaderController_1.viewTotalBranches);
router.route("/branch-driver-operation/:branchID").get(branchLeaderController_1.branchDriversOpration);
router.route("/branch-cost-outcome/:branchID").get(branchLeaderController_1.outComeCost);
router.route("/best-unit/:branchID").get(branchLeaderController_1.bestPerformingUnit);
router
    .route("/update-branch-leader-email/:branchLeaderID")
    .patch(branchLeaderController_1.updateBranchLeaderEmail);
router
    .route("/view-branch-leader-status/:branchLeaderID")
    .get(branchLeaderController_1.viewBranchLeaderStatus);
router
    .route("/view-branch-leader-unit/:LGALeaderID")
    .get(branchLeaderController_1.viewBranchesLeaderUnit);
router.route("/update-branch-info/:id").patch(branchLeaderController_1.updateBranchProfile);
router.route("/update-branch-avatar/:id").patch(multer_1.fileUpload, branchLeaderController_1.updateBranchAvatar);
exports.default = router;
