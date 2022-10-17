const express = require("express");
const promosRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/promos");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");

promosRouter.get("/", get);

promosRouter.post("/", isLogin(), allowedRoles("Admin"), create);

promosRouter.patch("/:id", isLogin(), allowedRoles("Admin"), edit);

promosRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = promosRouter;
