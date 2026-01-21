import Post from "../models/PostModel.js";

const createPost = async (req, res) => {

  const { content, platforms, scheduledAt, imageUrl } = req.body;

  if (!content) {
    return res.json({success:false, message: "Please add content!" });
  }

  if (!platforms || platforms.length === 0) {
    return res.json({success:false, message: "Select at least one platform" });
  }

  const scheduleDate = new Date(scheduledAt);
if (scheduleDate <= new Date()) {
  return res.json({
    success: false,
    message: "Scheduled time must be in the future"
  });
}

  const post = await Post.create({
    userId: req.user._id,
    content,
    platforms,
    scheduledAt: scheduleDate,
    imageUrl
  });

return res.json({success:true,post,message:"Post created successfully!"});
};


const getPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status;

  const query = { userId: req.user._id };
  if (status) query.status = status;

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments(query);

  return res.json({
    success:true,
    total,
    page,
    pages: Math.ceil(total / limit),
    posts
  });
};

const getPostById = async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!post) {
    return res.json({success:false, message: "Post not found" });
  }

  return res.json({success:true,post});
};


const updatePost = async (req, res) => {
  const { scheduledAt } = req.body;

  const post = await Post.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!post) {
    return res.json({
      success: false,
      message: "Post not found"
    });
  }

  if (post.status !== "scheduled") {
    return res.json({
      success: false,
      message: "Only scheduled posts can be edited"
    });
  }

  if (scheduledAt && new Date(scheduledAt) <= new Date()) {
    return res.json({
      success: false,
      message: "Scheduled time must be in the future"
    });
  }

  post.content = req.body.content ?? post.content;
  post.platforms = req.body.platforms ?? post.platforms;
  post.scheduledAt = scheduledAt ?? post.scheduledAt;
  post.imageUrl = req.body.imageUrl ?? post.imageUrl;

  await post.save();

  return res.json({
    success: true,
    message: "Post updated successfully",
    post
  });
};



const deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!post) {
    return res.json({success:false, message: "Post not found" });
  }

  return res.json({success:true, message: "Post deleted" });
};

export{createPost,getPosts,getPostById,updatePost,deletePost}