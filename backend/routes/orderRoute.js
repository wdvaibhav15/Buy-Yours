import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  userOrders,
  allOrders,        // ✅ ADD
  updateStatus      // ✅ ADD
} from "../controllers/orderController.js";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js"; // ✅ ADD

const router = express.Router();

// 🔹 ADMIN ROUTES (THIS WAS MISSING)
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);

// 🔹 USER + PAYMENT
router.post("/place", authUser, placeOrder);
router.post("/stripe", authUser, placeOrderStripe);
router.post("/verifyStripe", authUser, verifyStripe);

router.post("/razorpay", authUser, placeOrderRazorpay);
router.post("/verifyRazorpay", authUser, verifyRazorpay);

router.post("/userorders", authUser, userOrders);

export default router;