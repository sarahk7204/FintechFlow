const express = require('express');
const cors = require('cors');
const walletRouter = require('./routes/wallet');
const loansRouter = require('./routes/loans');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', walletRouter);
app.use('/api', loansRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FintechFlow API running', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FintechFlow backend running on port ${PORT}`);
});
