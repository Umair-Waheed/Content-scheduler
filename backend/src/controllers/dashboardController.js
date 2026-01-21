import Post from "../models/PostModel.js";

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalPosts = await Post.countDocuments({ userId });
    const scheduledPosts = await Post.countDocuments({ userId, status: "scheduled" });
    const publishedPosts = await Post.countDocuments({ userId, status: "published" });

    const platformStats = {
      twitter: await Post.countDocuments({ userId, platforms: "twitter" }),
      facebook: await Post.countDocuments({ userId, platforms: "facebook" }),
      instagram: await Post.countDocuments({ userId, platforms: "instagram" }),
    };

    return res.json({success:true, totalPosts, scheduledPosts, publishedPosts, platformStats });
  } catch (err) {
    console.error(err);
    return res.json({success:false, message: "Server error" });
  }
};

const getUpcomingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ userId, status: "scheduled" })
      .sort({ scheduledAt: 1 })
      .limit(5);

   return res.json({success:true, posts });
  } catch (err) {
    console.error(err);
    return res.json({success:false, message: "Server error" });
  }
};


export {getStats,getUpcomingPosts}