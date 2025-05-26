const mongoose = require("mongoose");

module.exports =  async function connectDB() {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGO DB Connection successful.", res.connection.host);
  } catch (error) {
    console.log("ERROR occured while connecting to MongoDB :", error);
  }
}
