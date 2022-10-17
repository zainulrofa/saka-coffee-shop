// import database
const postgreDb = require("../config/postgre");

const getTransactions = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select t.created_at, u.display_name, p.product_name, s.size , p.price, t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile u on u.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join deliveries d on d.id = t.delivery_id join payments py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1 order by created_at desc";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result.rows);
    });
  });
};

const createTransactions = (body, id) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transactions (user_id, product_id, size_id, promo_id, payment_id, delivery_id, qty, subtotal, status_id, created_at, update_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9, to_timestamp($10), to_timestamp($11))";
    const {
      product_id,
      size_id,
      promo_id,
      payment_id,
      delivery_id,
      qty,
      subtotal,
      status_id,
    } = body;
    const timeStamp = Date.now() / 1000;
    const user_id = id;
    const values = [
      user_id,
      product_id,
      size_id,
      promo_id,
      payment_id,
      delivery_id,
      qty,
      subtotal,
      status_id,
      timeStamp,
      timeStamp,
    ];

    // return console.log(values);

    postgreDb.query(query, values, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

const editTransactions = (body, params) => {
  return new Promise((resolve, reject) => {
    const values = [];
    let query = "update transactions set ";
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1} where id  = $${index + 2}`;
        values.push(body[key], params.id);
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
