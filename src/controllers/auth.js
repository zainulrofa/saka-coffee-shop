const authsRepo = require("../repo/auth");

const authsController = {
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
};
module.exports = authsController;
