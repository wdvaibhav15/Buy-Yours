
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const currency = "inr";
const deliveryCharges = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: true,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log("COD error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Payment Pending",
      date: Date.now(),
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: "Order Placed Successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Cancelled" });
    }
  } catch (error) {
    console.log("Verify Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay
// const placeOrderRazorpay = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;
    
//     const newOrder = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Razorpay",
//       payment: false,
//       date: Date.now(),
//     };
//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const options = {
//       amount: amount * 100,
//       currency: currency.toLocaleUpperCase(),
//       receipt: newOrder._id.toString(),
//     };


//     const order = await razorpayInstance.orders.create(options, (error, order) => {
//       if(error) {
//         console.log("Razorpay create order error:", error);
//         return res.json({ success: false, message: error?.error?.description || error.message || "Razorpay create order failed",});
//       }
//       res.json({ success: true, order });
//     });
    
//   } catch (error) {
//     console.log("Razorpay create order error:", error);
//     res.json({
//       success: false,
//       message: error?.error?.description || error.message || "Razorpay create order failed",
//     });
//   }
// };
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // correct order data
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Payment Pending",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    // ✅ correct method
    const order = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      order,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.log("Razorpay error:", error);

    return res.json({
      success: false,
      message: error?.error?.description || error.message || "Razorpay failed",
    });
  }
};

// const verifyRazorpay = async (req, res) => {
//   try {
//     const {
//       userId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
//     if(orderInfo.status === "paid") {
//       await orderModel.findByIdAndUpdate(orderInfo.receipt,{
//         payment:true
//       })
//       await userModel.findByIdAndUpdate(userId, {cartData: {}});
//       res.json({success: true, message: "Order Placed Successfully"});
//     } else{
//       res.json({success: false, message: "Payment Failed"});
//     }
//  }
//   catch (error) {
//     console.log("Razorpay verify error:", error);
//     res.json({ success: false, message: error.message });
//   }
// };

// Orders
const verifyRazorpay = async (req, res) => {
  try {
    const {
      userId,
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Order Placed Successfully",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);

      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log("Razorpay verify error:", error);
    res.json({ success: false, message: error.message });
  }
};
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log("All orders error:", error);
    res.json({ success: false, message: error.message });
  }
};


const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({
      userId,
      $or: [
        { paymentMethod: "COD" },
        { paymentMethod: "Stripe", payment: true },
        { paymentMethod: "Razorpay", payment: true },
      ],
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log("User orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log("Update status error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};