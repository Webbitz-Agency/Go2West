import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import DynamicTours from '../components/DynamicTours';
import './Promotions.css';

const Promotions = () => {
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


  return (
    <div className="promotions-page">
      <PageTitle title="Promozioni" />
      {/* Hero Section */}
      <section className="promotions-hero">
        <div className="hero-background-image">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Destinazione promozione ${index + 1}`}
              className={`hero-carousel-image ${index === currentHeroImage ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="destination-hero-title">Viaggi in Primo Piano</h1>
            <p className="hero-subtitle">Scopri le nostre offerte speciali e del momento, per vivere esperienze indimenticabili.</p>
          </div>
        </div>
      </section>

      {/* Griglia delle promozioni con DynamicTours */}
      <section className="promotions-grid-section">
        <div className="promotions-grid-container">
          <DynamicTours 
            promotionsOnly={true}
            showFilters={true}
            limit={100}
          />
        </div>
      </section>

      {/* CTA delle promozioni */}
      <section className="promotions-cta">
      <div className="promotions-cta-hero-image">
          <img src="/images/map4.jpg" alt="Cartina città" />
        </div>
        <div className="promotions-cta-hero-content">
          <h2>Non trovi quello che cerchi?</h2>
          <p>Contattaci per una consulenza personalizzata e scopri le migliori offerte apposta per te</p>
          <div className="cta-buttons">
            <Link to="/#contact" className="cta-btn primary">
              Richiedi Consulenza
            </Link>
            <a href="/" className="cta-btn secondary">
              Torna alla Home
            </a>
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
