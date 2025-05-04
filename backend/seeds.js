// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
import mongoose from "mongoose";
import Product from "./models/ProductSchema.js";

mongoose
  .connect("mongodb://127.0.0.1/SellEradb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("db is created"))
  .catch((e) => {
    console.log(e);
  });

// const seedProducts = [
//   {
//     name: "Classic White T-Shirt",
//     image:
//       "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "A comfortable, everyday white t-shirt made from 100% cotton.",
//     price: 499,
//     sale: 10,
//   },
//   {
//     name: "Denim Jacket",
//     image:
//       "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Stylish and rugged denim jacket, perfect for casual wear.",
//     price: 2499,
//     sale: 20,
//   },
//   {
//     name: "Running Shoes",
//     image:
//       "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Lightweight running shoes for optimal performance.",
//     price: 3299,
//   },
//   {
//     name: "Leather Wallet",
//     image:
//       "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Premium quality leather wallet with multiple card slots.",
//     price: 899,
//     sale: 5,
//   },
//   {
//     name: "Wireless Headphones",
//     image:
//       "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Noise-canceling wireless headphones with deep bass.",
//     price: 4999,
//   },
// ];

const seedProducts = [];

for (let i = 1; i <= 10; i++) {
  seedProducts.push({
    name: `Product ${i}`,
    image: `https://plus.unsplash.com/premium_photo-1678739395192-bfdd13322d34?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
    description: `This is the description for product ${i}. It contains more than 15 characters.`,
    price: Math.floor(Math.random() * 500) + 1, // Random price between 1 and 500
    category: ['Electronics', 'Clothing', 'Accessories'][Math.floor(Math.random() * 3)], // Random category
    sale: Math.floor(Math.random() * 101), // Random sale percentage between 0 and 100
    qty: Math.floor(Math.random() * 50) + 1, // Random quantity between 1 and 50
  });
}

const delData = await Product.deleteMany({});
const createdData = await Product.insertMany(seedProducts);
// console.log(createdData);
mongoose.disconnect();