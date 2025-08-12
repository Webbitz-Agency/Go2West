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
          <img src="/logo.jpg" alt="go2west" style={{width: '128px', height: '64px'}} className="logo-text" />
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