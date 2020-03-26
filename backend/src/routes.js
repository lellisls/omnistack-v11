const express = require("express");

const ongController = require("./controllers/OngController");

routes = express.Router();

routes.get("/ongs", ongController.index);

routes.post("/ongs", ongController.create);

module.exports = routes;
