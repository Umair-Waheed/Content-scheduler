import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js" 
import postRoutes from "./routes/postRoute.js"
import dashboardRoutes from "./routes/dashboardRoute.js"
import connectDB from "./config/db.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

await connectDB()
import "./jobs/postScheduler.js";

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
