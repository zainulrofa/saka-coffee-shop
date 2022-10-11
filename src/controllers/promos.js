const promosRepo = require("../repo/promos");

const get = async (req, res) => {
  try {
    const response = await promosRepo.getPromos();
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
    const response = await promosRepo.createPromos(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await promosRepo.editPromos(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const drop = async (req, res) => {
  try {
    const response = await promosRepo.dropPromos(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const promosController = {
  get,
  create,
  edit,
  drop,
};

module.exports = promosController;
