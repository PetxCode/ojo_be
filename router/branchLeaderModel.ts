import { Router } from "express";
import {
  createBranchLeader,
  updateBranchLeaderEmail,
  verifyBranchLeader,
  viewBranchesLeaderUnit,
  viewBranchLeaderStatus,
} from "../controller/branchLeaderController";

const router: any = Router();

router.route("/create-branch-leader/:LGALeaderID").post(createBranchLeader);

router.route("/verify-branch-leader/:branchLeaderID").patch(verifyBranchLeader);

router
  .route("/update-branch-leader-email/:branchLeaderID")
  .patch(updateBranchLeaderEmail);

router
  .route("/view-branch-leader-status/:LGALeaderID")
  .get(viewBranchLeaderStatus);
router
  .route("/view-branch-leader-unit/:LGALeaderID")
  .get(viewBranchesLeaderUnit);

export default router;
