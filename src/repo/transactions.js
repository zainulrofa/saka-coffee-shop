// import database
const postgreDb = require("../config/postgre");

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from transactions";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createTransactions = (body) => {
  return new Promise((resolve, reject) => {
    //   cara pake parsing postman
    const query =
      "insert into transactions (promo_id, user_id, amount, delivery_method, payment_method, transaction_date) values ($1,$2,$3,$4,$5,$6)";
    const {
      promo_id,
      user_id,
      amount,
      delivery_method,
      payment_method,
      transaction_date,
    } = body;
    postgreDb.query(
      query,
      [
        promo_id,
        user_id,
        amount,
        delivery_method,
        payment_method,
        transaction_date,
      ],
      (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
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
};

const editTransactions = (body, params) => {
  const query = "update transactions set amount=$1 where id = $2";
  postgreDb
    .query(query, [body.amount, params.id])
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
};

const dropTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transactions where id = $1";
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const transactionsRepo = {
  getTransactions,
  createTransactions,
  editTransactions,
  dropTransactions,
};

module.exports = transactionsRepo;
