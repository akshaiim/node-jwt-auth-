const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./route/auth.js");
const dotenv = require("dotenv");
const postRoutes = require("./route/posts.js");
dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(
  CONNECTION_URL,
  { useNewUrlParser: true },
  () => {
    console.log("Connected to Db");
  }
);

app.use(express.json());

app.use("/api/user", authRoute);
app.use("/api/posts", postRoutes);

app
  .get("/authRoute", (req, res) => {
    res.send("hello");
  })
  .listen(3000, () => {
    console.log("server running on 3000");
  });
