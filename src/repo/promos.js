// import database
const postgreDb = require("../config/postgre");

const getPromos = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from promos";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createPromos = (body) => {
  return new Promise((resolve, reject) => {
    //   cara pake parsing postman
    const query =
      "insert into promos (product_id, promo_name, discount, code) values ($1,$2,$3,$4)";
    const { product_id, promo_name, discount, code } = body;
    postgreDb.query(
      query,
      [product_id, promo_name, discount, code],
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

const editPromos = (body, params) => {
  const query = "update promos set code=$1 where id = $2";
  postgreDb
    .query(query, [body.code, params.id])
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
};

const dropPromos = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where id = $1";
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const promosRepo = {
  getPromos,
  createPromos,
  editPromos,
  dropPromos,
};

module.exports = promosRepo;
