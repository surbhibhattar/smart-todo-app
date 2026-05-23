require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const todoRoutes = require("./routes/todo.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));