import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuLevel, setMobileMenuLevel] = useState('main'); // 'main', 'destinations', 'travels'
  const [activeTravelType, setActiveTravelType] = useState(null);

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

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      // Se stiamo aprendo il menu, resettiamo sempre al livello principale
      setMobileMenuLevel('main');
      setActiveTravelType(null);
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileMenuLevel('main');
    setActiveTravelType(null);
  };

  const goToDestinations = () => {
    setMobileMenuLevel('destinations');
  };

  const goToTravels = () => {
    setMobileMenuLevel('travels');
  };

  const goToTravelType = (typeSlug) => {
    setActiveTravelType(typeSlug);
    setMobileMenuLevel('travel-destinations');
  };

  const goBackToMain = () => {
    setMobileMenuLevel('main');
    setActiveTravelType(null);
  };

  const goBackToTravels = () => {
    setMobileMenuLevel('travels');
    setActiveTravelType(null);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Chiudi il menu mobile se è aperto
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Chiudi menu mobile quando cambia la rotta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileMenuLevel('main');
    setActiveTravelType(null);
  }, [location.pathname]);

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
                  <a 
                    key={dest.country}
                    href={`/destination/${dest.country}`}
                    className="dropdown-item"
                  >
                    {dest.name}
                  </a>
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
                      <a 
                        key={`${activeSubMenu}-${dest.country}`}
                        href={`/travel/${activeSubMenu}/${dest.country}`}
                        className="submenu-item"
                      >
                        {dest.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* CTA Richiedi Info - Desktop */}
        <button className="header-cta" onClick={scrollToContact}>
          Richiedi Info
        </button>

        {/* Burger Menu */}
        <div className={`burger-menu ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav">
          {/* Menu principale */}
          {mobileMenuLevel === 'main' && (
            <>
              <Link to="/" className={`mobile-nav-link ${isActiveSection('home') ? 'active' : ''}`} onClick={closeMobileMenu}>
                Home
              </Link>
              
              <button className="mobile-nav-link" onClick={goToDestinations}>
                Destinazioni
                <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
              </button>
              
              <button className="mobile-nav-link" onClick={goToTravels}>
                Viaggi
                <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
              </button>
              
              {/* CTA nel menu mobile principale */}
              <button className="mobile-cta" onClick={scrollToContact}>
                Richiedi Info
              </button>
            </>
          )}

          {/* Submenu Destinazioni */}
          {mobileMenuLevel === 'destinations' && (
            <>
              <button className="mobile-nav-back" onClick={goBackToMain}>
                <span className="back-arrow"><i className="fa-solid fa-angle-left"></i></span>
                Destinazioni
              </button>
              
              {destinations.map((dest) => (
                <Link 
                  key={dest.country}
                  to={`/destination/${dest.country}`}
                  className="mobile-submenu-item"
                  onClick={closeMobileMenu}
                >
                  {dest.name}
                </Link>
              ))}
              
              {/* CTA nel submenu destinazioni */}
              <button className="mobile-cta" onClick={scrollToContact}>
                Richiedi Info
              </button>
            </>
          )}

          {/* Submenu Viaggi */}
          {mobileMenuLevel === 'travels' && (
            <>
              <button className="mobile-nav-back" onClick={goBackToMain}>
                <span className="back-arrow"><i className="fa-solid fa-angle-left"></i></span>
                Viaggi
              </button>
              
              {travelTypes.map((type) => (
                <button 
                  key={type.slug}
                  className="mobile-nav-link" 
                  onClick={() => goToTravelType(type.slug)}
                >
                  {type.name}
                  <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
                </button>
              ))}
              
              {/* CTA nel submenu viaggi */}
              <button className="mobile-cta" onClick={scrollToContact}>
                Richiedi Info
              </button>
            </>
          )}

          {/* Submenu specifico tipo di viaggio */}
          {mobileMenuLevel === 'travel-destinations' && activeTravelType && (
            <>
              <button className="mobile-nav-back" onClick={goBackToTravels}>
                <span className="back-arrow"><i className="fa-solid fa-angle-left"></i></span>
                {travelTypes.find(t => t.slug === activeTravelType)?.name}
              </button>
              
              {destinations.map((dest) => (
                <Link 
                  key={`${activeTravelType}-${dest.country}`}
                  to={`/travel/${activeTravelType}/${dest.country}`}
                  className="mobile-submenu-item"
                  onClick={closeMobileMenu}
                >
                  {dest.name}
                </Link>
              ))}
              
              {/* CTA nel submenu specifico */}
              <button className="mobile-cta" onClick={scrollToContact}>
                Richiedi Info
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 