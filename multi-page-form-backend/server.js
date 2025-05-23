const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Welcome to the API.");
});

app.use("/api", routes);

app.listen(port, () => console.log("Server Started", port));
