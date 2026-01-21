import mongoose from "mongoose";

const publicationLogSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    },

    platform: {
      type: String,
      enum: ["twitter", "facebook", "instagram"],
      required: true
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true
    },

    errorMessage: {
      type: String
    },

    publishedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

publicationLogSchema.index({ postId: 1, platform: 1 });

export default mongoose.model("PublicationLog", publicationLogSchema);
