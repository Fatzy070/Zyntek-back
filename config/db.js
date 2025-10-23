import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/userSchema.js'

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/commerce');
    console.log("✅ Connected to MongoDB successfully");

    // Check for existing admin by email instead of role
    const adminExist = await User.findOne({ email: "admin@example.com" });

    if (!adminExist) {
      const hashedPassword = await bcrypt.hash("Admin123", 10);

      const adminUser = new User({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("👑 Admin user created successfully!");
    } else {
      console.log("⚡ Admin already exists. Skipping creation.");
    }
  } catch (error) {
    console.error("❌ Cannot connect to DB:", error);
    process.exit(1);
  }
};

export default connectDB;
