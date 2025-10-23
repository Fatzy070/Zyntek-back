import Product from '../models/productSchema.js';


// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, imageUrl , oldPrice , discountPercent } = req.body;

    if (!name || !price || !category || !imageUrl ) {
      return res.status(400).json({ message: "All fields including imageUrl are required." });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      imageUrl,
      oldPrice,
      discountPercent,

    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server error while fetching products",
    });
  }
};
 
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID was provided
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // ✅ Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    // ✅ Handle if no product found
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Respond success
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: "No query provided" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};