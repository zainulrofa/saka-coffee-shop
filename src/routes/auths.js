const express = require("express");
const authsRouter = express.Router();
const authsController = require("../controllers/auth");
const isLogin = require("../middleware/isLogin");
// login
authsRouter.patch("/login", authsController.login);
// logout
authsRouter.delete("/logout", isLogin(), authsController.logout);

module.exports = authsRouter;
