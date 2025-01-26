import { Router } from "express";
import {
  createUnitLeader,
  updateUnitLeaderEmail,
  verifyUnitLeader,
} from "../controller/unitLeaderController";

const router: any = Router();

router.route("/create-unit-leader/:branchLeaderID").post(createUnitLeader);

router.route("/verify-unit-leader/:unitLeaderID").patch(verifyUnitLeader);

router
  .route("/update-unit-leader-email/:unitLeaderID")
  .patch(updateUnitLeaderEmail);

// router
//   .route("/view-branch-leader-status/:LGALeaderID")
//   .get(viewBranchLeaderStatus);
// router
//   .route("/view-branch-leader-unit/:LGALeaderID")
//   .get(viewBranchesLeaderUnit);

export default router;
