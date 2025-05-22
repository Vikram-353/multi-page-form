const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://multi-page-form-92c89huqc-vilram-ranjans-projects.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(cors());
app.use(express.json());

// ✅ Add a root path route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Welcome to the API.");
});

// ✅ Main API routes
app.use("/api", routes);

app.listen(port, () => console.log("Server Started", port));
