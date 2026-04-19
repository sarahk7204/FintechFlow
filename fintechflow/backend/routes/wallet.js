const express = require('express');
const router = express.Router();

// In-memory data store
let wallet = {
  balance: 25000,
  currency: 'PKR',
  owner: 'Ali Hassan'
};

let transactions = [
  {
    id: 1,
    type: 'credit',
    amount: 25000,
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: 'Initial deposit'
  }
];

let txIdCounter = 2;

// GET /api/wallet
router.get('/wallet', (req, res) => {
  res.json(wallet);
});

// POST /api/wallet/deposit
router.post('/wallet/deposit', (req, res) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'amount must be a valid number' });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'amount must be greater than 0' });
  }

  wallet.balance += amount;

  const tx = {
    id: txIdCounter++,
    type: 'credit',
    amount,
    timestamp: new Date().toISOString(),
    description: `Deposit of PKR ${amount.toLocaleString()}`
  };
  transactions.unshift(tx);

  res.json({ wallet, transaction: tx });
});

// POST /api/wallet/withdraw
router.post('/wallet/withdraw', (req, res) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'amount must be a valid number' });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'amount must be greater than 0' });
  }
  if (wallet.balance - amount < 0) {
    return res.status(400).json({ error: 'Insufficient funds in wallet' });
  }

  wallet.balance -= amount;

  const tx = {
    id: txIdCounter++,
    type: 'debit',
    amount,
    timestamp: new Date().toISOString(),
    description: `Withdrawal of PKR ${amount.toLocaleString()}`
  };
  transactions.unshift(tx);

  res.json({ wallet, transaction: tx });
});

// GET /api/transactions
router.get('/transactions', (req, res) => {
  const { type } = req.query;
  let result = [...transactions];

  if (type) {
    if (type !== 'credit' && type !== 'debit') {
      return res.status(400).json({ error: 'type must be "credit" or "debit"' });
    }
    result = result.filter(t => t.type === type);
  }

  res.json(result);
});

module.exports = router;
