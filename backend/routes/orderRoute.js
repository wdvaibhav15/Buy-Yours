
import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  userOrders,
} from "../controllers/orderController.js";

import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/place", authUser, placeOrder);
router.post("/stripe", authUser, placeOrderStripe);
router.post("/verifyStripe", authUser, verifyStripe);

router.post("/razorpay", authUser, placeOrderRazorpay);
router.post("/verifyRazorpay", authUser, verifyRazorpay);

router.post("/userorders", authUser, userOrders);

export default router;