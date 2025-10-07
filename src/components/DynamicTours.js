import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TourService from '../services/TourService';
import './DynamicTours.css';

// Componente per i tour dinamici caricati dal backend
const DynamicTours = ({ type, country, limit = 6, showFilters = false }) => {
  const [allTours, setAllTours] = useState([]); // Tutti i tour caricati
  const [filteredTours, setFilteredTours] = useState([]); // Tour filtrati lato client
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(type || 'all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ref per mantenere il focus sulla searchbar
  const searchInputRef = useRef(null);

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

  // Funzione per filtrare i tour lato client
  const filterTours = useCallback((tours, type, duration, price, search) => {
    let filtered = [...tours];

    // Filtro per tipo
    if (type && type !== 'all') {
      filtered = filtered.filter(tour => tour.type === type);
    }

    // Filtro per durata
    if (duration && duration !== 'all') {
      filtered = filtered.filter(tour => {
        const tourDuration = parseInt(tour.duration) || 0;
        switch (duration) {
          case '1-3': return tourDuration >= 1 && tourDuration <= 3;
          case '4-7': return tourDuration >= 4 && tourDuration <= 7;
          case '8-14': return tourDuration >= 8 && tourDuration <= 14;
          case '15+': return tourDuration >= 15;
          default: return true;
        }
      });
    }

    // Filtro per prezzo
    if (price && price !== 'all') {
      filtered = filtered.filter(tour => {
        const tourPrice = parseInt(tour.price) || 0;
        switch (price) {
          case '0-500': return tourPrice >= 0 && tourPrice <= 500;
          case '500-1000': return tourPrice >= 500 && tourPrice <= 1000;
          case '1000-2000': return tourPrice >= 1000 && tourPrice <= 2000;
          case '2000+': return tourPrice >= 2000;
          default: return true;
        }
      });
    }

    // Filtro per ricerca
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(searchLower) ||
        tour.description.toLowerCase().includes(searchLower) ||
        (tour.country && tour.country.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, []);

  // Carica tutti i tour una sola volta
  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        setLoading(true);
        let data;
        
        if (country) {
          data = await TourService.getToursByCountry(country);
        } else {
          data = await TourService.getAllTours();
        }
        
        setAllTours(data);
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTours();
  }, [country]);

  // Filtra i tour ogni volta che cambiano i filtri
  useEffect(() => {
    const filtered = filterTours(allTours, selectedType, selectedDuration, selectedPrice, searchQuery);
    setFilteredTours(filtered.slice(0, limit));
  }, [allTours, selectedType, selectedDuration, selectedPrice, searchQuery, limit, filterTours]);

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
        {filteredTours.map((tour) => (
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
              
              <a href={`/tour/${tour.slug}`} className="tour-card-button">
                Scopri Viaggio
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && !loading && (
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
