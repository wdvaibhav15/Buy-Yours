// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from 'stripe';

// // global variables
// const currency = "inr"
// const deliveryCharges = 10


// // payment gateway initialized
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// // placing order using cash on delivery method
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now()
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.json({ success: true, message: "Order Placed Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // placing order using Stripe method
// const placeOrderStripe = async (req, res) => {
//   try {
//     const userId = req.userId || req.body.userId;
//     const { items, amount, address } = req.body;
//     const { origin } = req.headers;

//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Stripe",
//       payment: false,
//       date: Date.now(),
//       status: "Payment Pending"
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: item.name
//         },
//         unit_amount: item.price * 100
//       },
//       quantity: item.quantity
//     }));

//     line_items.push({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: "Delivery Charges"
//         },
//         unit_amount: deliveryCharges * 100
//       },
//       quantity: 1
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       client_reference_id: newOrder._id.toString(),
//       metadata: {
//         orderId: newOrder._id.toString(),
//         userId: userId.toString()
//       },
//       success_url: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
//       cancel_url: `${origin}/verify?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`
//     });

//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // verify Stripe
// const verifyStripe = async (req, res) => {
//   try {
//     const { orderId, session_id } = req.body;
//     const userId = req.userId || req.body.userId;

//     const session = await stripe.checkout.sessions.retrieve(session_id);

//     if (
//       session.payment_status === "paid" &&
//       session.metadata.orderId === orderId
//     ) {
//       await orderModel.findByIdAndUpdate(orderId, {
//         payment: true,
//         status: "Order Placed"
//       });

//       if (userId) {
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });
//       }

//       res.json({ success: true, message: "Payment verified successfully" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Payment not completed" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // placing order using Razorpay method
// const placeOrderRazorpay = async (req, res) => {
//   try {
//     res.json({ success: false, message: "Razorpay not implemented yet" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // all order data for admin panel
// const allOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // user order data for frontend
// const userOrders = async (req, res) => {
//   try {
//     const userId = req.userId || req.body.userId;

//     const orders = await orderModel.find({
//       userId,
//       $or: [
//         { paymentMethod: "COD" },
//         { paymentMethod: "Stripe", payment: true }
//       ]
//     });

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // update order status from admin panel
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     await orderModel.findByIdAndUpdate(orderId, { status });
//     res.json({ success: true, message: "Status Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export {
//   placeOrder,
//   placeOrderStripe,
//   placeOrderRazorpay,
//   allOrders,
//   userOrders,
//   updateStatus,
//   verifyStripe
// };
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// global variables
const currency = "inr";
const deliveryCharges = 10;

// payment gateway initialized
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order using cash on delivery method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: true,
      status: "Order Placed",
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing order using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Payment Pending",
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: deliveryCharges * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed"
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: "Order Placed Successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Cancelled" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    res.json({ success: false, message: "Razorpay not implemented yet" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// all order data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({
      userId,
      $or: [
        { paymentMethod: "COD" },
        { paymentMethod: "Stripe", payment: true }
      ]
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe
};