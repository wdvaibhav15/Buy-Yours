import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";

// API config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json());

//API endpoints
app.use("/api/user", userRouter);


app.get("/", (req, res) => {
  res.send("API WORKING");
});










const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  });
};

startServer();