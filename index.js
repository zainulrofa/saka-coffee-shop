require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("./src/config/redis");

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

    app.use(cors());
    // pasang parser untuk body
    app.use(express.json());
    app.use(express.static("./public/images"));
    app.use(express.urlencoded({ extended: false }));
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
    // semua req ke server akan didelegasikan ke mainRouter
    app.use(mainRouter);

    app.listen(port, () => {
      console.log(`App is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
