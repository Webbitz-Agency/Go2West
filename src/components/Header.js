import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    { name: 'Camper Adventures', slug: 'camper-adventures' }
  ];

  useEffect(() => {
    // Funzione semplice per controllare se una hero section è visibile
    const checkHeroVisibility = () => {
      // Cerca elementi con classe 'home-hero' o 'hero-top'
      const heroElement = document.querySelector('.home-hero, .hero-top');
      
      if (!heroElement) {
        setIsHeroVisible(false);
        return;
      }
      
      // Controlla se la hero è visibile nel viewport
      const rect = heroElement.getBoundingClientRect();
      const isVisible = rect.top <= 0 && rect.bottom > 100;
      
      setIsHeroVisible(isVisible);
    };

    // Controlla immediatamente
    checkHeroVisibility();
    
    // Aggiungi listener per scroll e resize
    window.addEventListener('scroll', checkHeroVisibility, { passive: true });
    window.addEventListener('resize', checkHeroVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkHeroVisibility);
      window.removeEventListener('resize', checkHeroVisibility);
    };
  }, [location.pathname]);

  // Funzione per verificare se un menu è attivo
  const isActiveSection = (section) => {
    if (section === 'home') {
      return location.pathname === '/';
    }
    if (section === 'about') {
      return location.pathname === '/about';
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
    
    // Chiudi il menu mobile se è aperto
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
    
    if (element) {
      // Se il form di contatti esiste nella pagina corrente, scrolla fino ad esso
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Se il form non esiste, vai alla home con hash per lo scroll
      if (location.pathname !== '/') {
        // Se non siamo già nella home, vai alla home con hash
        navigate('/#contact');
      } else {
        // Se siamo già nella home ma il form non è visibile, scrolla al form
        const homeContactElement = document.getElementById('contact');
        if (homeContactElement) {
          homeContactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Chiudi menu mobile quando cambia la rotta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileMenuLevel('main');
    setActiveTravelType(null);
  }, [location.pathname]);

  // Gestisci lo scroll al form di contatti quando arriviamo alla home
  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#contact') {
      // Piccolo delay per assicurarsi che la pagina sia completamente renderizzata
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location.pathname, location.hash]);

  return (
    <header className={`header ${isHeroVisible ? 'transparent' : 'solid'}`}>
      <div className="container-header">
        <a href="/" className="logo">
          <img src="/logo-nobg.png" alt="go2west" className="logo-text" />
        </a>
        
        <div className="nav-wrapper">
          <nav className="nav">
            {/* Home */}
            <a href="/" className={`nav-link ${isActiveSection('home') ? 'active' : ''}`}>
              Home
            </a>

            

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
            {/* About */}
            <a href="/about" className={`nav-link ${isActiveSection('about') ? 'active' : ''}`}>
              About us
            </a>
          </nav>
        </div>

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
              <Link to="/about" className={`mobile-nav-link ${isActiveSection('about') ? 'active' : ''}`} onClick={closeMobileMenu}>
                About
              </Link>
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