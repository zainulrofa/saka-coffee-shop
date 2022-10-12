// import database
const postgreDb = require("../config/postgre");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from users";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createUsers = (body) => {
  return new Promise((resolve, reject) => {
    //   cara pake parsing postman
    const query =
      "insert into users (display_name, first_name, last_name, email, password, mobile_number, address, date_birthday, gender) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
    const {
      display_name,
      first_name,
      last_name,
      email,
      password,
      mobile_number,
      address,
      date_birthday,
      gender,
    } = body;
    postgreDb.query(
      query,
      [
        display_name,
        first_name,
        last_name,
        email,
        password,
        mobile_number,
        address,
        date_birthday,
        gender,
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

const editUsers = (body, params) => {
  const query = "update users set last_name = $1 where id = $2";
  postgreDb
    .query(query, [body.last_name, params.id])
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
};

const UsersRepo = {
  getUsers,
  createUsers,
  editUsers,
};

module.exports = UsersRepo;
