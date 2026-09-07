const express = require("express");
const {
  mintTokens,
  transferTokens,
  getBalance,
  getLedgerState,
  getTransactions,
} = require("../controllers/ledgerController");

const router = express.Router();

router.get("/", getLedgerState);
router.post("/mint", mintTokens);
router.post("/transfer", transferTokens);
router.get("/balance/:account", getBalance);
router.get("/state", getLedgerState);
router.get("/transactions", getTransactions);

module.exports = router;
