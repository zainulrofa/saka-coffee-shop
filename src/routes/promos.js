const express = require("express");
const promosRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/promos");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const validate = require("../middleware/validate");
const uploads = require("../middleware/upload");

promosRouter.get("/", get);

promosRouter.post("/", isLogin(), allowedRoles("Admin"), uploads, create);

promosRouter.patch("/:id", isLogin(), allowedRoles("Admin"), edit);

promosRouter.delete("/:id", isLogin(), allowedRoles("Admin"), drop);

module.exports = promosRouter;
