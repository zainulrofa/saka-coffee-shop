const express = require("express");
const authsRouter = express.Router();
const authsController = require("../controllers/auth");
const isLogin = require("../middleware/isLogin");
const validate = require("../middleware/validate");
const allowed = {
  login: ["email", "password"],
  register: ["email", "password", "phone"],
};

// login
authsRouter.post("/login", authsController.login);
// logout
authsRouter.delete("/logout", isLogin(), authsController.logout);
// register
authsRouter.post(
  "/register",
  validate.body(...allowed.register),
  authsController.register
);
// verify
authsRouter.get("/verify/:otp", authsController.verify);
// forgot
authsRouter.patch(
  "/forgot-password",
  validate.body("email"),
  authsController.forgotPassword
);
// reset
authsRouter.patch(
  "/reset-password",
  validate.body("otp", "newPassword", "confirmPassword"),
  authsController.resetPassword
);

module.exports = authsRouter;
