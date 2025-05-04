import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1/SellEradb")
  .then()
  .catch((e) => {
    // console.log(e);
  });

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/SellEradb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
