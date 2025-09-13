const mongoose = require("mongoose");
require("dotenv").config();
const URL = import.meta.env.VITE_API_URL;


const connectDB = async () => {
     try {
        await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
}
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
}
};
module.exports = { connectDB, disconnectDB };

