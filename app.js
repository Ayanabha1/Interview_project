const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");
const PORT = 8000;

const authRoute = require("./Routes/authRoute");

// Booting the server up and confguration
const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("Yay! Database is connected");
});

// Routes and middlewares

app.get("/", (req, res) => {
  res.send("Heyy whatsup This is Ayanabha Misra");
});

app.use("/api/auth", authRoute);

// Listening to the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
