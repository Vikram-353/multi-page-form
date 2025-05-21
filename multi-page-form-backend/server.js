const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Add a root path route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Welcome to the API.");
});

// ✅ Main API routes
app.use("/api/", routes);

// ✅ Export the app for Vercel
module.exports = app;
