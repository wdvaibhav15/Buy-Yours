import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudnary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

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

app.use("/api/user",userRouter);

app.use("/api/product",productRouter);



//server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});