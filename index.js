const express = require("express");

// import database
const postgreDb = require("./src/config/postgre");

// import main router
const mainRouter = require("./src/routes/main");

// init express application
const app = express();

const port = 8060;

postgreDb
  .connect()
  .then(() => {
    console.log("DB connected");

    // pasang parser untuk body
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // semua req ke server akan didelegasikan ke mainRouter
    app.use(mainRouter);

    app.listen(port, () => {
      console.log(`App is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
