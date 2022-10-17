const express = require("express");

// import subrouter
const productsRouter = require("./products");
const usersRouter = require("./users");
const promosRouter = require("./promos");
const transactionsRouter = require("./transactions");
const authsRouter = require("./auths");
// const authsRouter = require("./auths");

const prefix = "/api/v1";

const mainRouter = express.Router();

// sambungkan subrouter dengan mainrouter
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/auths`, authsRouter);

// http route
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "welcome",
  });
});

module.exports = mainRouter;
