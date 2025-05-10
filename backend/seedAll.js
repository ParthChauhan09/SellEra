import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import models
import Users from "./models/UserSchema.js";
import Vendors from "./models/VendorSchema.js";
import Products from "./models/ProductSchema.js";
import Reviews from "./models/reviewSchema.js";
import Orders from "./models/OrderSchema.js";

// Load environment variables
dotenv.config();

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/SellEradb";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  });

// Function to clear all collections
const clearCollections = async () => {
  console.log("Clearing all collections...");
  
  try {
    await Users.deleteMany({});
    console.log("Users collection cleared");
    
    await Vendors.deleteMany({});
    console.log("Vendors collection cleared");
    
    await Products.deleteMany({});
    console.log("Products collection cleared");
    
    await Reviews.deleteMany({});
    console.log("Reviews collection cleared");
    
    await Orders.deleteMany({});
    console.log("Orders collection cleared");
    
    console.log("All collections cleared successfully!");
  } catch (error) {
    console.error("Error clearing collections:", error);
    process.exit(1);
  }
};

// Create dummy vendors
const createVendors = async () => {
  console.log("Creating dummy vendors...");
  
  const vendors = [];
  const password = await bcrypt.hash("password123", 10);
  
  const vendorData = [
    {
      name: "Tech Solutions",
      email: "tech@example.com",
      password,
      description: "Leading provider of electronic gadgets and accessories."
    },
    {
      name: "Fashion Hub",
      email: "fashion@example.com",
      password,
      description: "Your one-stop shop for trendy clothing and fashion accessories."
    },
    {
      name: "Accessory World",
      email: "accessories@example.com",
      password,
      description: "Specializing in high-quality accessories for all your needs."
    }
  ];
  
  try {
    const createdVendors = await Vendors.insertMany(vendorData);
    console.log(`${createdVendors.length} vendors created successfully!`);
    return createdVendors;
  } catch (error) {
    console.error("Error creating vendors:", error);
    process.exit(1);
  }
};

// Create dummy products
const createProducts = async (vendors) => {
  console.log("Creating dummy products...");
  
  const products = [];
  
  // Electronics products for Tech Solutions
  const electronicsProducts = [
    {
      name: "Wireless Headphones",
      description: "Premium noise-canceling wireless headphones with deep bass and long battery life.",
      price: 199.99,
      category: "Electronics",
      sale: 10,
      qty: 50,
      vendorName: vendors[0]._id
    },
    {
      name: "Smart Watch",
      description: "Feature-packed smartwatch with health monitoring and notification features.",
      price: 249.99,
      category: "Electronics",
      sale: 15,
      qty: 30,
      vendorName: vendors[0]._id
    },
    {
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
      price: 89.99,
      category: "Electronics",
      sale: 5,
      qty: 75,
      vendorName: vendors[0]._id
    },
    {
      name: "Wireless Charger",
      description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
      price: 39.99,
      category: "Electronics",
      sale: 0,
      qty: 100,
      vendorName: vendors[0]._id
    }
  ];
  
  // Clothing products for Fashion Hub
  const clothingProducts = [
    {
      name: "Classic White T-Shirt",
      description: "A comfortable, everyday white t-shirt made from 100% organic cotton.",
      price: 24.99,
      category: "Clothing",
      sale: 0,
      qty: 200,
      vendorName: vendors[1]._id
    },
    {
      name: "Denim Jacket",
      description: "Stylish and rugged denim jacket, perfect for casual wear in any season.",
      price: 79.99,
      category: "Clothing",
      sale: 20,
      qty: 45,
      vendorName: vendors[1]._id
    },
    {
      name: "Slim Fit Jeans",
      description: "Modern slim fit jeans with stretch comfort technology.",
      price: 59.99,
      category: "Clothing",
      sale: 10,
      qty: 80,
      vendorName: vendors[1]._id
    },
    {
      name: "Casual Hoodie",
      description: "Warm and comfortable hoodie perfect for everyday wear.",
      price: 49.99,
      category: "Clothing",
      sale: 5,
      qty: 65,
      vendorName: vendors[1]._id
    }
  ];
  
  // Accessories products for Accessory World
  const accessoriesProducts = [
    {
      name: "Leather Wallet",
      description: "Premium quality leather wallet with multiple card slots and RFID protection.",
      price: 34.99,
      category: "Accessories",
      sale: 0,
      qty: 120,
      vendorName: vendors[2]._id
    },
    {
      name: "Sunglasses",
      description: "Stylish sunglasses with UV protection and polarized lenses.",
      price: 89.99,
      category: "Accessories",
      sale: 15,
      qty: 40,
      vendorName: vendors[2]._id
    },
    {
      name: "Backpack",
      description: "Durable backpack with laptop compartment and multiple pockets.",
      price: 69.99,
      category: "Accessories",
      sale: 10,
      qty: 55,
      vendorName: vendors[2]._id
    },
    {
      name: "Watch",
      description: "Classic analog watch with leather strap and water-resistant design.",
      price: 129.99,
      category: "Accessories",
      sale: 20,
      qty: 25,
      vendorName: vendors[2]._id
    }
  ];
  
  const allProducts = [...electronicsProducts, ...clothingProducts, ...accessoriesProducts];
  
  try {
    const createdProducts = await Products.insertMany(allProducts);
    
    // Update vendor productList
    for (let i = 0; i < vendors.length; i++) {
      const vendorProducts = createdProducts.filter(
        product => product.vendorName.toString() === vendors[i]._id.toString()
      );
      
      const productIds = vendorProducts.map(product => product._id);
      
      await Vendors.findByIdAndUpdate(
        vendors[i]._id,
        { $set: { productList: productIds } }
      );
    }
    
    console.log(`${createdProducts.length} products created successfully!`);
    return createdProducts;
  } catch (error) {
    console.error("Error creating products:", error);
    process.exit(1);
  }
};

