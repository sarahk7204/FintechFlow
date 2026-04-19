# FintechFlow — Personal Finance & Loan Manager

A full-stack fintech web application built with React.js (frontend) and Node.js/Express (backend).

**Student Name:** Sara Hashim
**Roll No:** 23i-5511

---

## Project Description

FintechFlow is a personal finance management platform that allows users to:
- Manage a digital wallet (deposit & withdraw funds)
- View complete transaction history with filtering and search
- Apply for micro-loans via a multi-step form
- Approve/reject loan applications
- Calculate EMI with full amortization breakdown

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- npm

### Backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

### Environment Variables (Production)

Frontend — create `frontend/.env`:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

---

## API Endpoint Table

| Method | Endpoint | Description | Request Body | Status |
|--------|----------|-------------|--------------|--------|
| GET | `/api/wallet` | Get wallet info | — | 200 |
| POST | `/api/wallet/deposit` | Deposit funds | `{ amount: Number }` | 200 / 400 |
| POST | `/api/wallet/withdraw` | Withdraw funds | `{ amount: Number }` | 200 / 400 |
| GET | `/api/transactions` | Get all transactions (supports `?type=credit\|debit`) | — | 200 |
| POST | `/api/loans/apply` | Submit loan application | `{ applicant, cnic, contact, amount, purpose, tenure }` | 201 / 400 |
| GET | `/api/loans` | Get all loan applications | — | 200 |
| PATCH | `/api/loans/:id/status` | Update loan status | `{ status: 'approved'\|'rejected' }` | 200 / 400 / 404 |
| GET | `/api/emi-calculator` | Calculate EMI | Query: `?principal=&annualRate=&months=` | 200 / 400 |

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Custom hooks
- **Backend:** Node.js, Express.js, express.Router()
- **Styling:** Pure CSS — Grid/Flexbox, CSS custom properties, CSS animations
- **Storage:** In-memory JavaScript arrays/objects (no database)
- **Deployment:** Vercel (frontend) + Render (backend)
