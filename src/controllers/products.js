const productsRepo = require("../repo/products");

const get = async (req, res) => {
  try {
    const response = await productsRepo.getProducts();
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
    const response = await productsRepo.createProducts(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await productsRepo.editProducts(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const drop = async (req, res) => {
  try {
    const result = await productsRepo.dropProducts(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const productsController = {
  get,
  create,
  edit,
  drop,
};

module.exports = productsController;
