import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import DynamicTours from '../components/DynamicTours';
import './DestinationTours.css';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="destination-tours search-results-page">
      <PageTitle title={searchQuery ? `Risultati per "${searchQuery}"` : 'Ricerca tour'} />

      <section className="hero-top search-hero" aria-label="Ricerca tour">
        <div className="hero-background-image">
          <img
            src="/images/usa.jpg"
            alt="Ricerca tour"
            className="hero-carousel-image active"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="destination-hero-title">
              {searchQuery ? `Risultati per "${searchQuery}"` : 'Cerca il tuo prossimo viaggio'}
            </h1>
            {searchQuery && (
              <p className="hero-subtitle">
                Tour trovati per titolo, descrizione e itinerario
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container-tours">
        <section className="tours-section">
          {searchQuery ? (
            <DynamicTours
              initialSearchQuery={searchQuery}
              showFilters={true}
            />
          ) : (
            <div className="search-empty-state">
              <p>Inserisci un termine di ricerca per trovare i tour disponibili.</p>
              <Link to="/" className="cta-btn primary">
                Torna alla Home
              </Link>
            </div>
          )}
        </section>
      </div>

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

export default SearchResults;
