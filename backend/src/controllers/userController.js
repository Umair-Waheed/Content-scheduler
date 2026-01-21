import jwt from "jsonwebtoken";
import User from "../models/UserModel.js"
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

 const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({success:false, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({success:false, message: "User already exists" });
  }

  const user = await User.create({ email, password });

  res.json({
    success:true,
    message: "User registered successfully",
    token: generateToken(user._id)
  });
};

 const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({success:false, message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.json({success:false, message: "Invalid credentials" });
  }

  res.json({
    success:true,
    message: "Login successful",
    token: generateToken(user._id)
  });
};

const logout = async (req, res) => {
  res.json({success:true, message: "Logout successful" });
};

export{register,login,logout};