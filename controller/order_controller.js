const Order = require("../model/Order_model")
const Cart = require("../model/cart_model")
const Product = require("../model/product_model");

// =========================
// Create Order from Cart
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id; 

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    cart.products.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    // Create new order
    const newOrder = new Order({
      user: userId,
      products: cart.products, 
      totalPrice,
    });

    await newOrder.save();

    // Optionally clear the cart after ordering
    cart.products = [];
    await cart.save();

    return res.status(201).json({ message: "Order created successfully", order: newOrder });
  }
  catch (error) {
    next(error);
  }
};

// =========================
// Get All Orders for a User
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  }
  catch (error) {
    next(error);
  }
};

// =========================
// Get Single Order by ID
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } 
  catch (error) {
    next(error);
  }
};

// =========================
// Update Order Status 
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } 
  catch (error) {
    next(error);
  }
};

// =========================
// Delete an order
const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body; // or use req.params.id if ID comes from URL

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully", order });
  }
  catch (error) {
    next(error);
  }
};

// =========================
// Export All Functions
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
