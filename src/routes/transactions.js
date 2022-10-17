const express = require("express");
const transactionsRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/transactions");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");

transactionsRouter.get("/", isLogin(), allowedRoles("User"), get);

transactionsRouter.post("/", isLogin(), allowedRoles("User", "Admin"), create);

transactionsRouter.patch("/:id", isLogin(), allowedRoles("Admin"), edit);

transactionsRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = transactionsRouter;
