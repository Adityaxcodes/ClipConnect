import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  gig: mongoose.Types.ObjectId;
  clipper: mongoose.Types.ObjectId;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "WORKING"
    | "DONE"
    | "CLIPPER_DROPPED";
  submittedVideo?: string; // Cloudinary video URL
  videoPublicId?: string; // Cloudinary public ID for deletion
  submittedAt?: Date;
  reviewNote?: string; // Creator's review feedback
}

const ApplicationSchema = new Schema<IApplication>(
  {
    gig: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    clipper: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "WORKING",
        "DONE",
        "CLIPPER_DROPPED",
      ],
      default: "PENDING",
    },
    submittedVideo: {
      type: String,
      required: false,
    },
    videoPublicId: {
      type: String,
      required: false,
    },
    submittedAt: {
      type: Date,
      required: false,
    },
    reviewNote: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);
