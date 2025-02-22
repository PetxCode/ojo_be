"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LGAController_1 = require("../controller/LGAController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-lga-leader/:stateAdminID").post(LGAController_1.createLGALeader);
router.route("/login").post(LGAController_1.loginLGA);
router.route("/all-lgas").get(LGAController_1.viewTotalLGAs);
router
    .route("/verify-lga-leader/:LGALeaderID")
    .get(LGAController_1.verifyLGACreatedByStateAdmin);
router.route("/update-lga-email/:LGALeaderID").patch(LGAController_1.updateLGAEmail);
router.route("/lga-cost-outcome/:lgaID").get(LGAController_1.outComeCost);
router.route("/lga-driver-operation/:lgaID").get(LGAController_1.LGADriversOpration);
router.route("/best-performing-lga-unit/:LGAID").get(LGAController_1.bestPerformingUnitFormLGA);
router.route("/view-lga-leader-status/:LGALeaderID").get(LGAController_1.viewLGALeaderStatus);
router.route("/view-lga-leader-branch/:LGALeaderID").get(LGAController_1.viewLGABranches);
router.route("/view-lga-leader/:LGAID").get(LGAController_1.viewLGADetails);
router.route("/update-lga-info/:id").patch(LGAController_1.updateLGAProfile);
router.route("/update-lga-avatar/:id").patch(multer_1.fileUpload, LGAController_1.updateLGAAvatar);
exports.default = router;
