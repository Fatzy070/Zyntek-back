import mongoose from "mongoose";
import Wishlist from "../models/wishListSchema.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    // ✅ Validate user and product ID
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    // ✅ Check if wishlist exists for this user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [productId] });
    } else {
      // Avoid duplicates
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json({ success: true, message: "Added to wishlist ❤️" });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧾 Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wishlist = await Wishlist.findOne({ userId }).populate("items");

    res.status(200).json({
      success: true,
      wishlist: wishlist ? wishlist.items : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ Remove one product
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    await Wishlist.updateOne({ userId }, { $pull: { items: productId } });
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧹 Clear all
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    await Wishlist.findOneAndDelete({ userId });
    res.status(200).json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
