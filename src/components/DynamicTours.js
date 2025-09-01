import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Ref per mantenere il focus sulla searchbar
  const searchInputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Tipi di tour disponibili
  const tourTypes = [
    { name: 'Tutti i Tour', value: 'all' },
    { name: 'Tour Guidati', value: 'tour' },
    { name: 'Fly & Drive', value: 'fly-drive' },
    { name: 'Safari', value: 'safari' },
    { name: 'Crociere', value: 'cruise' },
    { name: 'Avventura', value: 'adventure' },
    { name: 'Motorcycle', value: 'motorcycle' }
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

  // Debounce per la ricerca
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms di delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        let data;
        
        if (country && selectedType !== 'all') {
          data = await TourService.getToursByCountryAndType(country, selectedType);
        } else if (country) {
          data = await TourService.getToursByCountry(country);
        } else if (selectedType && selectedType !== 'all') {
          data = await TourService.getToursByType(selectedType);
        } else {
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

        // Filtro per ricerca (usa il valore debounced)
        if (debouncedSearchQuery.trim()) {
          filteredData = filteredData.filter(tour => 
            tour.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            tour.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          );
        }
        
        setTours(filteredData.slice(0, limit));
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [type, country, limit, selectedType, selectedDuration, selectedPrice, debouncedSearchQuery]);

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
        <div className="loading">Caricamento tour...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-tours-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dynamic-tours">
      {showFilters && (
        <div className="filters-section">
          {/* Barra di ricerca */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
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

          {/* Filtri a tendina su una riga */}
          <div className="dropdown-filters">
            <div className="filter-dropdown">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                {tourTypes.map((tourType) => (
                  <option key={tourType.value} value={tourType.value}>
                    {tourType.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-dropdown">
              <select 
                value={selectedDuration} 
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="filter-select"
              >
                {durationFilters.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-dropdown">
              <select 
                value={selectedPrice} 
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="filter-select"
              >
                {priceFilters.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                Cancella Filtri
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Grid dei tour */}
      <div className="tours-grid">
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <div className="tour-card-image">
              <img 
                src={tour.mainImage || '/images/placeholder.jpg'} 
                alt={tour.title} 
              />
            </div>
            <div className="tour-card-content">
              <h3 className="tour-card-title">{tour.title}</h3>
              <p className="tour-card-description">{tour.description}</p>
              
              <div className="tour-card-details">
                <div className="tour-duration">
                  {tour.duration ? `${tour.duration} giorni` : 'Durata variabile'}
                </div>
                <div className="tour-price">€ {tour.price}</div>
              </div>
              
              <Link to={`/tour/${tour.slug}`} className="tour-card-button">
                Scopri Viaggio
              </Link>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="no-results">
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
