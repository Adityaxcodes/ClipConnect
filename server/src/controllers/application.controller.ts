import { Response } from "express";
import Application from "../models/Application.model";
import Gig from "../models/Gig.model";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * APPLY TO A GIG
 * Role: CLIPPER
 * Route: POST /api/applications/:gigId
 */
export const applyToGig = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const clipperId = req.user!.userId;

    console.log(`Clipper ${clipperId} attempting to apply to gig ${gigId}`);

    const gig = await Gig.findById(gigId);

    if (!gig || gig.status !== "OPEN") {
      console.log(`Gig ${gigId} not found or not open`);
      return res.status(404).json({
        message: "Gig not available",
      });
    }

    const existingApplication = await Application.findOne({
      gig: gigId,
      clipper: clipperId,
    });

    if (existingApplication) {
      console.log(`Clipper ${clipperId} already applied to gig ${gigId}`);
      return res.status(409).json({
        message: "Already applied to this gig",
      });
    }

    const application = await Application.create({
      gig: gigId,
      clipper: clipperId,
    });

    console.log(`Application created successfully: ${application._id}`);

    return res.status(201).json({
      message: "Applied to gig successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying to gig:", error);
    return res.status(500).json({
      message: "Failed to apply to gig",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * CHECK IF CLIPPER HAS APPLIED TO A GIG
 * Role: CLIPPER
 * Route: GET /api/applications/check/:gigId
 */
export const checkApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const clipperId = req.user!.userId;

    console.log(`Checking application for gig ${gigId} by clipper ${clipperId}`);

    const application = await Application.findOne({
      gig: gigId,
      clipper: clipperId,
    });

    return res.status(200).json({
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error("Error checking application:", error);
    return res.status(500).json({
      message: "Failed to check application status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET APPLICATIONS FOR A GIG
 * Role: CREATOR
 * Route: GET /api/applications/gig/:gigId
 */
export const getGigApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findOne({
      _id: gigId,
      creator: req.user!.userId,
    });

    if (!gig) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const applications = await Application.find({ gig: gigId })
      .populate("clipper", "email");

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

/**
 * UPDATE APPLICATION STATUS
 * Role: CREATOR
 * Route: PATCH /api/applications/:id
 */
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "ACCEPTED",
      "REJECTED",
      "WORKING",
      "DONE",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const application = await Application.findById(id).populate("gig");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      (application.gig as any).creator.toString() !== req.user!.userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

/**
 * GET MY APPLICATIONS (CLIPPER)
 * Role: CLIPPER
 * Route: GET /api/applications/my
 */
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const clipperId = req.user!.userId;

    const applications = await Application.find({ clipper: clipperId })
      .populate("gig")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

/**
 * SUBMIT VIDEO FOR APPLICATION
 * Role: CLIPPER
 * Route: POST /api/applications/:id/submit
 */
export const submitVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { videoUrl, videoPublicId } = req.body;
    const clipperId = req.user!.userId;

    if (!videoUrl) {
      return res.status(400).json({
        message: "Video URL is required",
      });
    }

    const application = await Application.findOne({
      _id: id,
      clipper: clipperId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.status !== "ACCEPTED" && application.status !== "WORKING") {
      return res.status(400).json({
        message: "Can only submit video for accepted applications",
      });
    }

    application.submittedVideo = videoUrl;
    application.videoPublicId = videoPublicId;
    application.submittedAt = new Date();
    application.status = "DONE";
    await application.save();

    return res.status(200).json({
      message: "Video submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error submitting video:", error);
    return res.status(500).json({
      message: "Failed to submit video",
    });
  }
};

/**
 * GET APPLICATION DETAIL
 * Role: CLIPPER
 * Route: GET /api/applications/:id
 */
export const getApplicationDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const clipperId = req.user!.userId;

    const application = await Application.findOne({
      _id: id,
      clipper: clipperId,
    }).populate("gig");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch application details",
    });
  }
};
