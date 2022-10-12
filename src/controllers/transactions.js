const transactionsRepo = require("../repo/transactions");

const get = async (req, res) => {
  try {
    const response = await transactionsRepo.getTransactions();
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
    const response = await transactionsRepo.createTransactions(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await transactionsRepo.editTransactions(
      req.body,
      req.params
    );
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const drop = async (req, res) => {
  try {
    const response = await transactionsRepo.dropTransactions(req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const transactionsController = {
  get,
  create,
  edit,
  drop,
};

module.exports = transactionsController;
