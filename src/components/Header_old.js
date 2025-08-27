import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';


const Header = () => {
  const location = useLocation();
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    // Attiva comportamento trasparente solo in home
    if (location.pathname !== '/') {
      setIsHeroVisible(false);
      return;
    }

    const hero = document.querySelector('#hero-videos');
    if (!hero) {
      setIsHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsHeroVisible(entry.isIntersecting));
      },
      { threshold: 0.35 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  // Funzione per verificare se il link è attivo
  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <header className={`header ${location.pathname === '/' && isHeroVisible ? 'transparent' : 'solid'}`}>
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo-nobg.png" alt="go2west" style={{width: '128px', height: '64px'}} className="logo-text" />
        </Link>
        
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/destination/usa" className={`nav-link ${isActiveLink('/destination/usa') ? 'active' : ''}`}>USA</Link>
          <Link to="/destination/canada" className={`nav-link ${isActiveLink('/destination/canada') ? 'active' : ''}`}>Canada</Link>
          <Link to="/destination/messico" className={`nav-link ${isActiveLink('/destination/messico') ? 'active' : ''}`}>Messico</Link>
          <Link to="/destination/america-centrale" className={`nav-link ${isActiveLink('/destination/america-centrale') ? 'active' : ''}`}>America Centrale</Link>
          <Link to="/destination/sud-america" className={`nav-link ${isActiveLink('/destination/sud-america') ? 'active' : ''}`}>Sud America</Link>
          <Link to="/destination/caraibi" className={`nav-link ${isActiveLink('/destination/caraibi') ? 'active' : ''}`}>Caraibi</Link>
          <Link to="/destination/polinesia-francese" className={`nav-link ${isActiveLink('/destination/polinesia-francese') ? 'active' : ''}`}>Polinesia Francese</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 