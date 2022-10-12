const express = require("express");

const productsRouter = express.Router();

const {
  get,
  search,
  sort,
  filter,
  create,
  edit,
  drop,
} = require("../controllers/products");

productsRouter.get("/", get);

productsRouter.get("/search", search);

productsRouter.get("/sort", sort);

productsRouter.get("/category", filter);

productsRouter.post("/", create);

productsRouter.patch("/:id", edit);

productsRouter.delete("/:id", drop);

module.exports = productsRouter;
