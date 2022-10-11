const express = require("express");

// import subrouter
const productsRouter = require("./products");
const usersRouter = require("./users");
const promosRouter = require("./promos");
const transactionsRouter = require("./transactions");

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
