import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TourService from '../services/TourService';
import './Promotions.css';

const Promotions = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Array delle immagini per il carosello hero
  const heroImages = [
    '/images/ny1.jpg',
    '/images/ny2.jpg', 
    '/images/ny3.jpg',
    '/images/ny4.jpg',
    '/images/ny5.jpg',
    '/images/ny6.jpg',
    '/images/ny7.jpg',
    '/images/city.jpg',
    '/images/usa.jpg',
    '/images/usa1.jpg',
    '/images/usa2.jpg',
    '/images/usa3.jpg'
  ];

  // Carica i tour dal backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await TourService.getAllTours();
        setTours(data);
        setFilteredTours(data);
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Scroll automatico in cima quando si apre la pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gestione freccia "torna in cima"
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll per il carosello hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Filtri disponibili
  const filters = [
    { value: 'all', label: 'Tutte le promozioni' },
    { value: 'city-breaks', label: 'City Breaks' },
    { value: 'fly-drive', label: 'Fly & Drive' },
    { value: 'safari', label: 'Safari' },
    { value: 'tour', label: 'Tour Guidati' }
  ];

  // Gestione filtri
  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    
    if (filterValue === 'all') {
      setFilteredTours(tours);
    } else {
      const filtered = tours.filter(tour => 
        tour.type?.toLowerCase().includes(filterValue.toLowerCase()) ||
        tour.title?.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredTours(filtered);
    }
  };

  if (loading) {
    return (
      <div className="promotions-page">
        <div className="promotions-loading">
          <div className="loading-spinner"></div>
          <p>Caricamento promozioni...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promotions-page">
        <div className="promotions-error">
          <h3>Errore nel caricamento</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promotions-page">
      {/* Hero Section */}
      <section className="promotions-hero">
        {/* Carosello immagini */}
        <div className="promotions-hero-images">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Destinazione promozione ${index + 1}`}
              className={`hero-image ${index === currentHeroImage ? 'active' : ''}`}
            />
          ))}
        </div>
        
        {/* Overlay */}
        <div className="promotions-hero-overlay"></div>
        
        {/* Contenuto */}
        <div className="promotions-hero-content">
          <h1>Viaggi in Promozione</h1>
          <p>Scopri le nostre offerte speciali e last minute per vivere esperienze indimenticabili</p>
        </div>
      </section>

      {/* Filtri */}
      <section className="promotions-filters">
        <div className="filters-container">
          <h2>Filtra per categoria</h2>
          <div className="filters-grid">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={`filter-btn ${selectedFilter === filter.value ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Griglia delle promozioni */}
      <section className="promotions-grid-section">
        <div className="promotions-grid-container">
          <div className="promotions-grid">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="promotion-card">
                <div className="promotion-card-image">
                  <img 
                    src="/images/copertina.jpeg" 
                    alt={tour.title}
                    loading="lazy"
                  />
                  <div className="promotion-badge">
                    <span>PROMO</span>
                  </div>
                  <div className="promotion-price">
                    <span className="price-label">da</span>
                    <span className="price-amount">€{tour.price}</span>
                  </div>
                </div>
                
                <div className="promotion-card-content">
                  <div className="promotion-meta">
                    <span className="promotion-type">{tour.type || 'Tour'}</span>
                    <span className="promotion-duration">
                      {tour.duration ? `${tour.duration} giorni` : 'Durata variabile'}
                    </span>
                  </div>
                  
                  <h3 className="promotion-title">{tour.title}</h3>
                  
                  <p className="promotion-description">
                    {tour.description?.length > 150 
                      ? `${tour.description.substring(0, 150)}...` 
                      : tour.description
                    }
                  </p>
                  
                  <div className="promotion-features">
                    <div className="feature">
                      <i className="fa-solid fa-plane"></i>
                      <span>Volo incluso</span>
                    </div>
                    <div className="feature">
                      <i className="fa-solid fa-hotel"></i>
                      <span>Hotel 4*</span>
                    </div>
                    <div className="feature">
                      <i className="fa-solid fa-utensils"></i>
                      <span>Colazione</span>
                    </div>
                  </div>
                  
                  <Link to={`/tour/${tour.slug}`} className="promotion-btn">
                    Scopri Offerta
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTours.length === 0 && (
            <div className="no-promotions">
              <h3>Nessuna promozione trovata</h3>
              <p>Prova a cambiare filtro o torna più tardi per nuove offerte.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="promotions-cta">
        <div className="cta-container">
          <h2>Non trovi quello che cerchi?</h2>
          <p>Contattaci per una consulenza personalizzata e scopri le migliori offerte per te</p>
          <div className="cta-buttons">
            <Link to="/#contact" className="cta-btn primary">
              Richiedi Consulenza
            </Link>
            <Link to="/" className="cta-btn secondary">
              Torna alla Home
            </Link>
          </div>
        </div>
      </section>

      {/* Freccia torna in cima */}
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Torna in cima"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Promotions;
