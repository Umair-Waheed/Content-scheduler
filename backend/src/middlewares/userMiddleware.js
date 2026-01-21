import jwt from "jsonwebtoken";
import User from "../models/UserModel.js"

const userMiddleware = async (req, res, next) => {

  const  token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({success:false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.json({success:false, message: "Token invalid or expired" });
  }
};

export default userMiddleware;
