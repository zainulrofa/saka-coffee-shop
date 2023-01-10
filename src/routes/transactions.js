const express = require("express");
const transactionsRouter = express.Router();
const {
  get,
  getAll,
  create,
  edit,
  drop,
} = require("../controllers/transactions");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");

transactionsRouter.get("/", isLogin(), allowedRoles("User", "Admin"), getAll);

// transactionsRouter.get("/:id", isLogin(), allowedRoles("User", "Admin"), get);

// transactionsRouter.get(
//   "/history",
//   isLogin(),
//   allowedRoles("User", "Admin"),
//   getAll
// );

transactionsRouter.post("/", isLogin(), allowedRoles("User", "Admin"), create);

transactionsRouter.patch("/:id", isLogin(), allowedRoles("Admin"), edit);

transactionsRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = transactionsRouter;
