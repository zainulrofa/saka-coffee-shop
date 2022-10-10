const { response } = require("express");
const express = require("express");

const transactionsRouter = express.Router();

// import database
const postgreDb = require("../config/postgre");

transactionsRouter.get("/", async (req, res) => {
  try {
    const query = "select * from transactions";
    const response = await postgreDb.query(query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal App Error",
    });
  }
});

transactionsRouter.post("/", (req, res) => {
  //   cara pake parsing postman
  const query =
    "insert into transactions (product_group, product_name, price, promo) values ($1,$2,$3,$4)";
  const { product_group, product_name, price, promo } = req.body;
  postgreDb.query(
    query,
    [product_group, product_name, price, promo],
    (err, queryResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
      res.status(201).json({ result: queryResult.rows });
    }
  );
  //   cara post biasa
  //   const query =
  //   "insert into products (product_group, product_name, price, promo) values ('Foods','Drum Sticks', '30000', 'true')";
  //   postgreDb.query(query, (err, queryResult) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({ msg: "Internal Server Error" });
  //     }
  //     res.status(201).json({ result: queryResult.rows });
  //   });
});

transactionsRouter.patch("/:id", (req, res) => {
  const query = "update transactions set price=$1 where id = $2";
  postgreDb.query(query, [req.body.price, req.params.id]).then((response) => {
    res
      .status(200)
      .json({ result: response })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error" });
      });
  });
});

transactionsRouter.delete("/:id", (req, res) => {
  const query = "delete from transactions where id = $1";
  postgreDb.query(query, [req.params], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
    res.status(200).json({ result });
  });
});

module.exports = transactionsRouter;
