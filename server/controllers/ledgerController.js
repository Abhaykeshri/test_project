const ledger = require("../services/tokenLedger");

const sendLedgerError = (res, error) => {
  res.status(error.statusCode || 400).json({
    success: false,
    message: error.message,
  });
};

exports.mintTokens = (req, res) => {
  try {
    const result = ledger.mint(req.body.to, req.body.amount);

    res.status(201).json({
      success: true,
      ...result,
      symbol: ledger.symbol,
    });
  } catch (error) {
    sendLedgerError(res, error);
  }
};

exports.transferTokens = (req, res) => {
  try {
    const result = ledger.transfer(
      req.body.from,
      req.body.to,
      req.body.amount
    );

    res.status(200).json({
      success: true,
      ...result,
      symbol: ledger.symbol,
    });
  } catch (error) {
    sendLedgerError(res, error);
  }
};

exports.getBalance = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      ...ledger.getBalance(req.params.account),
    });
  } catch (error) {
    sendLedgerError(res, error);
  }
};

exports.getLedgerState = (req, res) => {
  res.status(200).json({
    success: true,
    ...ledger.getState(),
  });
};

exports.getTransactions = (req, res) => {
  res.status(200).json({
    success: true,
    transactions: ledger.getTransactions(),
  });
};
