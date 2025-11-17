import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { travelTypes } from '../config/travelTypes';
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
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [hoveredItemRef, setHoveredItemRef] = useState(null);
  const [submenuTop, setSubmenuTop] = useState(0);

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

  // Tipologie di viaggio importate dalla configurazione condivisa

  useEffect(() => {
    // Funzione semplice per controllare se una hero section è visibile
    const checkHeroVisibility = () => {
      // Cerca elementi con classe 'home-hero' o 'hero-top'
      const heroElement = document.querySelector('.home-hero, .promotions-hero, .hero-top, .about-hero');
      
      if (!heroElement) {
        //console.log('Hero element not found');
        setIsHeroVisible(false);
        return;
      }
      
      //console.log('Hero element found:', heroElement.className);
      // Controlla se la hero è visibile nel viewport
      const rect = heroElement.getBoundingClientRect();
      // La hero è considerata "attiva" quando:
      // 1. È completamente visibile (top >= 0) OPPURE
      // 2. È parzialmente scrollata (top <= 0) ma ancora visibile (bottom > 100)
      const isVisible = (rect.top >= 0) || (rect.top <= 0 && rect.bottom > 100);
      
      //console.log('Hero visibility:', isVisible, 'rect:', rect);
      setIsHeroVisible(isVisible);
    };

    // Controlla immediatamente
    checkHeroVisibility();
    
    // Controlla quando il DOM è completamente caricato
    const handleDOMContentLoaded = () => {
      checkHeroVisibility();
    };
    
    // Controlla anche quando la pagina è completamente caricata (immagini, CSS, etc.)
    const handleLoad = () => {
      checkHeroVisibility();
    };
    
    // Aggiungi listener per scroll, resize, DOMContentLoaded e load
    window.addEventListener('scroll', checkHeroVisibility, { passive: true });
    window.addEventListener('resize', checkHeroVisibility);
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('scroll', checkHeroVisibility);
      window.removeEventListener('resize', checkHeroVisibility);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
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

  // Gestione hover dropdown con delay per evitare chiusure accidentali
  const handleMouseEnter = (dropdown) => {
    // Cancella eventuali timeout in corso
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    // Aggiungi un piccolo delay prima di chiudere il menu
    // Questo permette all'utente di spostare il cursore dal trigger al menu
    // Non chiudere se il submenu è ancora aperto (per il dropdown viaggi)
    const timeout = setTimeout(() => {
      // Se c'è un submenu attivo, non chiudere il dropdown principale
      if (activeSubMenu && activeDropdown === 'travels') {
        return; // Mantieni aperto se il submenu è attivo
      }
      setActiveDropdown(null);
      setActiveSubMenu(null);
    }, 150); // 150ms di delay
    setDropdownTimeout(timeout);
  };

  const handleSubMenuEnter = (subMenu, event) => {
    // Cancella eventuali timeout in corso
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveSubMenu(subMenu);
    // Calcola la posizione top del submenu basandosi sull'elemento hover
    if (event && event.currentTarget) {
      const itemElement = event.currentTarget;
      const menuElement = itemElement.closest('.dropdown-menu');
      if (menuElement) {
        const itemRect = itemElement.getBoundingClientRect();
        const menuRect = menuElement.getBoundingClientRect();
        setSubmenuTop(itemRect.top - menuRect.top);
        setHoveredItemRef(itemElement);
      }
    }
  };

  const handleSubMenuLeave = () => {
    // Aggiungi un piccolo delay prima di chiudere il submenu
    const timeout = setTimeout(() => {
      setActiveSubMenu(null);
      setHoveredItemRef(null);
      setSubmenuTop(0);
    }, 150); // 150ms di delay
    setDropdownTimeout(timeout);
  };

  // Funzione per chiudere completamente il dropdown viaggi (incluso submenu)
  const handleTravelsDropdownClose = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubMenu(null);
    }, 150);
    setDropdownTimeout(timeout);
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

  // Cleanup del timeout quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

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

  // Nascondi l'header nella pagina admin e tour-editor
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/tour-editor')) {
    return null;
  }

  return (
    <header className={`header ${isHeroVisible ? 'transparent' : 'solid'}`}>
      <div className="container-header">
        <a href="/" className="logo">
          <img src="/Logo.svg" alt="go2west" className="logo-text" />
        </a>
        
        <div className="nav-wrapper">
          <nav className="nav">
            {/* Home */}
            <a href="/" className={`nav-link ${isActiveSection('home') ? 'active' : ''}`}>
              Home
            </a>

            {/* Promozioni */}
            <a href="/promozioni" id="promozioni-link" className={`nav-link ${location.pathname === '/promozioni' ? 'active' : ''}`}>
              Specials
            </a>

            

            {/* Destinazioni Dropdown */}
            <div 
              className="nav-dropdown"
              style={{ 
                padding: '10px 10px',
            }}
              onMouseEnter={() => {
                // Mantieni il menu aperto se è già aperto quando il cursore entra nello spazio del nav-dropdown
                if (activeDropdown === 'destinations') {
                  handleMouseEnter('destinations');
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <span 
                className={`nav-link ${isActiveSection('destinations') ? 'active' : ''}`}
                onMouseEnter={() => handleMouseEnter('destinations')}
              >
                Destinazioni
                <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
              </span>
              
              {activeDropdown === 'destinations' && (
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleMouseEnter('destinations')}
                  onMouseLeave={handleMouseLeave}
                >
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
              style={{ 
                padding: '10px 10px',
            }}
              onMouseEnter={() => {
                // Mantieni il menu aperto se è già aperto quando il cursore entra nello spazio del nav-dropdown
                if (activeDropdown === 'travels') {
                  handleMouseEnter('travels');
                  // Se c'è un submenu attivo, mantienilo aperto
                  if (activeSubMenu) {
                    handleSubMenuEnter(activeSubMenu);
                  }
                }
              }}
              onMouseLeave={() => {
                // Se non c'è un submenu attivo, chiudi normalmente
                // Se c'è un submenu attivo, non chiudere (il cursore potrebbe essere sul submenu)
                if (!activeSubMenu) {
                  handleMouseLeave();
                }
              }}
            >
              <span 
                className={`nav-link ${isActiveSection('travels') ? 'active' : ''}`}
                onMouseEnter={() => handleMouseEnter('travels')}
              >
                Viaggi
                <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
              </span>
              
              {activeDropdown === 'travels' && (
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => {
                    // Semplice: mantieni tutto aperto
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                    handleMouseEnter('travels');
                  }}
                  onMouseLeave={(e) => {
                    // Non chiudere se c'è un submenu attivo e il cursore sta andando verso il submenu
                    // Controlla se il cursore sta andando verso il submenu (a destra)
                    if (activeSubMenu) {
                      // Non chiudere, il submenu gestirà la chiusura
                      return;
                    }
                    handleMouseLeave();
                  }}
                >
                  {travelTypes.map((type) => (
                    <div 
                      key={type.slug}
                      className="dropdown-item-with-submenu"
                      onMouseEnter={(e) => handleSubMenuEnter(type.slug, e)}
                      onMouseLeave={handleSubMenuLeave}
                    >
                      <span className={`dropdown-item ${activeSubMenu === type.slug ? 'active' : ''}`}>
                        {type.name}
                        <span className="submenu-arrow"><i class="fa-solid fa-angle-right"></i></span>
                      </span>
                    </div>
                  ))}
                  
                  {/* Submenu posizionato all'opzione hover */}
                  {activeSubMenu && (
                    <div 
                      className="submenu"
                      style={{
                        top: `${submenuTop}px`
                      }}
                      onMouseEnter={() => {
                        // Semplice: mantieni tutto aperto quando il cursore è sul submenu
                        if (dropdownTimeout) {
                          clearTimeout(dropdownTimeout);
                          setDropdownTimeout(null);
                        }
                        // Mantieni il dropdown principale aperto
                        handleMouseEnter('travels');
                        // Mantieni il submenu aperto
                        setActiveSubMenu(activeSubMenu);
                      }}
                      onMouseLeave={handleSubMenuLeave}
                    >
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
              <span className="about-text-full">About us</span>
              <span className="about-text-short">About</span>
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
              <a href="/" className={`mobile-nav-link ${isActiveSection('home') ? 'active' : ''}`} onClick={closeMobileMenu}>
                Home
              </a>
              
              <a href="/promozioni" className={`mobile-nav-link ${location.pathname === '/promozioni' ? 'active' : ''}`} onClick={closeMobileMenu}>
                Specials
              </a>
                         
              
              <button className="mobile-nav-link" onClick={goToDestinations}>
                Destinazioni
                <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
              </button>
              
              <button className="mobile-nav-link" onClick={goToTravels}>
                Viaggi
                <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
              </button>
              <a href="/about" className={`mobile-nav-link ${isActiveSection('about') ? 'active' : ''}`} onClick={closeMobileMenu}>
                About
              </a>
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