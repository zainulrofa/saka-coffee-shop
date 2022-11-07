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

const createPromos = (body, file) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos(code, discount, description, duration, created_at, update_at, image, promo_name, min_price) values($1, $2, $3, $4, to_timestamp($5), to_timestamp($6), $7, $8, $9) returning *";
    const { code, discount, description, duration, promo_name, min_price } =
      body;
    const imageUrl = `${file.filename}`;
    const timestamp = Date.now() / 1000;
    postgreDb.query(
      query,
      [
        code.toUpperCase(),
        discount,
        description,
        duration,
        timestamp,
        timestamp,
        imageUrl,
        promo_name,
        min_price,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }

        return resolve({
          status: 201,
          msg: `promo ${result.rows[0].code} created sucessfully`,
          data: { ...result.rows[0] },
        });
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
