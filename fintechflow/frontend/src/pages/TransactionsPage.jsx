import { useState, useEffect, useMemo } from 'react';
import { formatPKR, formatDate, API_BASE } from '../utils';
import { useToast } from '../context/ToastContext';
import { SkeletonRow } from '../components/Skeleton';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    fetch(`${API_BASE}/transactions`)
      .then(r => r.json())
      .then(data => setTransactions(data))
      .catch(() => addToast('Failed to load transactions', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchType = filter === 'all' || tx.type === filter;
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transactions, search, filter]);

  const totalCredits = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const net = totalCredits - totalDebits;

  return (
    <div className="page fade-in">
      <h1 className="page-title">Transaction History</h1>

      <div className="summary-bar">
        <div className="summary-item credit">
          <span className="summary-label">Total Credits</span>
          <span className="summary-value">{formatPKR(totalCredits)}</span>
        </div>
        <div className="summary-item debit">
          <span className="summary-label">Total Debits</span>
          <span className="summary-value">{formatPKR(totalDebits)}</span>
        </div>
        <div className={`summary-item ${net >= 0 ? 'credit' : 'debit'}`}>
          <span className="summary-label">Net Balance</span>
          <span className="summary-value">{formatPKR(net)}</span>
        </div>
      </div>

      <div className="filters-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['all', 'credit', 'debit'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'credit' ? 'Credits' : 'Debits'}
            </button>
          ))}
        </div>
      </div>

      <div className="tx-list">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : filtered.length === 0
            ? <div className="empty-state">No transactions found</div>
            : filtered.map((tx, i) => (
              <div
                key={tx.id}
                className="tx-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'credit' ? '↑' : '↓'}
                </div>
                <div className="tx-info">
                  <div className="tx-desc">{tx.description}</div>
                  <div className="tx-time">{formatDate(tx.timestamp)}</div>
                </div>
                <div className="tx-right">
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatPKR(tx.amount)}
                  </div>
                  <span className={`badge badge-${tx.type}`}>{tx.type}</span>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
