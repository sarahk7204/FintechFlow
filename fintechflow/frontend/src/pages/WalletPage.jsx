import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/ToastContext';
import { formatPKR, API_BASE } from '../utils';
import { SkeletonCard } from '../components/Skeleton';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [pulse, setPulse] = useState('');
  const [shake, setShake] = useState('');
  const { addToast } = useToast();

  const displayBalance = useCountUp(wallet?.balance || 0);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_BASE}/wallet`);
      const data = await res.json();
      setWallet(data);
    } catch {
      addToast('Failed to load wallet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmt);
    if (!amount || amount <= 0) {
      setShake('deposit');
      setTimeout(() => setShake(''), 600);
      addToast('Enter a valid deposit amount', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWallet(data.wallet);
      setPulse('positive');
      setTimeout(() => setPulse(''), 800);
      addToast(`Deposited ${formatPKR(amount)} successfully`);
      setDepositAmt('');
    } catch (err) {
      setShake('deposit');
      setTimeout(() => setShake(''), 600);
      addToast(err.message || 'Deposit failed', 'error');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmt);
    if (!amount || amount <= 0) {
      setShake('withdraw');
      setTimeout(() => setShake(''), 600);
      addToast('Enter a valid withdrawal amount', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWallet(data.wallet);
      setPulse('negative');
      setTimeout(() => setPulse(''), 800);
      addToast(`Withdrew ${formatPKR(amount)} successfully`);
      setWithdrawAmt('');
    } catch (err) {
      setShake('withdraw');
      setTimeout(() => setShake(''), 600);
      addToast(err.message || 'Withdrawal failed', 'error');
    }
  };

  return (
    <div className="page fade-in">
      <h1 className="page-title">Wallet Dashboard</h1>

      {loading ? (
        <SkeletonCard height={180} />
      ) : (
        <div className={`balance-card ${pulse}`}>
          <div className="balance-label">Available Balance</div>
          <div className="balance-amount">{formatPKR(displayBalance)}</div>
          <div className="balance-meta">
            <span>{wallet?.currency}</span>
            <span>·</span>
            <span>{wallet?.owner}</span>
          </div>
        </div>
      )}

      <div className="forms-row">
        <form
          className={`wallet-form ${shake === 'deposit' ? 'shake' : ''}`}
          onSubmit={handleDeposit}
        >
          <h3 className="form-title deposit-title">⬆ Deposit</h3>
          <div className="input-group">
            <label>Amount (PKR)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={depositAmt}
              onChange={e => setDepositAmt(e.target.value)}
              min="1"
              step="any"
            />
          </div>
          <button className="btn btn-deposit" type="submit">Deposit Funds</button>
        </form>

        <form
          className={`wallet-form ${shake === 'withdraw' ? 'shake' : ''}`}
          onSubmit={handleWithdraw}
        >
          <h3 className="form-title withdraw-title">⬇ Withdraw</h3>
          <div className="input-group">
            <label>Amount (PKR)</label>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={withdrawAmt}
              onChange={e => setWithdrawAmt(e.target.value)}
              min="1"
              step="any"
            />
          </div>
          <button className="btn btn-withdraw" type="submit">Withdraw Funds</button>
        </form>
      </div>
    </div>
  );
}
