// Quick MongoDB Connection Test
const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI || "";

console.log("Testing MongoDB connection...");
console.log("URI:", mongoUri.replace(/:[^:@]+@/, ":****@")); // Hide password

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connection successful!");
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", error.message);
    console.error("\nCommon solutions:");
    console.error("1. Check your username and password are correct");
    console.error("2. Whitelist your IP in MongoDB Atlas Network Access");
    console.error("3. Check your network/firewall settings");
    console.error("4. Try using 0.0.0.0/0 to allow all IPs (for testing only)");
    process.exit(1);
  });
