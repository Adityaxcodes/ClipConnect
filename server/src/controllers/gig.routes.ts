import { Router } from "express";
import {
  createGig,
  getAllOpenGigs,
  getCreatorGigs,
} from "../controllers/gig.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Creator
router.post(
  "/",
  authenticate,
  authorizeRoles("CREATOR"),
  createGig
);

router.get(
  "/creator",
  authenticate,
  authorizeRoles("CREATOR"),
  getCreatorGigs
);

// Clipper
router.get(
  "/",
  authenticate,
  authorizeRoles("CLIPPER"),
  getAllOpenGigs
);

export default router;
