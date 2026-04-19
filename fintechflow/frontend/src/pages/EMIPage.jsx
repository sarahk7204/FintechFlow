import { useState } from 'react';
import { formatPKR, API_BASE } from '../utils';
import { useToast } from '../context/ToastContext';
import { useCountUp } from '../hooks/useCountUp';

function StatCard({ label, value, display }) {
  const count = useCountUp(value);
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{formatPKR(count)}</div>
    </div>
  );
}

export default function EMIPage() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const calculate = async () => {
    if (!principal || !annualRate || !months) {
      addToast('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    setAmortization([]);
    try {
      const res = await fetch(
        `${API_BASE}/emi-calculator?principal=${principal}&annualRate=${annualRate}&months=${months}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);

      // Compute amortization table on frontend using server-returned EMI
      const emi = data.emi;
      const r = parseFloat(annualRate) / 100 / 12;
      const n = parseInt(months);
      let remaining = parseFloat(principal);
      const rows = [];
      for (let m = 1; m <= n; m++) {
        const interestComp = remaining * r;
        const principalComp = emi - interestComp;
        remaining = Math.max(0, remaining - principalComp);
        rows.push({
          month: m,
          principal: principalComp,
          interest: interestComp,
          remaining
        });
      }
      setAmortization(rows);
    } catch (err) {
      addToast(err.message || 'Calculation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const principalPct = result
    ? (parseFloat(principal) / result.totalPayable) * 100
    : 0;
  const interestPct = result ? 100 - principalPct : 0;

  return (
    <div className="page fade-in">
      <h1 className="page-title">EMI Calculator</h1>

      <div className="emi-inputs">
        <div className="input-group">
          <label>Principal Amount (PKR)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 100000" />
        </div>
        <div className="input-group">
          <label>Annual Interest Rate (%)</label>
          <input type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)} placeholder="e.g. 12" step="0.1" />
        </div>
        <div className="input-group">
          <label>Tenure (Months)</label>
          <input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="e.g. 12" />
        </div>
        <button className="btn btn-deposit" onClick={calculate} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>
      </div>

      {result && (
        <>
          <div className="stat-cards fade-in">
            <StatCard label="Monthly EMI" value={result.emi} />
            <StatCard label="Total Payable" value={result.totalPayable} />
            <StatCard label="Total Interest" value={result.totalInterest} />
          </div>

          <div className="breakdown-bar-section fade-in">
            <h3>Principal vs Interest</h3>
            <div className="breakdown-bar">
              <div
                className="bar-principal"
                style={{ width: `${principalPct}%` }}
                title={`Principal: ${formatPKR(parseFloat(principal))}`}
              >
                {principalPct > 15 && `${principalPct.toFixed(1)}% Principal`}
              </div>
              <div
                className="bar-interest"
                style={{ width: `${interestPct}%` }}
                title={`Interest: ${formatPKR(result.totalInterest)}`}
              >
                {interestPct > 10 && `${interestPct.toFixed(1)}% Interest`}
              </div>
            </div>
            <div className="bar-legend">
              <span><span className="legend-dot principal" />Principal: {formatPKR(parseFloat(principal))}</span>
              <span><span className="legend-dot interest" />Interest: {formatPKR(result.totalInterest)}</span>
            </div>
          </div>

          <h3 className="amort-title">Amortization Schedule</h3>
          <div className="amort-table-wrapper fade-in">
            <table className="amort-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortization.map((row, i) => (
                  <tr key={row.month} style={{ animationDelay: `${i * 20}ms` }} className="amort-row fade-in">
                    <td>{row.month}</td>
                    <td>{formatPKR(row.principal)}</td>
                    <td>{formatPKR(row.interest)}</td>
                    <td>{formatPKR(row.remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
