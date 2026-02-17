import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";


// 🧾 Create Order (Used by Stripe Confirm Flow)
export const createOrder = async (req, res) => {
  try {
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

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${product?.name || ""} is out of stock`
        });
      }

      // Reduce stock
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

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 📄 Get Single Order (User or Admin)
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 📜 Get Logged In User Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 📊 Admin — Get All Orders (With Filtering + Pagination)
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const statusFilter = req.query.status
      ? { orderStatus: req.query.status }
      : {};

    const dateFilter = {};

    if (req.query.startDate && req.query.endDate) {
      dateFilter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // 🔍 Search by user email
    let userFilter = {};

    if (req.query.search) {
      const users = await User.find({
        email: { $regex: req.query.search, $options: "i" },
      });

      const userIds = users.map((u) => u._id);
      userFilter.user = { $in: userIds };
    }

    const query = {
      ...statusFilter,
      ...dateFilter,
      ...userFilter,
    };

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      totalRevenue,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔄 Admin — Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
