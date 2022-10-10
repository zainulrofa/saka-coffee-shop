const express = require("express");

// import subrouter
const productsRouter = require("./products");
const usersRouter = require("./products");
const promosRouter = require("./products");
const transactionsRouter = require("./products");

const mainRouter = express.Router();

const prefix = "/api/v1";

// sambungkan subrouter dengan mainrouter
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);

// http route
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "welcome",
  });
});

module.exports = mainRouter;