// Create dummy users
const createUsers = async () => {
  console.log("Creating dummy users...");
  
  const password = await bcrypt.hash("password123", 10);
  
  const userData = [
    {
      name: "John Doe",
      email: "john@example.com",
      password
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      password
    },
    {
      name: "Alice Williams",
      email: "alice@example.com",
      password
    }
  ];
  
  try {
    const createdUsers = await Users.insertMany(userData);
    console.log(`${createdUsers.length} users created successfully!`);
    return createdUsers;
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
};

// Create dummy reviews
const createReviews = async (users, products) => {
  console.log("Creating dummy reviews...");
  
  const reviews = [];
  
  // Create a review for each user for different products
  for (let i = 0; i < users.length; i++) {
    // Each user reviews 3 different products
    for (let j = 0; j < 3; j++) {
      const productIndex = (i + j) % products.length;
      
      reviews.push({
        star: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        review: `This is a review for ${products[productIndex].name}. ${
          Math.random() > 0.5 
            ? "I really enjoyed this product and would recommend it." 
            : "It's a decent product with good value for money."
        }`,
        user: users[i]._id,
        product: products[productIndex]._id
      });
    }
  }
  
  try {
    const createdReviews = await Reviews.insertMany(reviews);
    
    // Update product reviews
    for (const review of createdReviews) {
      await Products.findByIdAndUpdate(
        review.product,
        { $push: { review: review._id } }
      );
    }
    
    // Update user reviews
    for (const review of createdReviews) {
      await Users.findByIdAndUpdate(
        review.user,
        { $push: { review: review._id } }
      );
    }
    
    console.log(`${createdReviews.length} reviews created successfully!`);
    return createdReviews;
  } catch (error) {
    console.error("Error creating reviews:", error);
    process.exit(1);
  }
};

// Create dummy orders
const createOrders = async (users, products) => {
  console.log("Creating dummy orders...");
  
  const orders = [];
  
  // Create 2 orders for each user
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 2; j++) {
      // Select 2-4 random products for each order
      const numProducts = Math.floor(Math.random() * 3) + 2;
      const orderProducts = [];
      
      for (let k = 0; k < numProducts; k++) {
        const randomIndex = Math.floor(Math.random() * products.length);
        orderProducts.push(products[randomIndex]._id);
      }
      
      // Calculate a random total (in a real app, this would be based on product prices)
      const total = Math.floor(Math.random() * 500) + 50;
      
      // Create order with a date in the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      orders.push({
        orderProducts,
        customer: users[i]._id,
        date: date.toISOString().split("T")[0],
        total
      });
    }
  }
  
  try {
    const createdOrders = await Orders.insertMany(orders);
    
    // Update user orderHistory
    for (const order of createdOrders) {
      await Users.findByIdAndUpdate(
        order.customer,
        { $push: { orderHistory: order._id } }
      );
    }
    
    console.log(`${createdOrders.length} orders created successfully!`);
    return createdOrders;
  } catch (error) {
    console.error("Error creating orders:", error);
    process.exit(1);
  }
};

// Main function to run the seeding process
const seedDatabase = async () => {
  try {
    // Clear all existing data
    await clearCollections();
    
    // Create dummy data
    const vendors = await createVendors();
    const products = await createProducts(vendors);
    const users = await createUsers();
    const reviews = await createReviews(users, products);
    const orders = await createOrders(users, products);
    
    console.log("Database seeded successfully!");
    
    // Disconnect from the database
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding process
seedDatabase();
