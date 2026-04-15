import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudnary.js";

// APP config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());

//routes / api endpoints
app.get("/", (req, res) => {
  res.send("API working");
});



//server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});