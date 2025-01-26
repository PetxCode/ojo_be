import { Router } from "express";
import {
  createStateAdmin,
  verifyStateAdmin,
  viewStateAdminStatus,
  viewStateAdminViewLGA,
} from "../controller/adminController";

const router: any = Router();

router.route("/create-admin").post(createStateAdmin);

router.route("/verify-admin/:stateAdminID").patch(verifyStateAdmin);

router.route("/view-admin-status/:stateAdminID").get(viewStateAdminStatus);
router.route("/view-admin-lga/:stateAdminID").get(viewStateAdminViewLGA);

export default router;
