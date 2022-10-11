const usersRepo = require("../repo/users");

const get = async (req, res) => {
  try {
    const response = await usersRepo.getUsers();
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal App Error",
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await usersRepo.createUsers(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await usersRepo.editUsers(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const usersController = {
  get,
  create,
  edit,
};

module.exports = usersController;
