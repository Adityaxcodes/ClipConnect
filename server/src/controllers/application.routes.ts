import { Router } from "express";
import {
  applyToGig,
  checkApplication,
  getGigApplications,
  getMyApplications,
  updateApplicationStatus,
  submitVideo,
  getApplicationDetail,
} from "../controllers/application.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Clipper gets their own applications
router.get(
  "/my",
  authenticate,
  authorizeRoles("CLIPPER"),
  getMyApplications
);

// Check if clipper has already applied to a gig (Clipper only)
router.get(
  "/check/:gigId",
  authenticate,
  authorizeRoles("CLIPPER"),
  checkApplication
);

// Clipper applies to gig
router.post(
  "/:gigId",
  authenticate,
  authorizeRoles("CLIPPER"),
  applyToGig
);

// Creator views applications for a gig
router.get(
  "/gig/:gigId",
  authenticate,
  authorizeRoles("CREATOR"),
  getGigApplications
);

// Creator updates application status
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("CREATOR"),
  updateApplicationStatus
);

// Clipper gets application detail
router.get(
  "/:id",
  authenticate,
  authorizeRoles("CLIPPER"),
  getApplicationDetail
);

// Clipper submits video for application
router.post(
  "/:id/submit",
  authenticate,
  authorizeRoles("CLIPPER"),
  submitVideo
);

export default router;
