import { Router } from "express";
import {
  createUnitLeader,
  loginUnit,
  outComeCost,
  updateUnitLeaderEmail,
  verifyUnitLeader,
  viewTotalUnit,
  driversOpration,
  updateUnitProfile,
  updateUnitAvatar,
  viewUnitLeaderStatus,
  viewUnitLeaderMembers,
} from "../controller/unitLeaderController";
import { fileUpload } from "../utils/multer";

const router: any = Router();

router.route("/create-unit-leader/:branchLeaderID").post(createUnitLeader);
router.route("/login").post(loginUnit);

router.route("/verify-unit-leader/").post(verifyUnitLeader);

router.route("/all-units").get(viewTotalUnit);
router.route("/driver-operation/:unitID").get(driversOpration);

router.route("/unit-cost-outcome/:unitID").get(outComeCost);
router.route("/view-unit-member/:unitID").get(viewUnitLeaderMembers);

router
  .route("/update-unit-leader-email/:unitLeaderID")
  .patch(updateUnitLeaderEmail);

router.route("/view-unit-leader-status/:unitID").get(viewUnitLeaderStatus);
// router
//   .route("/view-branch-leader-unit/:LGALeaderID")
//   .get(viewBranchesLeaderUnit);

router.route("/update-unit-info/:id").patch(updateUnitProfile);
router.route("/update-unit-avatar/:id").patch(fileUpload, updateUnitAvatar);

export default router;
