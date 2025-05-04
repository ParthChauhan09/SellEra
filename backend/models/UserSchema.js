import mongoose, { Schema } from "mongoose";
import Products from "./ProductSchema.js";
import Orders from "./OrderSchema.js";
import Reviews from "./reviewSchema.js";

import fs from "fs"; // Import the file system module
import path from "path";
import { fileURLToPath } from "url";

// Function to read the default profile picture into a buffer
const getDefaultProfilePictureBuffer = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const defaultImagePath = path.join(__dirname, "defaultProfile.webp");

    if (fs.existsSync(defaultImagePath)) {
      return fs.readFileSync(defaultImagePath);
    } else {
      console.error("Default profile picture not found at:", defaultImagePath);
      return null;
    }
  } catch (error) {
    console.error("Error reading default profile picture:", error);
    return null;
  }
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: [3, "too short name"],
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

UserSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter()); // Get the vendor document being deleted
    if (user && user.review && user.review.length > 0) {
      // Delete associated products
      await Reviews.deleteMany({ _id: { $in: user.review } });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-delete middleware for findByIdAndDelete
UserSchema.pre("findByIdAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter()); // Get the user document being deleted
    if (user && user.review && user.review.length > 0) {
      // Delete associated Reviews
      await Reviews.deleteMany({ _id: { $in: user.review } });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
