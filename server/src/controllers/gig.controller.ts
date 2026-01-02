import { Response } from "express";
import Gig from "../models/Gig.model";
import { AuthRequest } from "../types/express";

/**
 * CREATE GIG
 * Role: CREATOR
 * Route: POST /api/gigs
 */
export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      pay,
      requirements,
      difficulty,
      image,
      imagePublicId,
    } = req.body;

    if (!title || !description || !pay || !requirements || !difficulty) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Capitalize difficulty to match schema enum
    const capitalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    const gig = await Gig.create({
      creator: req.user!.userId,
      title,
      description,
      pay,
      requirements,
      difficulty: capitalizedDifficulty,
      image: image || undefined,
      imagePublicId: imagePublicId || undefined,
    });

    return res.status(201).json({
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    console.error("Error creating gig:", error);
    return res.status(500).json({
      message: "Failed to create gig",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET ALL OPEN GIGS
 * Role: CLIPPER
 * Route: GET /api/gigs
 */
export const getAllOpenGigs = async (_req: AuthRequest, res: Response) => {
  try {
    const gigs = await Gig.find({ status: "OPEN" })
      .populate("creator", "email firstName lastName avatar")
      .lean();

    return res.status(200).json(gigs);
  } catch (error) {
    console.error("❌ Error fetching gigs:", error);
    return res.status(500).json({
      message: "Failed to fetch gigs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET CREATOR GIGS
 * Role: CREATOR
 * Route: GET /api/gigs/creator
 */
export const getCreatorGigs = async (req: AuthRequest, res: Response) => {
  try {
    const gigs = await Gig.find({
      creator: req.user!.userId,
    });

    return res.status(200).json(gigs);
  } catch (error) {
    console.error("❌ Error fetching creator gigs:", error);
    return res.status(500).json({
      message: "Failed to fetch creator gigs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
