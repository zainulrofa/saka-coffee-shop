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
    return res.status(201).json({
      msg: `Prommo ${req.body.code.toUpperCase()} Added Successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await promosRepo.editPromos(req.body, req.params);
    res.status(200).json({ result: "Promo Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const drop = async (req, res) => {
  try {
    const response = await promosRepo.dropPromos(req.params);
    if (response.rowCount === 0)
      return res.status(404).json({ msg: "Data Not Found, No Data Deleted" });
    return res.status(200).json({ msg: "Data Deleted Successfully" });
  } catch (error) {
    console.log(error);
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
