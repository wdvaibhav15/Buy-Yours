import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudnary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";

// APP config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());



app.use("/api/user",userRouter);

app.use("/api/product",productRouter);

app.use("/api/cart",cartRouter);

//routes / api endpoints
app.get("/", (req, res) => {
  res.send("API working");
});



//server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});