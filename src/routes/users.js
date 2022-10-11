const express = require("express");

const usersRouter = express.Router();

const { get, create, edit } = require("../controllers/users");

usersRouter.get("/", get);

usersRouter.post("/", create);

usersRouter.patch("/:id", edit);

module.exports = usersRouter;
