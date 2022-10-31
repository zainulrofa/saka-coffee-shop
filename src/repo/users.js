// import database
const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

const getUsers = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select p.*, u.email from profile p join users u on u.id = p.user_id where p.user_id =$1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

// const createUsers = (body) => {
//   return new Promise((resolve, reject) => {
//     const queries =
//       "insert into users(email, password, mobile_phone , role_id) values($1, $2, $3, $4)";

//     const { email, password, mobile_phone, role_id } = body;

//     bcrypt.hash(password, 10, (error, hashedPwd) => {
//       if (error) {
//         console.log(error);
//         return reject({ error });
//       }
//       postgreDb.query(
//         queries,
//         [email, hashedPwd, mobile_phone, role_id],
//         (error, result) => {
//           if (error) {
//             console.log(error);
//             return reject({ error });
//           }
//           return resolve(result);
//         }
//       );
//     });
//   });
// };

const createUsers = (body) => {
  return new Promise((resolve, reject) => {
    const queries = {
      checkEmailandPhone:
        "select p.mobile_phone, u.email from profile p left join users u on u.id = p.user_id where mobile_phone = $1 or email = $2",
      userInsert:
        "insert into users(email, password, created_at, update_at, role_id) values($1, $2, to_timestamp($3), to_timestamp($4), $5) returning id",
      profileInsert:
        "insert into profile(user_id, mobile_phone, created_at, update_at) values($1, $2, to_timestamp($3), to_timestamp($4))",
    };
    const { checkEmailandPhone, userInsert, profileInsert } = queries;
    const timeStamp = Date.now() / 1000;
    const { email, password, phone } = body;

    postgreDb.query(
      checkEmailandPhone,
      [phone, email],
      (error, checkResult) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }

        if (checkResult.rows.length > 0) {
          const errorMessage = [];
          if (
            checkResult.rows.length > 1 ||
            (checkResult.rows[0].phone == phone &&
              checkResult.rows[0].email == email)
          )
            errorMessage.push("Email and phone number already exist", 403);

          if (checkResult.rows[0].phone == phone)
            errorMessage.push("Email and phone number already exist", 403);
          if (checkResult.rows[0].email == email)
            errorMessage.push("Email and phone number already exist", 403);

          return reject({
            error: new Error(errorMessage[0]),
            statusCode: errorMessage[1],
          });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          const role = 1;
          postgreDb.query(
            userInsert,
            [email, hashedPwd, timeStamp, timeStamp, role],
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              postgreDb.query(
                profileInsert,
                [result.rows[0].id, phone, timeStamp, timeStamp],
                (error, result) => {
                  if (error) {
                    console.log(error);
                    return reject({ error });
                  }
                  return resolve(result);
                }
              );
            }
          );
        });
      }
    );
  });
};

const editUsers = (body, id, file) => {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now() / 1000;
    const values = [];
    let query = "update profile set ";
    let imageUrl = "";
    if (file) {
      imageUrl = `/image/${file.filename} `;
      if (Object.keys(body).length > 0) {
        query += `image = '${imageUrl}', `;
      }
      if (Object.keys(body).length === 0) {
        query += `image = '${imageUrl}', update_at = to_timestamp($1) where user_id = $2 returning display_name`;
        values.push(timeStamp, id);
      }
    }
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1}, update_at = to_timestamp($${
          index + 2
        }) where user_id = $${index + 3} returning display_name`;
        values.push(body[key], timeStamp, id);
        return;
      }
      query += `${key} = $${index + 1}, `;
      values.push(body[key]);
    });
    console.log(query);
    postgreDb.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      let data = {};
      if (file) data = { Image: imageUrl, ...result.rows[0] };
      data = { Image: imageUrl, ...result.rows[0] };
      return resolve({
        status: 200,
        msg: `${result.rows[0].display_name}, your profile successfully updated`,
        data,
      });
    });
  });
};

const editPassword = (body, params) => {
  return new Promise((resolve, reject) => {
    const getPasswordQuery = "select password from users where id = $1";
    const { old_password, new_password } = body;
    postgreDb.query(getPasswordQuery, [params], (error, response) => {
      if (error) {
        console.log(error);
        return reject({ error });
      }
      //return resolve(response.rows);
      const oldHashedPwd = response.rows[0].password;
      bcrypt.compare(old_password, oldHashedPwd, (error, isSame) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        if (!isSame)
          return reject({
            error: new Error("Wrong old password"),
            statusCode: 403,
          });
        bcrypt.hash(new_password, 10, (error, newHashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          const editPwdQuery = "update users set password = $1 where id = $2";
          postgreDb.query(
            editPwdQuery,
            [newHashedPwd, params],
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              return resolve(result);
            }
          );
        });
      });
    });
  });
};

const UsersRepo = {
  getUsers,
  createUsers,
  editUsers,
  editPassword,
};

module.exports = UsersRepo;
