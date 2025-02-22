"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memberController_1 = require("../controller/memberController");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route("/create-member-leader/:unitLeaderID").post(memberController_1.createMember);
router.route("/login").post(memberController_1.loginMember);
router.route("/verify-member-leader/:memberID").get(memberController_1.verifyMember);
router.route("/member-payment-with-id/:memberID").get(memberController_1.makePaymentMembers);
router.route("/member-payment/").post(memberController_1.makePaymentWithMembersID);
router.route("/all-members/").get(memberController_1.viewTotalMembers);
router
    .route("/update-member-leader-email/:memberID")
    .patch(memberController_1.updateMemberLeaderEmail);
router.route("/update-branch-info/:id").patch(memberController_1.updateMemberProfile);
router.route("/update-member-avatar/:id").patch(multer_1.fileUpload, memberController_1.updateMemberAvatar);
router.route("/view-member-status/:memberID").get(memberController_1.viewMemberStatus);
exports.default = router;
