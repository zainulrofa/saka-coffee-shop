const express = require("express");

const transactionsRouter = express.Router();

const { get, create, edit, drop } = require("../controllers/transactions");

transactionsRouter.get("/", get);

transactionsRouter.post("/", create);

transactionsRouter.patch("/:id", edit);

transactionsRouter.delete("/:id", drop);

module.exports = transactionsRouter;
