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

const search = async (req, res) => {
  try {
    const result = await productsRepo.searchProducts(req.query);
    return res.status(200).json({
      result: result.rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const sort = async (req, res) => {
  try {
    const result = await productsRepo.sortProducts(req.query);
    res.status(200).json({
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const filter = async (req, res) => {
  try {
    const result = await productsRepo.filterProducts(req.query);
    res.status(200).json({
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
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
  search,
  sort,
  filter,
  create,
  edit,
  drop,
};

module.exports = productsController;
