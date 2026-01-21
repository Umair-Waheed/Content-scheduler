import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true,
    },

    platforms: {
      type: [String],
      enum: ["twitter", "facebook", "instagram"],
      required: true
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true
    },

    imageUrl: {
      type: String
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "scheduled",
      index: true
    },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model("Post", postSchema);
