const express = require("express");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
dotenv.config()

const app = express();

connectDB();

app.get("/", (req, res) => {
    res.status(200).json({
        MSG: "Server running successfully!"
    })
})