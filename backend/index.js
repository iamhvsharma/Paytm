const express = require("express");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const cors = require("cors")
dotenv.config();

const app = express();

connectDB().then(
  app.listen(3000, () => {
    console.log("Server is listening on PORT: 3000");
  })
);

// Middlewares
app.use(cors())
app.use(express.json());

app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    MSG: "Server running successfully!",
  });
});
