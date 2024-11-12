import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        console.log("Could not connect to database!");
        process.exit(1);
    }
};

export default connectDB;