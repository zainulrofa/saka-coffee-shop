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
    const query =
      "insert into promos(code, discount, product_id, created_at, update_at) values($1, $2, $3, to_timestamp($4), to_timestamp($5))";
    const { code, discount, product_id } = body;
    const timestamp = Date.now() / 1000;
    postgreDb.query(
      query,
      [code.toUpperCase(), discount, product_id, timestamp, timestamp],
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
};

const editPromos = (body, params) => {
  return new Promise((resolve, reject) => {
    const values = [];
    const timestamp = Date.now() / 1000;
    let query = "update promos set ";
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1}, update_at = to_timestamp($${
          index + 2
        })  where id = $${index + 3}`;
        values.push(body[key], timestamp, params.id);
        return;
      }
      query += `${key} = $${index + 1}, `;
      values.push(body[key]);
    });

    postgreDb.query(query, values, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
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
