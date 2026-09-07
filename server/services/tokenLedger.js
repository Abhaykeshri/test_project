class LedgerError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

class TokenLedger {
  constructor({ name = "Simulation Token", symbol = "SIM" } = {}) {
    this.name = name;
    this.symbol = symbol;
    this.balances = new Map();
    this.transactions = [];
    this.transactionNumber = 0;
  }

  normalizeAccount(account) {
    if (typeof account !== "string" || !/^[a-zA-Z0-9:_-]{1,100}$/.test(account)) {
      throw new LedgerError(
        "Account must be 1-100 characters and contain only letters, numbers, :, _, or -"
      );
    }

    return account;
  }

  normalizeAmount(amount) {
    const parsedAmount =
      typeof amount === "number" ? amount : Number.parseInt(amount, 10);

    if (
      !Number.isSafeInteger(parsedAmount) ||
      parsedAmount <= 0 ||
      String(amount).trim() !== String(parsedAmount)
    ) {
      throw new LedgerError("Amount must be a positive whole number");
    }

    return parsedAmount;
  }

  recordTransaction(transaction) {
    const entry = {
      id: `sim-tx-${++this.transactionNumber}`,
      timestamp: new Date().toISOString(),
      ...transaction,
    };

    this.transactions.push(entry);
    return entry;
  }

  mint(to, amount) {
    const recipient = this.normalizeAccount(to);
    const value = this.normalizeAmount(amount);
    const balance = (this.balances.get(recipient) || 0) + value;

    this.balances.set(recipient, balance);
    const transaction = this.recordTransaction({
      type: "mint",
      to: recipient,
      amount: value,
    });

    return { transaction, balance };
  }

  transfer(from, to, amount) {
    const sender = this.normalizeAccount(from);
    const recipient = this.normalizeAccount(to);
    const value = this.normalizeAmount(amount);
    const senderBalance = this.balances.get(sender) || 0;

    if (senderBalance < value) {
      throw new LedgerError("Insufficient balance", 409);
    }

    this.balances.set(sender, senderBalance - value);
    this.balances.set(recipient, (this.balances.get(recipient) || 0) + value);

    const transaction = this.recordTransaction({
      type: "transfer",
      from: sender,
      to: recipient,
      amount: value,
    });

    return {
      transaction,
      balances: {
        from: senderBalance - value,
        to: this.balances.get(recipient),
      },
    };
  }

  getBalance(account) {
    const normalizedAccount = this.normalizeAccount(account);

    return {
      account: normalizedAccount,
      balance: this.balances.get(normalizedAccount) || 0,
      symbol: this.symbol,
    };
  }

  getState() {
    return {
      name: this.name,
      symbol: this.symbol,
      balances: Object.fromEntries(this.balances),
      transactionCount: this.transactions.length,
    };
  }

  getTransactions() {
    return [...this.transactions];
  }
}

module.exports = new TokenLedger();
