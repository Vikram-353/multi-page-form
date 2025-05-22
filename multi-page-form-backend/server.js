const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ✅ Add a root path route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Welcome to the API.");
});

// ✅ Main API routes
app.use("/api", routes);

app.listen(port, () => console.log("Server Started", port));
