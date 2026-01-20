import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { travelTypes } from '../config/travelTypes';
import TourService from '../services/TourService';
import { requiresCountrySelection, getCountriesByRegion } from '../config/countries';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuLevel, setMobileMenuLevel] = useState('main'); // 'main', 'destinations', 'travels', 'destination-types'
  const [activeTravelType, setActiveTravelType] = useState(null);
  const [activeDestination, setActiveDestination] = useState(null);
  const [submenuTop, setSubmenuTop] = useState(0);
  const [hoveredTravelType, setHoveredTravelType] = useState(null);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const dropdownCloseTimeoutRef = useRef(null);
  const travelsMenuRef = useRef(null);
  const travelsSubmenuRef = useRef(null);
  const destinationsMenuRef = useRef(null);
  const destinationsSubmenuRef = useRef(null);
  const countriesSubmenuRef = useRef(null);
  const hoveredTravelItemRef = useRef(null);
  const hoveredDestinationItemRef = useRef(null);
  const hoveredCountryItemRef = useRef(null);
  const [availableDestinationsByType, setAvailableDestinationsByType] = useState({});
  const [availableTypesByDestination, setAvailableTypesByDestination] = useState({});
  const [availableTypesByCountry, setAvailableTypesByCountry] = useState({});
  const [destinationsSubmenuTop, setDestinationsSubmenuTop] = useState(0);
  const [countriesSubmenuTop, setCountriesSubmenuTop] = useState(0);

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

  // Mappatura slug -> valori possibili nel database (simile a DynamicTours)
  const getDatabaseTypeVariants = (slug) => {
    const mapping = {
      'city-breaks': ['city breaks'],
      'fly-drive': ['fly & drive'],
      'tour-guidato': ['tour guidato'],
      'camper-adventure': ['camper adventure'],
      'glamping': ['glamping'],
      'ranch': ['ranch'],
      'scoperta-in-treno': ['scoperta in treno'],
      'hotel-resort': ['hotel/resort'],
      'combinati': ['combinati'],
      'luxury-travel': ['luxury travel'],
      'extra': ['extra']
    };
    return mapping[slug] || [slug];
  };

  // Mappatura destinazione -> possibili valori nel database
  const getDestinationVariants = (country) => {
    const mapping = {
      'usa': ['USA', 'usa', 'Usa', 'United States', 'Stati Uniti'],
      'canada': ['Canada', 'canada'],
      'messico': ['Messico', 'messico', 'Mexico', 'mexico'],
      'america-centrale': ['America Centrale', 'america-centrale', 'Central America', 'central america'],
      'sud-america': ['Sud America', 'sud-america', 'South America', 'south america'],
      'caraibi': ['Caraibi', 'caraibi', 'Caribbean', 'caribbean'],
      'polinesia-francese': ['Polinesia Francese', 'polinesia-francese', 'French Polynesia', 'french polynesia']
    };
    return mapping[country] || [country];
  };

  // Carica i tour e crea le mappe delle destinazioni disponibili per tipo e viceversa
  useEffect(() => {
    const loadAvailableDestinations = async () => {
      try {
        const allTours = await TourService.getAllTours();
        const destinationsMap = {};
        const typesMap = {};

        // Per ogni tipo di viaggio - crea mappa destinazioni disponibili
        travelTypes.forEach(type => {
          const typeVariants = getDatabaseTypeVariants(type.slug);
          const availableDestinations = new Set();

          // Per ogni destinazione
          destinations.forEach(dest => {
            const destVariants = getDestinationVariants(dest.country);
            
            // Verifica se ci sono tour che corrispondono a questo tipo e destinazione
            const hasTours = allTours.some(tour => {
              const tourType = (tour.type || '').toLowerCase().trim();
              const tourDestination = (tour.destination || '').trim();
              
              // Verifica tipo
              const matchesType = typeVariants.some(variant => {
                const variantLower = variant.toLowerCase().trim();
                return tourType === variantLower || 
                       tourType.includes(variantLower) ||
                       variantLower.includes(tourType);
              });
              
              // Verifica destinazione
              const matchesDestination = destVariants.some(variant => {
                const variantTrimmed = variant.trim();
                return tourDestination === variantTrimmed ||
                       tourDestination.toLowerCase() === variantTrimmed.toLowerCase() ||
                       tourDestination.toLowerCase().includes(variantTrimmed.toLowerCase()) ||
                       variantTrimmed.toLowerCase().includes(tourDestination.toLowerCase());
              });
              
              return matchesType && matchesDestination;
            });

            if (hasTours) {
              availableDestinations.add(dest.country);
            }
          });

          destinationsMap[type.slug] = Array.from(availableDestinations);
        });

        // Per ogni destinazione - crea mappa tipologie disponibili (inverso)
        destinations.forEach(dest => {
          const destVariants = getDestinationVariants(dest.country);
          const availableTypes = new Set();

          // Per ogni tipo di viaggio
          travelTypes.forEach(type => {
            const typeVariants = getDatabaseTypeVariants(type.slug);
            
            // Verifica se ci sono tour che corrispondono a questa destinazione e tipo
            const hasTours = allTours.some(tour => {
              const tourType = (tour.type || '').toLowerCase().trim();
              const tourDestination = (tour.destination || '').trim();
              
              // Verifica tipo
              const matchesType = typeVariants.some(variant => {
                const variantLower = variant.toLowerCase().trim();
                return tourType === variantLower || 
                       tourType.includes(variantLower) ||
                       variantLower.includes(tourType);
              });
              
              // Verifica destinazione
              const matchesDestination = destVariants.some(variant => {
                const variantTrimmed = variant.trim();
                return tourDestination === variantTrimmed ||
                       tourDestination.toLowerCase() === variantTrimmed.toLowerCase() ||
                       tourDestination.toLowerCase().includes(variantTrimmed.toLowerCase()) ||
                       variantTrimmed.toLowerCase().includes(tourDestination.toLowerCase());
              });
              
              return matchesType && matchesDestination;
            });

            if (hasTours) {
              availableTypes.add(type.slug);
            }
          });

          typesMap[dest.country] = Array.from(availableTypes);
        });

        // Per ogni destinazione che richiede paesi - crea mappa tipologie disponibili per paese
        const typesByCountryMap = {};
        destinations.forEach(dest => {
          if (requiresCountrySelection(dest.name)) {
            const countries = getCountriesByRegion(dest.name);
            countries.forEach(country => {
              const availableTypes = new Set();
              
              // Per ogni tipo di viaggio
              travelTypes.forEach(type => {
                const typeVariants = getDatabaseTypeVariants(type.slug);
                
                // Verifica se ci sono tour che corrispondono a questo paese e tipo
                const hasTours = allTours.some(tour => {
                  const tourType = (tour.type || '').toLowerCase().trim();
                  const tourCountries = tour.countries || [];
                  
                  // Verifica tipo
                  const matchesType = typeVariants.some(variant => {
                    const variantLower = variant.toLowerCase().trim();
                    return tourType === variantLower || 
                           tourType.includes(variantLower) ||
                           variantLower.includes(tourType);
                  });
                  
                  // Verifica paese
                  const matchesCountry = tourCountries.some(tourCountry => {
                    return tourCountry === country || 
                           tourCountry.toLowerCase() === country.toLowerCase();
                  });
                  
                  return matchesType && matchesCountry;
                });
                
                if (hasTours) {
                  availableTypes.add(type.slug);
                }
              });
              
              typesByCountryMap[country] = Array.from(availableTypes);
            });
          }
        });

        setAvailableDestinationsByType(destinationsMap);
        setAvailableTypesByDestination(typesMap);
        setAvailableTypesByCountry(typesByCountryMap);
      } catch (error) {
        console.error('Errore nel caricamento delle destinazioni disponibili:', error);
        // In caso di errore, mostra tutte le destinazioni e tipologie
        const allDestinations = destinations.map(d => d.country);
        const allTypes = travelTypes.map(t => t.slug);
        const fallbackDestinationsMap = {};
        const fallbackTypesMap = {};
        const fallbackCountriesMap = {};
        travelTypes.forEach(type => {
          fallbackDestinationsMap[type.slug] = allDestinations;
        });
        destinations.forEach(dest => {
          fallbackTypesMap[dest.country] = allTypes;
          if (requiresCountrySelection(dest.name)) {
            const countries = getCountriesByRegion(dest.name);
            countries.forEach(country => {
              fallbackCountriesMap[country] = allTypes;
            });
          }
        });
        setAvailableDestinationsByType(fallbackDestinationsMap);
        setAvailableTypesByDestination(fallbackTypesMap);
        setAvailableTypesByCountry(fallbackCountriesMap);
      }
    };

    loadAvailableDestinations();
  }, []);

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

  const clearDropdownCloseTimer = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
  };

  const scheduleDropdownClose = () => {
    clearDropdownCloseTimer();
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredTravelType(null);
      setHoveredDestination(null);
      setHoveredCountry(null);
      hoveredTravelItemRef.current = null;
      hoveredDestinationItemRef.current = null;
      hoveredCountryItemRef.current = null;
    }, 150);
  };

  const handleDropdownEnter = (dropdown) => {
    clearDropdownCloseTimer();
    setActiveDropdown(dropdown);
    if (dropdown !== 'travels') {
      setHoveredTravelType(null);
      hoveredTravelItemRef.current = null;
    }
    if (dropdown !== 'destinations') {
      setHoveredDestination(null);
      setHoveredCountry(null);
      hoveredDestinationItemRef.current = null;
      hoveredCountryItemRef.current = null;
    }
  };

  const positionSubmenu = () => {
    if (!hoveredTravelItemRef.current || !travelsMenuRef.current || !travelsSubmenuRef.current) {
      return;
    }

    const menuRect = travelsMenuRef.current.getBoundingClientRect();
    const itemRect = hoveredTravelItemRef.current.getBoundingClientRect();
    const submenuRect = travelsSubmenuRef.current.getBoundingClientRect();

    let calculatedTop = itemRect.top - menuRect.top;
    const maxTop = Math.max(0, menuRect.height - submenuRect.height);

    if (calculatedTop < 0) {
      calculatedTop = 0;
    } else if (calculatedTop > maxTop) {
      calculatedTop = maxTop;
    }

    setSubmenuTop(calculatedTop);
  };

  const positionDestinationsSubmenu = () => {
    if (!hoveredDestinationItemRef.current || !destinationsMenuRef.current || !destinationsSubmenuRef.current) {
      return;
    }

    const menuRect = destinationsMenuRef.current.getBoundingClientRect();
    const itemRect = hoveredDestinationItemRef.current.getBoundingClientRect();
    const submenuRect = destinationsSubmenuRef.current.getBoundingClientRect();

    let calculatedTop = itemRect.top - menuRect.top;
    const maxTop = Math.max(0, menuRect.height - submenuRect.height);

    if (calculatedTop < 0) {
      calculatedTop = 0;
    } else if (calculatedTop > maxTop) {
      calculatedTop = maxTop;
    }

    setDestinationsSubmenuTop(calculatedTop);
  };

  const positionCountriesSubmenu = () => {
    if (!hoveredCountryItemRef.current || !destinationsSubmenuRef.current || !countriesSubmenuRef.current) {
      return;
    }

    const menuRect = destinationsSubmenuRef.current.getBoundingClientRect();
    const itemRect = hoveredCountryItemRef.current.getBoundingClientRect();
    const submenuRect = countriesSubmenuRef.current.getBoundingClientRect();

    let calculatedTop = itemRect.top - menuRect.top;
    const maxTop = Math.max(0, menuRect.height - submenuRect.height);

    if (calculatedTop < 0) {
      calculatedTop = 0;
    } else if (calculatedTop > maxTop) {
      calculatedTop = maxTop;
    }

    setCountriesSubmenuTop(calculatedTop);
  };

  const requestSubmenuPosition = () => {
    if (typeof window === 'undefined') {
      positionSubmenu();
      return;
    }
    window.requestAnimationFrame(positionSubmenu);
  };

  const requestDestinationsSubmenuPosition = () => {
    if (typeof window === 'undefined') {
      positionDestinationsSubmenu();
      return;
    }
    window.requestAnimationFrame(positionDestinationsSubmenu);
  };

  const requestCountriesSubmenuPosition = () => {
    if (typeof window === 'undefined') {
      positionCountriesSubmenu();
      return;
    }
    window.requestAnimationFrame(positionCountriesSubmenu);
  };

  const handleTravelTypeEnter = (typeSlug, event) => {
    clearDropdownCloseTimer();
    setActiveDropdown('travels');
    setHoveredTravelType(typeSlug);
    setHoveredDestination(null);
    hoveredDestinationItemRef.current = null;

    if (event && event.currentTarget) {
      hoveredTravelItemRef.current = event.currentTarget;
      requestSubmenuPosition();
    }
  };

  const handleDestinationEnter = (country, event) => {
    clearDropdownCloseTimer();
    setActiveDropdown('destinations');
    setHoveredDestination(country);
    setHoveredCountry(null);
    setHoveredTravelType(null);
    hoveredTravelItemRef.current = null;
    hoveredCountryItemRef.current = null;

    if (event && event.currentTarget) {
      hoveredDestinationItemRef.current = event.currentTarget;
      requestDestinationsSubmenuPosition();
    }
  };

  const handleCountryEnter = (country, event) => {
    clearDropdownCloseTimer();
    setActiveDropdown('destinations');
    setHoveredCountry(country);
    setHoveredTravelType(null);
    hoveredTravelItemRef.current = null;

    if (event && event.currentTarget) {
      hoveredCountryItemRef.current = event.currentTarget;
      requestCountriesSubmenuPosition();
    }
  };

  useLayoutEffect(() => {
    if (activeDropdown === 'travels' && hoveredTravelType && hoveredTravelItemRef.current) {
      positionSubmenu();
    }
    if (activeDropdown === 'destinations' && hoveredDestination && hoveredDestinationItemRef.current) {
      positionDestinationsSubmenu();
    }
    if (activeDropdown === 'destinations' && hoveredCountry && hoveredCountryItemRef.current) {
      positionCountriesSubmenu();
    }
  }, [activeDropdown, hoveredTravelType, hoveredDestination, hoveredCountry]);

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      // Se stiamo aprendo il menu, resettiamo sempre al livello principale
      setMobileMenuLevel('main');
      setActiveTravelType(null);
      setActiveDestination(null);
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileMenuLevel('main');
    setActiveTravelType(null);
    setActiveDestination(null);
  };

  const goToDestinations = () => {
    setMobileMenuLevel('destinations');
  };

  const goToTravels = () => {
    setMobileMenuLevel('travels');
  };

  const goToTravelType = (typeSlug) => {
    setActiveTravelType(typeSlug);
    setActiveDestination(null);
    setMobileMenuLevel('travel-destinations');
  };

  const goToDestinationTypes = (country) => {
    setActiveDestination(country);
    setActiveTravelType(null);
    setMobileMenuLevel('destination-types');
  };

  const goBackToMain = () => {
    setMobileMenuLevel('main');
    setActiveTravelType(null);
    setActiveDestination(null);
  };

  const goBackToTravels = () => {
    setMobileMenuLevel('travels');
    setActiveTravelType(null);
  };

  const goBackToDestinations = () => {
    setMobileMenuLevel('destinations');
    setActiveDestination(null);
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

  // Cleanup dei timer quando il componente viene smontato
  useEffect(() => {
    return () => {
      clearDropdownCloseTimer();
    };
  }, []);

  // Chiudi menu mobile quando cambia la rotta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileMenuLevel('main');
    setActiveTravelType(null);
    setActiveDestination(null);
      setActiveDropdown(null);
      setHoveredTravelType(null);
      setHoveredDestination(null);
      setHoveredCountry(null);
      hoveredTravelItemRef.current = null;
      hoveredDestinationItemRef.current = null;
      hoveredCountryItemRef.current = null;
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
              onMouseEnter={() => handleDropdownEnter('destinations')}
              onMouseLeave={scheduleDropdownClose}
            >
              <span 
                className={`nav-link ${isActiveSection('destinations') ? 'active' : ''}`}
                onMouseEnter={() => handleDropdownEnter('destinations')}
              >
                Destinazioni
                <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
              </span>
              
              {activeDropdown === 'destinations' && (
                <div 
                  className="dropdown-menu"
                  ref={destinationsMenuRef}
                  onMouseEnter={() => handleDropdownEnter('destinations')}
                  onMouseLeave={scheduleDropdownClose}
                >
                  {destinations.map((dest) => {
                    // Controlla se questa destinazione ha tour disponibili
                    const needsCountries = requiresCountrySelection(dest.name);
                    let hasAvailableTours = false;
                    
                    if (needsCountries) {
                      // Per destinazioni con paesi, controlla se almeno un paese ha tour
                      const countries = getCountriesByRegion(dest.name);
                      hasAvailableTours = countries.some(country => {
                        const availableTypes = availableTypesByCountry[country] || [];
                        return availableTypes.length > 0;
                      });
                    } else {
                      // Per destinazioni senza paesi, controlla se ci sono tipi disponibili
                      const availableTypes = availableTypesByDestination[dest.country] || [];
                      hasAvailableTours = availableTypes.length > 0;
                    }
                    
                    return (
                      <div 
                        key={dest.country}
                        className={hasAvailableTours ? "dropdown-item-with-submenu" : ""}
                        onMouseEnter={hasAvailableTours ? (e) => handleDestinationEnter(dest.country, e) : undefined}
                      >
                        <a 
                          href={`/destination/${dest.country}`}
                          className={`dropdown-item ${hoveredDestination === dest.country ? 'active' : ''}`}
                          onClick={(e) => {
                            // Permetti la navigazione anche se c'è il submenu
                            // Il submenu si aprirà comunque al hover
                          }}
                        >
                          {dest.name}
                          {hasAvailableTours && (
                            <span className="submenu-arrow"><i className="fa-solid fa-angle-right"></i></span>
                          )}
                        </a>
                      </div>
                    );
                  })}
                  
                  {/* Submenu posizionato all'opzione hover */}
                  {hoveredDestination && (() => {
                    const dest = destinations.find(d => d.country === hoveredDestination);
                    const needsCountries = dest && requiresCountrySelection(dest.name);
                    
                    // Se la destinazione richiede paesi, mostra prima i paesi
                    if (needsCountries) {
                      const countries = getCountriesByRegion(dest.name);
                      
                      // Filtra solo i paesi che hanno tour disponibili
                      const countriesWithTours = countries.filter(country => {
                        const availableTypes = availableTypesByCountry[country] || [];
                        return availableTypes.length > 0;
                      });
                      
                      if (countriesWithTours.length === 0) {
                        return null; // Non mostrare submenu se nessun paese ha tour
                      }
                      
                      return (
                        <div 
                          className="submenu"
                          ref={destinationsSubmenuRef}
                          style={{
                            top: `${destinationsSubmenuTop}px`
                          }}
                          onMouseEnter={() => handleDropdownEnter('destinations')}
                          onMouseLeave={scheduleDropdownClose}
                        >
                          {countriesWithTours
                            .filter(country => {
                              // Mostra solo i paesi che hanno tipi disponibili
                              const availableTypes = availableTypesByCountry[country] || [];
                              return availableTypes.length > 0;
                            })
                            .map((country) => (
                              <div
                                key={`${hoveredDestination}-${country}`}
                                className="submenu-item-with-submenu"
                                onMouseEnter={(e) => handleCountryEnter(country, e)}
                              >
                                <div 
                                  className={`submenu-item ${hoveredCountry === country ? 'active' : ''}`}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                  {country}
                                  <span className="submenu-arrow"><i className="fa-solid fa-angle-right"></i></span>
                                </div>
                              </div>
                            ))}
                          
                          {/* Submenu dei tipi di viaggio per paese */}
                          {hoveredCountry && (() => {
                            const availableTypes = availableTypesByCountry[hoveredCountry] || [];
                            const filteredTypes = travelTypes.filter(type => {
                              return availableTypes.includes(type.slug);
                            });
                            
                            if (filteredTypes.length === 0) {
                              return null;
                            }
                            
                            return (
                              <div 
                                className="submenu submenu-level-3"
                                ref={countriesSubmenuRef}
                                style={{
                                  top: `${countriesSubmenuTop}px`
                                }}
                                onMouseEnter={() => handleDropdownEnter('destinations')}
                                onMouseLeave={scheduleDropdownClose}
                              >
                                {filteredTypes.map((type) => (
                                  <a 
                                    key={`${hoveredCountry}-${type.slug}`}
                                    href={`/travel/${type.slug}/${hoveredDestination}?country=${encodeURIComponent(hoveredCountry)}`}
                                    className="submenu-item"
                                  >
                                    {type.name}
                                  </a>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    } else {
                      // Se la destinazione NON richiede paesi, mostra direttamente i tipi di viaggio
                      const availableTypes = availableTypesByDestination[hoveredDestination] || [];
                      const filteredTypes = travelTypes.filter(type => {
                        return availableTypes.includes(type.slug);
                      });
                      
                      if (filteredTypes.length === 0) {
                        return null; // Non mostrare submenu se non ci sono tipi disponibili
                      }
                      
                      return (
                        <div 
                          className="submenu"
                          ref={destinationsSubmenuRef}
                          style={{
                            top: `${destinationsSubmenuTop}px`
                          }}
                          onMouseEnter={() => handleDropdownEnter('destinations')}
                          onMouseLeave={scheduleDropdownClose}
                        >
                          {filteredTypes.map((type) => (
                            <a 
                              key={`${hoveredDestination}-${type.slug}`}
                              href={`/travel/${type.slug}/${hoveredDestination}`}
                              className="submenu-item"
                            >
                              {type.name}
                            </a>
                          ))}
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>

            {/* Viaggi Dropdown */}
            <div 
              className="nav-dropdown"
              style={{ 
                padding: '10px 10px',
            }}
              onMouseEnter={() => handleDropdownEnter('travels')}
              onMouseLeave={scheduleDropdownClose}
            >
              <span 
                className={`nav-link ${isActiveSection('travels') ? 'active' : ''}`}
                onMouseEnter={() => handleDropdownEnter('travels')}
              >
                Viaggi
                <span className="dropdown-arrow"><i class="fa-solid fa-angle-down"></i></span>
              </span>
              
              {activeDropdown === 'travels' && (
                <div 
                  className="dropdown-menu"
                  ref={travelsMenuRef}
                  onMouseEnter={() => handleDropdownEnter('travels')}
                  onMouseLeave={scheduleDropdownClose}
                >
                  {travelTypes.map((type) => (
                    <div 
                      key={type.slug}
                      className="dropdown-item-with-submenu"
                      onMouseEnter={(e) => handleTravelTypeEnter(type.slug, e)}
                    >
                      <span className={`dropdown-item ${hoveredTravelType === type.slug ? 'active' : ''}`}>
                        {type.name}
                        <span className="submenu-arrow"><i class="fa-solid fa-angle-right"></i></span>
                      </span>
                    </div>
                  ))}
                  
                  {/* Submenu posizionato all'opzione hover */}
                  {hoveredTravelType && (() => {
                    const availableDests = availableDestinationsByType[hoveredTravelType] || [];
                    const filteredDestinations = destinations.filter(dest => {
                      return availableDests.includes(dest.country);
                    });
                    
                    if (filteredDestinations.length === 0) {
                      return null; // Non mostrare il submenu se non ci sono destinazioni disponibili
                    }
                    
                    return (
                      <div 
                        className="submenu"
                        ref={travelsSubmenuRef}
                        style={{
                          top: `${submenuTop}px`
                        }}
                        onMouseEnter={() => handleDropdownEnter('travels')}
                        onMouseLeave={scheduleDropdownClose}
                      >
                        {filteredDestinations.map((dest) => (
                          <a 
                            key={`${hoveredTravelType}-${dest.country}`}
                            href={`/travel/${hoveredTravelType}/${dest.country}`}
                            className="submenu-item"
                          >
                            {dest.name}
                          </a>
                        ))}
                      </div>
                    );
                  })()}
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
                <div key={dest.country} className="mobile-destination-item">
                  <a 
                    href={`/destination/${dest.country}`}
                    className="mobile-nav-link mobile-destination-link" 
                    onClick={closeMobileMenu}
                  >
                    {dest.name}
                  </a>
                  <button 
                    className="mobile-submenu-toggle" 
                    onClick={() => goToDestinationTypes(dest.country)}
                    aria-label={`Mostra tipologie per ${dest.name}`}
                  >
                    <span className="mobile-arrow"><i className="fa-solid fa-angle-right"></i></span>
                  </button>
                </div>
              ))}
              
              {/* CTA nel submenu destinazioni */}
              <button className="mobile-cta" onClick={scrollToContact}>
                Richiedi Info
              </button>
            </>
          )}

          {/* Submenu tipologie per destinazione */}
          {mobileMenuLevel === 'destination-types' && activeDestination && (() => {
            const availableTypes = availableTypesByDestination[activeDestination] || [];
            const filteredTypes = travelTypes.filter(type => {
              // Se non abbiamo ancora caricato i dati, mostra tutti i tipi
              // Altrimenti mostra solo quelli disponibili
              return availableTypes.length === 0 || availableTypes.includes(type.slug);
            });
            
            const destinationName = destinations.find(d => d.country === activeDestination)?.name || activeDestination;
            
            return (
              <>
                <button className="mobile-nav-back" onClick={goBackToDestinations}>
                  <span className="back-arrow"><i className="fa-solid fa-angle-left"></i></span>
                  {destinationName}
                </button>
                
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <Link 
                      key={`${activeDestination}-${type.slug}`}
                      to={`/travel/${type.slug}/${activeDestination}`}
                      className="mobile-submenu-item"
                      onClick={closeMobileMenu}
                    >
                      {type.name}
                    </Link>
                  ))
                ) : (
                  <div className="mobile-submenu-item" style={{ color: '#999', pointerEvents: 'none', padding: '15px' }}>
                    Nessuna tipologia disponibile per questa destinazione
                  </div>
                )}
                
                {/* CTA nel submenu specifico */}
                <button className="mobile-cta" onClick={scrollToContact}>
                  Richiedi Info
                </button>
              </>
            );
          })()}

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
          {mobileMenuLevel === 'travel-destinations' && activeTravelType && (() => {
            const availableDests = availableDestinationsByType[activeTravelType] || [];
            const filteredDestinations = destinations.filter(dest => {
              // Se non abbiamo ancora caricato i dati, mostra tutte le destinazioni
              // Altrimenti mostra solo quelle disponibili
              return availableDests.length === 0 || availableDests.includes(dest.country);
            });
            
            return (
              <>
                <button className="mobile-nav-back" onClick={goBackToTravels}>
                  <span className="back-arrow"><i className="fa-solid fa-angle-left"></i></span>
                  {travelTypes.find(t => t.slug === activeTravelType)?.name}
                </button>
                
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <Link 
                      key={`${activeTravelType}-${dest.country}`}
                      to={`/travel/${activeTravelType}/${dest.country}`}
                      className="mobile-submenu-item"
                      onClick={closeMobileMenu}
                    >
                      {dest.name}
                    </Link>
                  ))
                ) : (
                  <div className="mobile-submenu-item" style={{ color: '#999', pointerEvents: 'none', padding: '15px' }}>
                    Nessuna destinazione disponibile per questo tipo di viaggio
                  </div>
                )}
                
                {/* CTA nel submenu specifico */}
                <button className="mobile-cta" onClick={scrollToContact}>
                  Richiedi Info
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </header>
  );
};

export default Header; 