import stripe from "../utils/stripe.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";


// ===============================
// 🧾 Create Payment Intent
// ===============================
export const createPaymentIntent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    let totalAmount = 0;

    user.cart.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
      metadata: {
        userId: user._id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ===============================
// 💳 Confirm Payment + Create Order
// ===============================
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "PaymentIntent ID is required"
      });
    }

    // 🔥 Retrieve payment intent (DO NOT confirm again)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful"
      });
    }

    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (let item of user.cart) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const newOrder = await Order.create({
      user: user._id,
      orderItems,
      totalPrice,
      paymentStatus: "paid",
      orderStatus: "pending"
    });

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Payment verified & order created",
      order: newOrder
    });

  } catch (error) {
    console.log("Confirm Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
