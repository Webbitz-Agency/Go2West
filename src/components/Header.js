import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-text">go2west</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/destination/north-america" className="nav-link">North America</Link>
          <Link to="/destination/mexico" className="nav-link">Mexico</Link>
          <Link to="/destination/kenya" className="nav-link">Kenya</Link>
          <Link to="/destination/japan" className="nav-link">Japan</Link>
          <Link to="/destination/australia" className="nav-link">Australia</Link>
          <Link to="/destination/united-states" className="nav-link">United States</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 