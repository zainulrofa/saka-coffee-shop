const productsRepo = require("../repo/products");
const resHelper = require("../helper/sendResponse");

const getById = async (req, res) => {
  try {
    const response = await productsRepo.getProductById(req.params.id);
    return res.status(200).json({ result: response });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const get = async (req, res) => {
  try {
    const response = await productsRepo.getProducts(req.query);
    return res.status(200).json({ result: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await productsRepo.createProducts(req.body, req.file);
    console.log(req.body);
    return res.status(201).json({
      status: 201,
      result: `${req.body.product_name} Added Successfully`,
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const edit = async (req, res) => {
  try {
    const response = await productsRepo.editProducts(
      req.body,
      req.params.id,
      req.file
    );
    if (response.rowCount === 0)
      return res.status(404).json({ msg: "Data Not Found" });
    return res.status(200).json({
      status: 200,
      result: `${response.rows[0].product_name} Changed Successfully`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const drop = async (req, res) => {
  try {
    const response = await productsRepo.dropProducts(req.params);
    if (response.rowCount === 0)
      return res.status(404).json({
        status: 404,
        msg: "Data Not Found",
      });
    return res.status(200).json({
      status: 200,
      result: `Item Deleted Successfully`,
      data: response.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const productsController = {
  getById,
  get,
  create,
  edit,
  drop,
};

module.exports = productsController;
