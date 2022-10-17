const transactionsRepo = require("../repo/transactions");

const get = async (req, res) => {
  try {
    const response = await transactionsRepo.getTransactions(req.userPayload.id);
    res.status(200).json({ result: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const create = async (req, res) => {
  try {
    const response = await transactionsRepo.createTransactions(
      req.body,
      req.userPayload.id
    );
    res.status(201).json({ msg: "Transaction Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  try {
    const response = await transactionsRepo.editTransactions(
      req.body,
      req.params
    );
    res.status(200).json({ result: "Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const drop = async (req, res) => {
  try {
    const response = await transactionsRepo.dropTransactions(req.params);
    res.status(200).json({ result: "Delete Success" });
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
