const express = require("express");
const productsRouter = express.Router();
const { get, create, edit, drop, getById } = require("../controllers/products");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const validate = require("../middleware/validate");
const uploads = require("../middleware/upload");

const allowed = {
  query: ["search", "categories", "sort", "page", "limit"],
  body: ["product_name", "price", "category_id", "description"],
};

productsRouter.get("/:id", getById);

productsRouter.get("/", get);

productsRouter.post(
  "/",
  isLogin(),
  allowedRoles("Admin"),
  uploads,
  validate.body(...allowed.body),
  create
);

productsRouter.patch("/:id", isLogin(), allowedRoles("Admin"), uploads, edit);

productsRouter.delete("/:id", drop);

module.exports = productsRouter;
