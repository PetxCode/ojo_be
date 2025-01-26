import { Router } from "express";
import {
  createLGALeader,
  updateLGAEmail,
  verifyLGACreatedByStateAdmin,
  viewLGABranches,
  viewLGALeaderStatus,
} from "../controller/LGAController";

const router: any = Router();

router.route("/create-lga-leader/:stateAdminID").post(createLGALeader);

router
  .route("/verify-lga-leader/:LGALeaderID")
  .patch(verifyLGACreatedByStateAdmin);

router.route("/update-lga-email/:LGALeaderID").patch(updateLGAEmail);

router.route("/view-lga-leader-status/:LGALeaderID").get(viewLGALeaderStatus);
router.route("/view-lga-leader-branch/:LGALeaderID").get(viewLGABranches);

export default router;
