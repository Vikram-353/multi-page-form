const express = require("express");
const {
  createForm,
  getDataById,
  updateData,
} = require("../controllers/controller");
const routes = express.Router();

routes.post("/forms", createForm);
routes.get("/forms/:id", getDataById);
routes.patch("/forms/:id", updateData);

module.exports = routes;
