import { Router } from "express";

import {
  createMember,
  updateMemberLeaderEmail,
  verifyMember,
} from "../controller/memberController";

const router: any = Router();

router.route("/create-member-leader/:unitLeaderID").post(createMember);

router.route("/verify-member-leader/:memberID").patch(verifyMember);

router
  .route("/update-member-leader-email/:memberID")
  .patch(updateMemberLeaderEmail);

// router
//   .route("/view-branch-leader-status/:LGALeaderID")
//   .get(viewBranchLeaderStatus);
// router
//   .route("/view-branch-leader-unit/:LGALeaderID")
//   .get(viewBranchesLeaderUnit);

export default router;
