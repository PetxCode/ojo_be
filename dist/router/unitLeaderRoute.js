"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitLeaderController_1 = require("../controller/unitLeaderController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-unit-leader/:branchLeaderID").post(unitLeaderController_1.createUnitLeader);
router.route("/login").post(unitLeaderController_1.loginUnit);
router.route("/verify-unit-leader/:unitLeaderID").get(unitLeaderController_1.verifyUnitLeader);
router.route("/all-units").get(unitLeaderController_1.viewTotalUnit);
router.route("/driver-operation/:unitID").get(unitLeaderController_1.driversOpration);
router.route("/unit-cost-outcome/:unitID").get(unitLeaderController_1.outComeCost);
router
    .route("/update-unit-leader-email/:unitLeaderID")
    .patch(unitLeaderController_1.updateUnitLeaderEmail);
router.route("/view-unit-leader-status/:unitID").get(unitLeaderController_1.viewUnitLeaderStatus);
// router
//   .route("/view-branch-leader-unit/:LGALeaderID")
//   .get(viewBranchesLeaderUnit);
router.route("/update-branch-info/:id").patch(unitLeaderController_1.updateUnitProfile);
router.route("/update-branch-avatar/:id").patch(multer_1.fileUpload, unitLeaderController_1.updateUnitAvatar);
exports.default = router;
