import Cart from "../models/cartSchema.js";
import mongoose from "mongoose";

// 🛒 Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Item added/updated in cart",
      cart: cart.items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📦 Get user’s cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ success: true, cart: [] });
    }

    res.status(200).json({
      success: true,
      cart: cart.items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ Remove one product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, message: "Item removed", cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧹 Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    await Cart.findOneAndDelete({ userId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
