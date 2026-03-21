import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Clock, FileText, User, LogOut } from 'lucide-react';

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(216,190,229,0.28);
    box-shadow: 0 2px 24px rgba(167,171,222,0.1);
  }

  .navbar-container {
    width: 100%;
    padding: 0 40px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbar-logo a {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #4a3f6b;
    text-decoration: none;
    letter-spacing: 0.02em;
    margin-right: 36px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .logo-gem {
    width: 10px; height: 10px;
    background: linear-gradient(135deg, #d8bee5, #a7abde);
    border-radius: 2px;
    transform: rotate(45deg);
    flex-shrink: 0;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: #000000;
    text-decoration: none;
    transition: all 0.2s;
  }

  .nav-link:hover { background: rgba(216,190,229,0.2); color: #4a3f6b; }

  .nav-link.active {
    background: linear-gradient(135deg, rgba(216,190,229,0.38), rgba(200,206,238,0.28));
    color: #4a3f6b;
    font-weight: 500;
  }

  .logout-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 10px;
    border: 1.5px solid rgba(252,220,225,0.65);
    background: rgba(252,220,225,0.22);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #c48a9e;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: auto;
    margin-right: 0;
  }

  .logout-button:hover { background: rgba(252,220,225,0.48); color: #8b5f72; }

  @media (max-width: 700px) {
    .nav-link span, .logout-button span { display: none; }
    .navbar-container { padding: 0 14px; }
    .navbar-logo a { margin-right: 10px; font-size: 18px; }
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/home/capsule', label: 'Capsules', icon: LayoutGrid },
    { path: '/home/timeline', label: 'Timeline', icon: Clock },
    { path: '/home/summary', label: 'AI Summary', icon: FileText },
    { path: '/home/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <style>{navStyles}</style>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/home"><span className="logo-gem" />MemoryVault</Link>
          </div>
          <div className="navbar-links">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} className={`nav-link ${location.pathname === path ? 'active' : ''}`}>
                <Icon size={16} /><span>{label}</span>
              </Link>
            ))}
          </div>
          <button className="logout-button" onClick={() => navigate('/login')}>
            <LogOut size={16} /><span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;