const express = require('express');
const router = express.Router();

// In-memory data store
let loans = [
  {
    id: 'LN-001',
    applicant: 'Sara Khan',
    cnic: '35202-1234567-9',
    contact: '03001234567',
    amount: 150000,
    purpose: 'Business',
    tenure: 24,
    status: 'approved',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'LN-002',
    applicant: 'Ahmed Raza',
    cnic: '35202-9876543-1',
    contact: '03219876543',
    amount: 75000,
    purpose: 'Education',
    tenure: 12,
    status: 'pending',
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let loanCounter = 3;

// POST /api/loans/apply
router.post('/loans/apply', (req, res) => {
  const { applicant, amount, purpose, tenure, cnic, contact } = req.body;

  if (!applicant || typeof applicant !== 'string' || applicant.trim() === '') {
    return res.status(400).json({ error: 'applicant name is required' });
  }
  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'amount must be a valid number' });
  }
  if (amount < 5000 || amount > 5000000) {
    return res.status(400).json({ error: 'amount must be between PKR 5,000 and PKR 5,000,000' });
  }
  if (!purpose || !['Business', 'Education', 'Medical', 'Personal'].includes(purpose)) {
    return res.status(400).json({ error: 'purpose must be Business, Education, Medical, or Personal' });
  }
  if (tenure === undefined || tenure === null) {
    return res.status(400).json({ error: 'tenure is required' });
  }
  if (typeof tenure !== 'number' || isNaN(tenure) || tenure < 3 || tenure > 60) {
    return res.status(400).json({ error: 'tenure must be between 3 and 60 months' });
  }

  const loan = {
    id: `LN-${String(loanCounter++).padStart(3, '0')}`,
    applicant: applicant.trim(),
    cnic: cnic || '',
    contact: contact || '',
    amount,
    purpose,
    tenure,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  loans.unshift(loan);
  res.status(201).json(loan);
});

// GET /api/loans
router.get('/loans', (req, res) => {
  res.json(loans);
});

// PATCH /api/loans/:id/status
router.patch('/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
  }

  const loan = loans.find(l => l.id === id);
  if (!loan) {
    return res.status(404).json({ error: `Loan with id "${id}" not found` });
  }

  loan.status = status;
  res.json(loan);
});

// GET /api/emi-calculator
router.get('/emi-calculator', (req, res) => {
  const { principal, annualRate, months } = req.query;

  const P = parseFloat(principal);
  const annualRateNum = parseFloat(annualRate);
  const n = parseInt(months);

  if (isNaN(P) || P <= 0) {
    return res.status(400).json({ error: 'principal must be a positive number' });
  }
  if (isNaN(annualRateNum) || annualRateNum <= 0) {
    return res.status(400).json({ error: 'annualRate must be a positive number' });
  }
  if (isNaN(n) || n < 1) {
    return res.status(400).json({ error: 'months must be a positive integer' });
  }

  const r = annualRateNum / 100 / 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;

  res.json({
    emi: parseFloat(emi.toFixed(2)),
    totalPayable: parseFloat(totalPayable.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    monthlyRate: r
  });
});

module.exports = router;
