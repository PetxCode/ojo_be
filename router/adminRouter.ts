import { Router } from "express";
import {
  createStateAdmin,
  loginAdmin,
  verifyStateAdmin,
  viewStateAdminStatus,
  viewStateAdminViewLGA,
  bestPerformingUnitFromAmdn,
  updateAdminProfile,
  updateUserAvatar,
  monthlyPerformance,
  monthlyPerformanceAdmin,
  dailyPerformanceAdmin,
  branchOperation,
  viewingMembers,
} from "../controller/adminController";
import { fileUpload } from "../utils/multer";

const router: any = Router();

router.route("/create-admin").post(createStateAdmin);
router.route("/login").post(loginAdmin);

router.route("/update-info/:stateAdminID").patch(updateAdminProfile);
router.route("/update-avatar/:adminID").patch(fileUpload, updateUserAvatar);

router.route("/verify-admin/:stateAdminID").get(verifyStateAdmin);
router
  .route("/best-performing-admin-unit/:adminID")
  .get(bestPerformingUnitFromAmdn);

router.route("/monthly-performance/:adminID").get(monthlyPerformance);
router
  .route("/admin-monthly-performance/:adminID")
  .get(monthlyPerformanceAdmin);
router
  .route("/admin-daily-performance-cost/:adminID")
  .get(dailyPerformanceAdmin);

router.route("/branch-daily-performance-cost/:adminID").get(branchOperation);

router.route("/view-admin-status/:stateAdminID").get(viewStateAdminStatus);
router.route("/view-admin-lga/:stateAdminID").get(viewStateAdminViewLGA);
router.route("/view-all-member/").get(viewingMembers);

export default router;
// branchOperation;
