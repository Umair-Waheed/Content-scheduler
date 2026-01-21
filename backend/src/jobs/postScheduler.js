import cron from "node-cron";
import Post from "../models/PostModel.js";
import PublicationLog from "../models/PublicationLogModel.js";

cron.schedule("* * * * *", async () => {
  console.log("Scheduler running...");

  const now = new Date();
  console.log("Current time:", now);

  const posts = await Post.find({
    status: "scheduled",
    scheduledAt: { $lte: now }
  }).sort({ createdAt: 1 });

  console.log("Posts found:", posts.length);

  for (const post of posts) {
    console.log("Processing post:", post._id);
    let hasFailure = false;

    for (const platform of post.platforms) {
      console.log(`Publishing post ${post._id} to ${platform}`);
      try {
        await PublicationLog.create({
          postId: post._id,
          platform,
          status: "success"
        });
      } catch (err) {
        hasFailure = true;
        await PublicationLog.create({
          postId: post._id,
          platform,
          status: "failed",
          errorMessage: err.message
        });
      }
    }

    post.status = hasFailure ? "failed" : "published";
    await post.save();
    console.log("Post status updated:", post.status);
  }
});

