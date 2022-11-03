// import database
const postgreDb = require("../config/postgre");

const getTransactions = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select t.created_at, p2.display_name, p.product_name, s.size , p.price, t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile p2 on p2.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join deliveries d on d.id = t.delivery_id join payments py on py.id = t.payment_id join status st on st.id = t.status_id where t.id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, msg: "Transaction cannot be found" });
      return resolve({
        status: 200,
        msg: "Transaction Details",
        data: { ...result.rows[0] },
      });
    });
  });
};

const getAllTransactions = (id, queryParams) => {
  return new Promise((resolve, reject) => {
    const { page, limit } = queryParams;
    let link = "http://localhost:8060/api/v1/transactions/history?";
    const countQuery =
      "select count(id) as count from transactions where user_id = $1";

    const query =
      "select t.created_at, p2.display_name, p.product_name, p.image, s.size , p.price,t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile p2  on p2.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join deliveries d on d.id = t.delivery_id join payments py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1 order by created_at desc limit $2 offset $3";

    postgreDb.query(countQuery, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, msg: "Data not found" });

      const totalData = parseInt(result.rows[0].count);
      const sqlLimit = !limit ? 3 : parseInt(limit);
      const sqlOffset = !page || page === "1" ? 0 : parseInt(page - 1) * limit;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        parseInt(sqlLimit) > totalData
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));

      const prev =
        currentPage === 0
          ? null
          : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

      const next =
        currentPage === totalPage
          ? null
          : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;
      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData,
        prev,
        next,
      };

      postgreDb.query(query, [id, sqlLimit, sqlOffset], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 404, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Data not found" });
        return resolve({
          status: 200,
          msg: "List products",
          data: result.rows,
          meta,
        });
      });
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
  getAllTransactions,
  createTransactions,
  editTransactions,
  dropTransactions,
};

module.exports = transactionsRepo;
