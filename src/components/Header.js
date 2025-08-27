import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Dati delle destinazioni
  const destinations = [
    { name: 'USA', country: 'usa' },
    { name: 'Canada', country: 'canada' },
    { name: 'Messico', country: 'messico' },
    { name: 'America Centrale', country: 'america-centrale' },
    { name: 'Sud America', country: 'sud-america' },
    { name: 'Caraibi', country: 'caraibi' },
    { name: 'Polinesia Francese', country: 'polinesia-francese' }
  ];

  // Tipologie di viaggio
  const travelTypes = [
    { name: 'City Breaks', slug: 'city-breaks' },
    { name: 'Fly & Drive', slug: 'fly-drive' },
    { name: 'Ride in Harley', slug: 'ride-harley' },
    { name: 'Tour Guidati', slug: 'tour-guidati' },
    { name: 'Luxury Travel', slug: 'luxury-travel' },
    { name: 'Safari & Wildlife', slug: 'safari-wildlife' }
  ];

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

  // Funzione per verificare se un menu è attivo
  const isActiveSection = (section) => {
    if (section === 'home') {
      return location.pathname === '/';
    }
    if (section === 'destinations') {
      return location.pathname.startsWith('/destination/');
    }
    if (section === 'travels') {
      return location.pathname.startsWith('/travel/');
    }
    return false;
  };

  // Gestione hover dropdown
  const handleMouseEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  return (
    <header className={`header ${location.pathname === '/' && isHeroVisible ? 'transparent' : 'solid'}`}>
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo-nobg.png" alt="go2west" style={{width: '128px', height: '64px'}} className="logo-text" />
        </Link>
        
        <nav className="nav">
          {/* Home */}
          <Link to="/" className={`nav-link ${isActiveSection('home') ? 'active' : ''}`}>
            Home
          </Link>

          {/* Destinazioni Dropdown */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('destinations')}
            onMouseLeave={handleMouseLeave}
          >
            <span className={`nav-link ${isActiveSection('destinations') ? 'active' : ''}`}>
              Destinazioni
              <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
            </span>
            
            {activeDropdown === 'destinations' && (
              <div className="dropdown-menu">
                {destinations.map((dest) => (
                  <Link 
                    key={dest.country}
                    to={`/destination/${dest.country}`}
                    className="dropdown-item"
                  >
                    {dest.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Viaggi Dropdown */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('travels')}
            onMouseLeave={handleMouseLeave}
          >
            <span className={`nav-link ${isActiveSection('travels') ? 'active' : ''}`}>
              Viaggi
              <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
            </span>
            
            {activeDropdown === 'travels' && (
              <div className="dropdown-menu">
                {travelTypes.map((type) => (
                  <div 
                    key={type.slug}
                    className="dropdown-item-with-submenu"
                    onClick={() => handleSubMenuClick(type.slug)}
                  >
                    <span className={`dropdown-item ${activeSubMenu === type.slug ? 'active' : ''}`}>
                      {type.name}
                      <span className="submenu-arrow"><i class="fa-solid fa-angle-right"></i></span>
                    </span>
                  </div>
                ))}
                
                {/* Submenu posizionato sempre alla stessa altezza */}
                {activeSubMenu && (
                  <div className="submenu">
                    {destinations.map((dest) => (
                      <Link 
                        key={`${activeSubMenu}-${dest.country}`}
                        to={`/travel/${activeSubMenu}/${dest.country}`}
                        className="submenu-item"
                      >
                        {dest.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 