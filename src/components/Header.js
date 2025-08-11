import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.jpg" alt="go2west" style={{width: '150px', height: '75px'}} className="logo-text" />
        </Link>
        
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/destination/north-america" className="nav-link">North America</a>
          <a href="/destination/mexico" className="nav-link">Mexico</a>
          <a href="/destination/kenya" className="nav-link">Kenya</a>
          <a href="/destination/japan" className="nav-link">Japan</a>
          <a href="/destination/australia" className="nav-link">Australia</a>
          <a href="/destination/united-states" className="nav-link">United States</a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 