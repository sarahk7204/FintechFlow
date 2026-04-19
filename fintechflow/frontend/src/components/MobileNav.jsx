import { NavLink } from 'react-router-dom';

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" end>
        <span className="nav-icon">◈</span>
        Wallet
      </NavLink>
      <NavLink to="/transactions">
        <span className="nav-icon">↕</span>
        Txns
      </NavLink>
      <NavLink to="/loans/apply">
        <span className="nav-icon">+</span>
        Apply
      </NavLink>
      <NavLink to="/loans">
        <span className="nav-icon">⊞</span>
        Loans
      </NavLink>
      <NavLink to="/emi">
        <span className="nav-icon">%</span>
        EMI
      </NavLink>
    </nav>
  );
}
