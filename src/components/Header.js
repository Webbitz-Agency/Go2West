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

  return (
    <header className={`header ${location.pathname === '/' && isHeroVisible ? 'transparent' : 'solid'}`}>
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo-nobg.png" alt="go2west" style={{width: '128px', height: '64px'}} className="logo-text" />
        </Link>
        
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/destination/usa" className="nav-link">USA</a>
          <a href="/destination/canada" className="nav-link">Canada</a>
          <a href="/destination/messico" className="nav-link">Messico</a>
          <a href="/destination/america-centrale" className="nav-link">America Centrale</a>
          <a href="/destination/sud-america" className="nav-link">Sud America</a>
          <a href="/destination/caraibi" className="nav-link">Caraibi</a>
          <a href="/destination/polinesia-francese" className="nav-link">Polinesia Francese</a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 