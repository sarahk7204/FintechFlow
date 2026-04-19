import { useState } from 'react';
import { formatPKR, API_BASE } from '../utils';
import { useToast } from '../context/ToastContext';

const STEPS = ['Personal Info', 'Loan Details', 'Review & Submit'];

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

export default function LoanApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    applicant: '',
    cnic: '',
    contact: '',
    amount: '',
    purpose: 'Business',
    tenure: ''
  });

  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validateStep0 = () => {
    const errs = {};
    if (!form.applicant.trim()) errs.applicant = 'Full name is required';
    if (!CNIC_REGEX.test(form.cnic)) errs.cnic = 'CNIC must be in format XXXXX-XXXXXXX-X';
    if (!form.contact.trim() || form.contact.length < 10) errs.contact = 'Valid contact number required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep1 = () => {
    const errs = {};
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt < 5000 || amt > 5000000) {
      errs.amount = 'Amount must be between PKR 5,000 and PKR 5,000,000';
    }
    const ten = parseInt(form.tenure);
    if (!form.tenure || isNaN(ten) || ten < 3 || ten > 60) {
      errs.tenure = 'Tenure must be between 3 and 60 months';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const prev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/loans/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant: form.applicant,
          cnic: form.cnic,
          contact: form.contact,
          amount: parseFloat(form.amount),
          purpose: form.purpose,
          tenure: parseInt(form.tenure)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(data);
      addToast('Loan application submitted!');
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page fade-in">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2>Application Submitted!</h2>
          <p>Your loan application has been received.</p>
          <div className="loan-id-badge">Loan ID: {submitted.id}</div>
          <div className="loan-summary-table">
            <div><span>Applicant</span><strong>{submitted.applicant}</strong></div>
            <div><span>Amount</span><strong>{formatPKR(submitted.amount)}</strong></div>
            <div><span>Purpose</span><strong>{submitted.purpose}</strong></div>
            <div><span>Tenure</span><strong>{submitted.tenure} months</strong></div>
            <div><span>Status</span><span className="badge badge-pending">Pending</span></div>
          </div>
          <button className="btn btn-deposit" onClick={() => {
            setSubmitted(null);
            setStep(0);
            setForm({ applicant: '', cnic: '', contact: '', amount: '', purpose: 'Business', tenure: '' });
          }}>Apply Another Loan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <h1 className="page-title">Loan Application</h1>

      {/* Progress bar */}
      <div className="progress-container">
        {STEPS.map((label, i) => (
          <div key={i} className={`progress-step ${i <= step ? 'active' : ''}`}>
            <div className="progress-circle">{i < step ? '✓' : i + 1}</div>
            <div className="progress-label">{label}</div>
          </div>
        ))}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="step-form">
        {step === 0 && (
          <div className="step-content fade-in">
            <h3>Personal Information</h3>
            <div className="input-group">
              <label>Full Name</label>
              <input value={form.applicant} onChange={e => update('applicant', e.target.value)} placeholder="e.g. Ali Hassan" />
              {errors.applicant && <span className="field-error fade-in">{errors.applicant}</span>}
            </div>
            <div className="input-group">
              <label>CNIC</label>
              <input value={form.cnic} onChange={e => update('cnic', e.target.value)} placeholder="XXXXX-XXXXXXX-X" />
              {errors.cnic && <span className="field-error fade-in">{errors.cnic}</span>}
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="03001234567" />
              {errors.contact && <span className="field-error fade-in">{errors.contact}</span>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="step-content fade-in">
            <h3>Loan Details</h3>
            <div className="input-group">
              <label>Loan Amount (PKR)</label>
              <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="5000 – 5,000,000" />
              {errors.amount && <span className="field-error fade-in">{errors.amount}</span>}
            </div>
            <div className="input-group">
              <label>Purpose</label>
              <select value={form.purpose} onChange={e => update('purpose', e.target.value)}>
                {['Business', 'Education', 'Medical', 'Personal'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Tenure (Months)</label>
              <input type="number" value={form.tenure} onChange={e => update('tenure', e.target.value)} placeholder="3 – 60" min="3" max="60" />
              {errors.tenure && <span className="field-error fade-in">{errors.tenure}</span>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content fade-in">
            <h3>Review & Submit</h3>
            <div className="review-table">
              <div><span>Full Name</span><strong>{form.applicant}</strong></div>
              <div><span>CNIC</span><strong>{form.cnic}</strong></div>
              <div><span>Contact</span><strong>{form.contact}</strong></div>
              <div><span>Amount</span><strong>{formatPKR(parseFloat(form.amount))}</strong></div>
              <div><span>Purpose</span><strong>{form.purpose}</strong></div>
              <div><span>Tenure</span><strong>{form.tenure} months</strong></div>
            </div>
            <p className="review-note">Please verify all information before submitting.</p>
          </div>
        )}

        <div className="step-actions">
          {step > 0 && <button className="btn btn-outline" onClick={prev}>← Back</button>}
          {step < 2
            ? <button className="btn btn-deposit" onClick={next}>Next →</button>
            : <button className="btn btn-deposit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
