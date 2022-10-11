const express = require("express");

const productsRouter = express.Router();

const { get, create, edit, drop } = require("../controllers/products");

productsRouter.get("/", get);

productsRouter.post("/", create);

productsRouter.patch("/:id", edit);

productsRouter.delete("/:id", drop);

module.exports = productsRouter;
