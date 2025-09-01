import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TourService from '../services/TourService';
import './DynamicTours.css';

// Componente per i tour dinamici caricati dal backend
const DynamicTours = ({ type, country, limit = 6, showFilters = false }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(type || 'all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tipi di tour disponibili
  const tourTypes = [
    { name: 'Tutti i Tour', value: 'all', icon: '🌍' },
    { name: 'Tour Guidati', value: 'tour', icon: '🗺️' },
    { name: 'Fly & Drive', value: 'fly-drive', icon: '✈️' },
    { name: 'Safari', value: 'safari', icon: '🦁' },
    { name: 'Crociere', value: 'cruise', icon: '🚢' },
    { name: 'Avventura', value: 'adventure', icon: '🏔️' },
    { name: 'Motorcycle', value: 'motorcycle', icon: '🏍️' }
  ];

  // Filtri durata
  const durationFilters = [
    { name: 'Tutte le Durate', value: 'all' },
    { name: '1-3 giorni', value: '1-3' },
    { name: '4-7 giorni', value: '4-7' },
    { name: '8-14 giorni', value: '8-14' },
    { name: '15+ giorni', value: '15+' }
  ];

  // Filtri prezzo
  const priceFilters = [
    { name: 'Tutti i Prezzi', value: 'all' },
    { name: '€0-500', value: '0-500' },
    { name: '€500-1000', value: '500-1000' },
    { name: '€1000-2000', value: '1000-2000' },
    { name: '€2000+', value: '2000+' }
  ];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        let data;
        
        if (country && selectedType !== 'all') {
          // Filtra per paese e tipo specifico
          data = await TourService.getToursByCountryAndType(country, selectedType);
        } else if (country) {
          // Filtra solo per paese (quando selectedType è 'all')
          data = await TourService.getToursByCountry(country);
        } else if (selectedType && selectedType !== 'all') {
          // Filtra solo per tipo (quando non c'è country)
          data = await TourService.getToursByType(selectedType);
        } else {
          // Tutti i tour
          data = await TourService.getAllTours();
        }
        
        // Applica filtri aggiuntivi
        let filteredData = data;

        // Filtro per durata
        if (selectedDuration !== 'all') {
          filteredData = filteredData.filter(tour => {
            const duration = parseInt(tour.duration) || 0;
            switch (selectedDuration) {
              case '1-3': return duration >= 1 && duration <= 3;
              case '4-7': return duration >= 4 && duration <= 7;
              case '8-14': return duration >= 8 && duration <= 14;
              case '15+': return duration >= 15;
              default: return true;
            }
          });
        }

        // Filtro per prezzo
        if (selectedPrice !== 'all') {
          filteredData = filteredData.filter(tour => {
            const price = parseInt(tour.price) || 0;
            switch (selectedPrice) {
              case '0-500': return price >= 0 && price <= 500;
              case '500-1000': return price >= 500 && price <= 1000;
              case '1000-2000': return price >= 1000 && price <= 2000;
              case '2000+': return price >= 2000;
              default: return true;
            }
          });
        }

        // Filtro per ricerca
        if (searchQuery.trim()) {
          filteredData = filteredData.filter(tour => 
            tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Limita il numero di risultati
        setTours(filteredData.slice(0, limit));
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [type, country, limit, selectedType, selectedDuration, selectedPrice, searchQuery]);

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedDuration('all');
    setSelectedPrice('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedDuration !== 'all' || selectedPrice !== 'all' || searchQuery.trim();

  if (loading) {
    return (
      <div className="dynamic-tours-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Caricamento tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-tours-error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-tours">
      {showFilters && (
        <div className="modern-filters-section">
          {/* Barra di ricerca */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Cerca tour, destinazioni, esperienze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtri principali */}
          <div className="filters-container">
            <div className="filter-group">
              <h3 className="filter-group-title">Tipo di Viaggio</h3>
              <div className="filter-buttons">
                {tourTypes.map((tourType) => (
                  <button
                    key={tourType.value}
                    className={`filter-btn ${selectedType === tourType.value ? 'active' : ''}`}
                    onClick={() => setSelectedType(tourType.value)}
                  >
                    <span className="filter-icon">{tourType.icon}</span>
                    <span className="filter-text">{tourType.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Durata</h3>
              <div className="filter-buttons">
                {durationFilters.map((duration) => (
                  <button
                    key={duration.value}
                    className={`filter-btn ${selectedDuration === duration.value ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(duration.value)}
                  >
                    {duration.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Fascia di Prezzo</h3>
              <div className="filter-buttons">
                {priceFilters.map((price) => (
                  <button
                    key={price.value}
                    className={`filter-btn ${selectedPrice === price.value ? 'active' : ''}`}
                    onClick={() => setSelectedPrice(price.value)}
                  >
                    {price.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contatore risultati e pulsante reset */}
          <div className="results-header">
            <div className="results-counter">
              <span className="results-number">{tours.length}</span>
              <span className="results-text">
                {tours.length === 1 ? 'tour trovato' : 'tour trovati'}
              </span>
            </div>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                <span className="clear-icon">🔄</span>
                Cancella Filtri
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Grid dei tour */}
      <div className="tours-grid">
        {tours.map((tour, index) => (
          <div key={tour.id} className={`modern-tour-card ${index % 2 === 0 ? 'even' : 'odd'}`}>
            <div className="tour-card-image">
              <img 
                src={tour.mainImage || '/images/placeholder.jpg'} 
                alt={tour.title} 
              />
              <div className="tour-card-overlay">
                <div className="tour-card-badge">
                  <span className="badge-icon">⭐</span>
                  <span className="badge-text">Popolare</span>
                </div>
              </div>
            </div>
            <div className="tour-card-content">
              <div className="tour-card-header">
                <h3 className="tour-card-title">{tour.title}</h3>
                <div className="tour-card-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              
              <p className="tour-card-description">{tour.description}</p>
              
              <div className="tour-card-features">
                <div className="feature-item">
                  <span className="feature-icon">🗓️</span>
                  <span className="feature-text">
                    {tour.duration ? `${tour.duration} giorni` : 'Durata variabile'}
                  </span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span className="feature-text">Gruppo piccolo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏨</span>
                  <span className="feature-text">Hotel inclusi</span>
                </div>
              </div>
              
              <div className="tour-card-footer">
                <div className="tour-card-price">
                  <span className="price-label">A partire da</span>
                  <span className="price-amount">€ {tour.price}</span>
                </div>
                <Link to={`/tour/${tour.slug}`} className="tour-card-button">
                  <span className="button-text">Scopri Viaggio</span>
                  <span className="button-icon">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>Nessun tour trovato</h3>
          <p>Prova a modificare i filtri o la ricerca per trovare altri tour disponibili.</p>
          <button onClick={clearAllFilters} className="reset-filters-btn">
            Mostra Tutti i Tour
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicTours;
