const authsRepo = require("../repo/auth");
const resHelper = require("../helper/sendResponse");
const { mailSender } = require("../helper/mail");

const authsController = {
  register: async (req, res) => {
    try {
      const register = await authsRepo.register(req);
      const setSendMail = {
        to: req.body.email,
        subject: "Register Verification",
        template: "mail.html",
        link: `http://localhost:8080/api/auth/verify/${register.otp}`,
      };
      const response = await mailSender(setSendMail);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  verify: async (req, res) => {
    try {
      const response = await authsRepo.verifyRegister(req);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  login: async (req, res) => {
    try {
      const response = await authsRepo.login(req.body);
      res.status(200).json({
        msg: "Login Successful",
        data: { token: response.token, payload: response.payload },
      });
    } catch (objError) {
      return res
        .status(objError.statusCode || 500)
        .json({ msg: objError.error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const response = await authsRepo.logout(req.token);
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ msg: "internal Server Error" });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const forgot = await authsRepo.forgotPassword(req);
      const setSendMail = {
        to: req.body.email,
        name: req.body.email,
        subject: "Reset Password Verification",
        template: "forgotpassword.html",
        otp: forgot.otp,
      };
      await mailSender(setSendMail);
      resHelper.success(res, 200, {
        status: 200,
        msg: "Success, please check email to reset your password",
      });
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const response = await authsRepo.resetPassword(req);
      resHelper.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      resHelper.error(res, error.status, error);
    }
  },
};
module.exports = authsController;
