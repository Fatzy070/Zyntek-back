import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishListController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticate, addToWishlist);
router.get("/", authenticate, getWishlist);
router.delete("/remove", authenticate, removeFromWishlist);
router.delete("/clear", authenticate, clearWishlist);

export default router;
