import mongoose, { Schema, Document } from "mongoose";

export interface IGig extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  description: string;
  pay: number;
  requirements: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "OPEN" | "CLOSED";
  image?: string;
  imagePublicId?: string;
}

const GigSchema = new Schema<IGig>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    pay: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
    image: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGig>("Gig", GigSchema);
