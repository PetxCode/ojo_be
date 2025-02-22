import { Router } from "express";

import {
  createMember,
  loginMember,
  makePaymentMembers,
  makePaymentWithMembersID,
  updateMemberLeaderEmail,
  verifyMember,
  viewTotalMembers,
  updateMemberAvatar,
  updateMemberProfile,
  viewMemberStatus,
} from "../controller/memberController";
import { fileUpload } from "../utils/multer";

const router: any = Router();

router.route("/create-member-leader/:unitLeaderID").post(createMember);
router.route("/login").post(loginMember);

router.route("/verify-member-leader/:memberID").get(verifyMember);

router.route("/member-payment-with-id/:memberID").get(makePaymentMembers);
router.route("/member-payment/").post(makePaymentWithMembersID);

router.route("/all-members/").get(viewTotalMembers);

router
  .route("/update-member-leader-email/:memberID")
  .patch(updateMemberLeaderEmail);

router.route("/update-branch-info/:id").patch(updateMemberProfile);
router.route("/update-member-avatar/:id").patch(fileUpload, updateMemberAvatar);

router.route("/view-member-status/:memberID").get(viewMemberStatus);

export default router;
