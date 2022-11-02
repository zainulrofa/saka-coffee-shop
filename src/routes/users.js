const express = require("express");
const usersRouter = express.Router();
const { get, create, edit, editPassword } = require("../controllers/users");
const isLogin = require("../middleware/isLogin");
const allowedRoles = require("../middleware/allowedRoles");
const uploads = require("../middleware/upload");

usersRouter.get("/profile_user", allowedRoles("User"), get);
// register
usersRouter.post("/", create);
// edit profile
usersRouter.patch("/profile", allowedRoles("User"), uploads, edit);
// edit password
usersRouter.patch("/password/:id", editPassword);

module.exports = usersRouter;
