import { useState, useEffect } from 'react';
import { formatPKR, formatDate, API_BASE } from '../utils';
import { useToast } from '../context/ToastContext';
import { useCountUp } from '../hooks/useCountUp';
import { SkeletonCard } from '../components/Skeleton';

function LoanCard({ loan, onStatusChange }) {
  const [flipped, setFlipped] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/loans/${loan.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onStatusChange(loan.id, status);
      addToast(`Loan ${status} successfully`);
      setFlipped(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={() => loan.status === 'pending' && setFlipped(f => !f)}>
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-front">
          <div className="loan-card-header">
            <span className="loan-id">{loan.id}</span>
            <span className={`badge badge-${loan.status} ${loan.status === 'pending' ? 'pulse' : ''}`}>
              {loan.status}
            </span>
          </div>
          <div className="loan-card-name">{loan.applicant}</div>
          <div className="loan-card-amount">{formatPKR(loan.amount)}</div>
          <div className="loan-card-meta">
            <span>{loan.purpose}</span>
            <span>·</span>
            <span>{loan.tenure} mo</span>
          </div>
          <div className="loan-card-date">{formatDate(loan.appliedAt)}</div>
          {loan.status === 'pending' && (
            <div className="flip-hint">Click to manage →</div>
          )}
        </div>
        {/* Back */}
        <div className="flip-back">
          <div className="flip-back-title">Manage Loan</div>
          <div className="flip-back-id">{loan.id}</div>
          <div className="flip-back-applicant">{loan.applicant}</div>
          <div className="flip-back-amount">{formatPKR(loan.amount)}</div>
          <div className="flip-actions">
            <button
              className="btn btn-deposit"
              onClick={(e) => { e.stopPropagation(); handleStatus('approved'); }}
              disabled={updating}
            >
              ✓ Approve
            </button>
            <button
              className="btn btn-withdraw"
              onClick={(e) => { e.stopPropagation(); handleStatus('rejected'); }}
              disabled={updating}
            >
              ✕ Reject
            </button>
          </div>
          <div className="flip-back-hint">Click card to go back</div>
        </div>
      </div>
    </div>
  );
}

export default function LoanStatusPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('date');
  const { addToast } = useToast();

  const pending = loans.filter(l => l.status === 'pending').length;
  const approved = loans.filter(l => l.status === 'approved').length;
  const rejected = loans.filter(l => l.status === 'rejected').length;

  const cPending = useCountUp(pending);
  const cApproved = useCountUp(approved);
  const cRejected = useCountUp(rejected);

  useEffect(() => {
    fetch(`${API_BASE}/loans`)
      .then(r => r.json())
      .then(data => setLoans(data))
      .catch(() => addToast('Failed to load loans', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...loans].sort((a, b) => {
    if (sort === 'amount-high') return b.amount - a.amount;
    if (sort === 'amount-low') return a.amount - b.amount;
    if (sort === 'status') return a.status.localeCompare(b.status);
    return new Date(b.appliedAt) - new Date(a.appliedAt);
  });

  const handleStatusChange = (id, status) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="page fade-in">
      <h1 className="page-title">Loan Status</h1>

      <div className="status-summary">
        <div className="status-count pending-count">
          <div className="count-num">{cPending}</div>
          <div className="count-label">Pending</div>
        </div>
        <div className="status-count approved-count">
          <div className="count-num">{cApproved}</div>
          <div className="count-label">Approved</div>
        </div>
        <div className="status-count rejected-count">
          <div className="count-num">{cRejected}</div>
          <div className="count-label">Rejected</div>
        </div>
      </div>

      <div className="sort-row">
        <label>Sort by: </label>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date">Latest First</option>
          <option value="amount-high">Amount: High → Low</option>
          <option value="amount-low">Amount: Low → High</option>
          <option value="status">Status</option>
        </select>
      </div>

      {loading ? (
        <div className="loans-grid">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={200} />)}
        </div>
      ) : (
        <div className="loans-grid">
          {sorted.map(loan => (
            <LoanCard key={loan.id} loan={loan} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
      {!loading && loans.length === 0 && (
        <div className="empty-state">No loan applications yet</div>
      )}
    </div>
  );
}
