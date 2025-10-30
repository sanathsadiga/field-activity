import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "admin@gmail.com";
    const name = "Admin";
    const password = "Admin@123"; // change after first login

    let admin = await User.findOne({ email });
    if (!admin) {
      const hash = await bcrypt.hash(password, 10);
      admin = await User.create({ name, email, password: hash, role: "admin" });
      console.log("Admin user created:", email, "password:", password);
    } else {
      console.log("Admin already exists:", email);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
