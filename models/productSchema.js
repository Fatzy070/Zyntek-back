import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // current/selling price
  oldPrice: { type: Number }, // price before discount
  discountPercent: { type: Number }, // e.g. 20 for 20%
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
