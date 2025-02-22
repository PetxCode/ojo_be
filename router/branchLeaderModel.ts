import { Router } from "express";
import {
  createBranchLeader,
  loginBranch,
  updateBranchLeaderEmail,
  verifyBranchLeader,
  viewBranchesLeaderUnit,
  viewBranchLeaderStatus,
  viewTotalBranches,
  outComeCost,
  branchDriversOpration,
  bestPerformingUnit,
  updateBranchAvatar,
  updateBranchProfile,
} from "../controller/branchLeaderController";
import { fileUpload } from "../utils/multer";

const router: any = Router();

router.route("/create-branch-leader/:LGALeaderID").post(createBranchLeader);
router.route("/login").post(loginBranch);

router.route("/verify-branch-leader/:branchLeaderID").get(verifyBranchLeader);

router.route("/all-branches").get(viewTotalBranches);
router.route("/branch-driver-operation/:branchID").get(branchDriversOpration);

router.route("/branch-cost-outcome/:branchID").get(outComeCost);

router.route("/best-unit/:branchID").get(bestPerformingUnit);

router
  .route("/update-branch-leader-email/:branchLeaderID")
  .patch(updateBranchLeaderEmail);

router
  .route("/view-branch-leader-status/:branchLeaderID")
  .get(viewBranchLeaderStatus);
router
  .route("/view-branch-leader-unit/:LGALeaderID")
  .get(viewBranchesLeaderUnit);

router.route("/update-branch-info/:id").patch(updateBranchProfile);
router.route("/update-branch-avatar/:id").patch(fileUpload, updateBranchAvatar);

export default router;
