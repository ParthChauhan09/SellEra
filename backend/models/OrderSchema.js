import mongoose from "mongoose";
import Products from "./ProductSchema.js";
import Users from "./UserSchema.js";

const OrderSchema = new mongoose.Schema({
  orderProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      require: true,
    },
  ],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
});
const Orders = mongoose.model("Orders", OrderSchema);

export default Orders;
