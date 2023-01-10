const usersRepo = require("../repo/users");

const get = async (req, res) => {
  try {
    const response = await usersRepo.getUsers(req.userPayload.id);
    res.status(200).json({ result: response.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const response = await usersRepo.createUsers(body);
    res.status(201).json({
      msg: `Congrats ${body.email}, your account created successfully`,
    });
  } catch (objError) {
    console.log(objError);
    res
      .status(objError.statusCode || 500)
      .json({ error: objError.error.message });
  }
};

const edit = async (req, res) => {
  try {
    const response = await usersRepo.editUsers(
      req.body,
      req.userPayload.id,
      req.file
    );
    res.status(200).json({
      msg: `your data has been updated`,
      data: { ...response.data },
    });
  } catch (Error) {
    console.log(Error);
    res.status(500).json({ msg: "internal Server Error" });
  }
};

const editPassword = async (req, res) => {
  try {
    const response = await usersRepo.editPassword(req.body, req.params.id);
    res.status(200).json({ msg: `Password Changed` });
  } catch (objError) {
    res
      .status(objError.statusCode || 500)
      .json({ msg: objError.error.message });
  }
};

const usersController = {
  get,
  create,
  edit,
  editPassword,
};

module.exports = usersController;
