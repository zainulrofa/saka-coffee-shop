const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTimeStamp = require("../helper/getTimeStamp");
const createOtp = require("../helper/createOTP");

// const {
//   userLogin,
//   wrongData,
//   systemError,
//   success,
//   custMsg,
//   unauthorized,
// } = require("../helper/templateResponse");
// const client = require("../config/redis");

const { SECRET_KEY } = process.env;

const authsRepo = {
  register: (req) =>
    new Promise((resolve, reject) => {
      const { email, password, phone } = req.body;
      const sqlCheckAvailibility =
        "select u.email, up.mobile_phone as phone from users u join profile up on up.user_id = u.id where u.email=$1 or up.mobile_phone=$2";
      postgreDb.query(sqlCheckAvailibility, [email, phone], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length > 0) {
          console.log(result.rows);
          if (result.rows.length > 1) {
            return reject({
              status: 403,
              msg: "Email and Phone Number Already Exist!",
            });
          }
          if (result.rows[0].email == email)
            return reject({
              status: 403,
              msg: "Email Already Exist!",
            });
          if (result.rows[0].phone == phone)
            return reject({
              status: 403,
              msg: "Phone Number Already Exist!",
            });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          const sqlCreateUser =
            "INSERT INTO USERS (email, password, register_otp, role_id) VALUES($1, $2, $3, $4) returning id, register_otp";
          const values = [email, hashedPwd, createOtp(), 1];
          postgreDb.query(sqlCreateUser, values, (error, res) => {
            if (error) {
              console.log(error);
              return reject({ status: 500, msg: "Internal Server Error" });
            }
            const id = res.rows[0].id;
            const otp = res.rows[0].register_otp;
            const sqlCreateProfile =
              "INSERT INTO profile (user_id, mobile_phone) values($1, $2)";
            postgreDb.query(sqlCreateProfile, [id, phone], (error) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              return resolve({ otp });
            });
          });
        });
      });
    }),

  verifyRegister: (req) =>
    new Promise((resolve, reject) => {
      const otp = req.params.otp;
      const sqlCheckOtp =
        "SELECT id, register_otp from users where register_otp = $1";
      postgreDb.query(sqlCheckOtp, [otp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 401, msg: "Wrong OTP" });
        const id = result.rows[0].id;
        const sqlVerify =
          "update users set register_otp = $1, update_at = to_timestamp($2) where id = $3 and register_otp = $4";
        postgreDb.query(
          sqlVerify,
          [null, getTimeStamp(), id, otp],
          (error, _) => {
            if (error) {
              console.log(error);
              return reject({ status: 500, msg: "Internal Server Error" });
            }
            return resolve({
              status: 200,
              msg: "Email Verified, Please Login",
            });
          }
        );
      });
    }),

  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      const getPasswordQuery =
        "select u.id, u.email, u.password, r.role from users u left join role r on u.role_id = r.id where email = $1";
      const invalidCridentials = new Error("Email/Password is Wrong");
      const statusCode = 401;
      console.log(email, password);
      postgreDb.query(getPasswordQuery, [email], (error, response) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        if (response.rows.length === 0)
          return reject({ error: invalidCridentials, statusCode });

        const hashedPassword = response.rows[0].password;
        bcrypt.compare(password, hashedPassword, (error, isSame) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          if (!isSame)
            return reject({
              error: invalidCridentials,
              statusCode,
            });

          const payload = {
            id: response.rows[0].id,
            email,
            role: response.rows[0].role,
          };
          jwt.sign(
            payload,
            SECRET_KEY,
            {
              expiresIn: "10d",
            },
            (error, token) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              return resolve({ token, payload });
            }
          );
        });
      });
    });
  },

  logout: (token) => {
    return new Promise((resolve, reject) => {
      const query = "insert into blacklist(token) values($1)";
      postgreDb.query(query, [token], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({ msg: "Logout Successful" });
      });
    });
  },

  forgotPassword: (req) =>
    new Promise((resolve, reject) => {
      const { email } = req.body;
      const sqlCheckUser = "Select id, email from users where email = $1";
      postgreDb.query(sqlCheckUser, [email], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Your Email Isn't Registered" });
        const otp = createOtp();
        const id = result.rows[0].id;
        const sqlCreateOtp =
          "update users set password_otp = $1, update_at = to_timestamp($2) where id = $3 returning password_otp";
        postgreDb.query(sqlCreateOtp, [otp, getTimeStamp(), id], (error) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          return resolve({ otp, email });
        });
      });
    }),

  resetPassword: (req) =>
    new Promise((resolve, reject) => {
      const { otp, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword)
        return reject({ status: 400, msg: "confirm password isn't matched" });
      const sqlCheckUser = "select id from users where password_otp = $1";
      postgreDb.query(sqlCheckUser, [otp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 401, msg: "Wrong OtP" });
        const id = result.rows[0].id;
        bcrypt.hash(newPassword, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ status: 500, msg: "Internal Server Error" });
          }
          const sqlUpdatePwd =
            "update users set password = $1, password_otp = $2, update_at = to_timestamp($3) where id = $4";
          postgreDb.query(
            sqlUpdatePwd,
            [hashedPwd, null, getTimeStamp(), id],
            (error, _) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server Error" });
              }
              return resolve({
                status: 200,
                msg: "Update Password Successfully",
              });
            }
          );
        });
      });
    }),
};

module.exports = authsRepo;
