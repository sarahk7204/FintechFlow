import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">FintechFlow</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end>Wallet</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/loans/apply">Apply Loan</NavLink>
        <NavLink to="/loans">Loan Status</NavLink>
        <NavLink to="/emi">EMI Calc</NavLink>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {dark ? '☀' : '☾'}
      </button>
    </nav>
  );
}
