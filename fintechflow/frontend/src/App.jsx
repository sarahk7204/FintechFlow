import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import WalletPage from './pages/WalletPage';
import TransactionsPage from './pages/TransactionsPage';
import LoanApplyPage from './pages/LoanApplyPage';
import LoanStatusPage from './pages/LoanStatusPage';
import EMIPage from './pages/EMIPage';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<WalletPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/loans/apply" element={<LoanApplyPage />} />
              <Route path="/loans" element={<LoanStatusPage />} />
              <Route path="/emi" element={<EMIPage />} />
            </Routes>
          </main>
          <MobileNav />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
