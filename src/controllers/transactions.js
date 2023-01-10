const transactionsRepo = require("../repo/transactions");
const resHelper = require("../helper/sendResponse");

const get = async (req, res) => {
  try {
    const response = await transactionsRepo.getTransactions(req.params.id);
    resHelper.success(res, response.status, response);
  } catch (error) {
    resHelper.error(res, error.status, error);
  }
};

// const get = async (req, res) => {
//   try {
//     const response = await transactionsRepo.getTransactions(req.userPayload.id);
//     res.status(200).json({ result: response });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

const getAll = async (req, res) => {
  try {
    const response = await transactionsRepo.getAllTransactions(
      req.userPayload.id,
      req.query
    );
    return resHelper.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return resHelper.error(res, error.status, error);
  }
};

const create = async (req, res) => {
  try {
    const response = await transactionsRepo.createTransactions(
      req.body,
      req.userPayload.id
    );
    res.status(201).json({
      status: 201,
      msg: "Transaction Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const edit = async (req, res) => {
  try {
    const response = await transactionsRepo.editTransactions(
      req.body,
      req.params
    );
    res.status(200).json({
      status: 200,
      result: "Changed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const drop = async (req, res) => {
  try {
    const response = await transactionsRepo.dropTransactions(req.params);
    res.status(200).json({
      status: 200,
      result: "Delete Success",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

const transactionsController = {
  get,
  getAll,
  create,
  edit,
  drop,
};

module.exports = transactionsController;
