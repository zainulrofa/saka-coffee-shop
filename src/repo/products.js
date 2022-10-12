// import database
const postgreDb = require("../config/postgre");

const getProducts = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from products";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const searchProducts = (params) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from products where lower(product_name) like lower($1)";
    const values = [`%${params.product_name}%`];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const filterProducts = (params) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from products where lower(product_category) like lower($1) order by id asc";
    const values = [`${params.product_category}`];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const sortProducts = (params) => {
  return new Promise((resolve, reject) => {
    const { sort } = params;
    let query = "select id, product_name, price, create_at from products ";
    if (sort) {
      if (sort.toLowerCase() === "lowest") {
        query += "order by price asc";
      }
      if (sort.toLowerCase() === "highest") {
        query += "order by price desc";
      }
      if (sort.toLowerCase() === "newest") {
        query += "order by create_at desc";
      }
      if (sort.toLowerCase() === "oldest") {
        query += "order by create_at asc";
      }
    }
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createProducts = (body) => {
  return new Promise((resolve, reject) => {
    //   cara pake parsing postman
    const query =
      "insert into products (product_category, product_name, price) values ($1,$2,$3)";
    const { product_category, product_name, price } = body;
    postgreDb.query(
      query,
      [product_category, product_name, price],
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

const editProducts = (body, params) => {
  const query =
    "update products set product_size=$1, stock = $2, sold = $3 where id = $4";
  postgreDb
    .query(query, [body.product_size, body.stock, body.sold, params.id])
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
};

const dropProducts = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where id = $1";
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const productsRepo = {
  getProducts,
  searchProducts,
  sortProducts,
  filterProducts,
  createProducts,
  editProducts,
  dropProducts,
};

module.exports = productsRepo;
