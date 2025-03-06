import { Router } from "express";
import {
  createLGALeader,
  loginLGA,
  updateLGAEmail,
  verifyLGACreatedByStateAdmin,
  viewLGABranches,
  viewLGADetails,
  viewLGALeaderStatus,
  viewTotalLGAs,
  outComeCost,
  LGADriversOprationNumber,
  bestPerformingUnitFormLGA,
  updateLGAProfile,
  updateLGAAvatar,
  LGAbranchOperation,
  LGAdailyPerformanceLGA,
  unitMembersLGA,
} from "../controller/LGAController";
import { fileUpload } from "../utils/multer";

const router: any = Router();

router.route("/create-lga-leader/:stateAdminID").post(createLGALeader);
router.route("/login").post(loginLGA);

router.route("/all-lgas").get(viewTotalLGAs);

router.route("/verify-lga-leader").post(verifyLGACreatedByStateAdmin);

router.route("/update-lga-email/:LGALeaderID").patch(updateLGAEmail);
router.route("/lga-cost-outcome/:lgaID").get(outComeCost);
router.route("/lga-driver-operation/:lgaID").get(LGADriversOprationNumber);
router.route("/best-performing-lga-unit/:LGAID").get(bestPerformingUnitFormLGA);

router.route("/view-lga-leader-status/:LGALeaderID").get(viewLGALeaderStatus);

router.route("/view-lga-leader-branch/:LGALeaderID").get(viewLGABranches);

router.route("/view-branch-daily-data/:LGAID").get(LGAdailyPerformanceLGA);
router.route("/view-branch-daily/:LGAID").get(LGAbranchOperation);

router.route("/view-lga-leader/:LGAID").get(viewLGADetails);
router.route("/view-lga-from-unit/:LGAID").get(unitMembersLGA);

router.route("/update-lga-info/:id").patch(updateLGAProfile);
router.route("/update-lga-avatar/:id").patch(fileUpload, updateLGAAvatar);

export default router;
