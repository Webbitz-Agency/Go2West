import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { travelTypes } from '../config/travelTypes';
import TourService from '../services/TourService';
import './DynamicTours.css';

// Mappatura inversa: dai valori dei filtri ai possibili valori nel database
const getDatabaseTypeVariants = (filterValue) => {
  const mapping = {
    'tour': ['tour guidati', 'tour guidato', 'tour'],
    'city-breaks': ['city breaks', 'city-breaks'],
    'fly-drive': ['fly and drive', 'fly-drive', 'fly & drive'],
    'camper': ['camper adventure', 'camper adventures', 'camper'],
    'under-canvas': ['under canvas'],
    'ranch': ['ranch'],
    'scoperta-in-treno': ['scoperta in treno', 'scoperta-in-treno']
  };
  return mapping[filterValue] || [filterValue];
};

// Funzione helper per mappare lo slug al valore del filtro
const getFilterValue = (slug) => {
  const mapping = {
    'tour-guidati': 'tour',
    'camper-adventures': 'camper',
    'city-breaks': 'city-breaks',
    'fly-drive': 'fly-drive'
  };
  return mapping[slug] || slug;
};

// Componente per i tour dinamici caricati dal backend
const DynamicTours = ({ type, destination, showFilters = false, promotionsOnly = false }) => {
  const [allTours, setAllTours] = useState([]); // Tutti i tour caricati
  const [filteredTours, setFilteredTours] = useState([]); // Tour filtrati lato client
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inizializza selectedType mappando lo slug se presente
  const [selectedType, setSelectedType] = useState(() => type ? getFilterValue(type) : 'all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedGeographicArea, setSelectedGeographicArea] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ref per mantenere il focus sulla searchbar
  const searchInputRef = useRef(null);

  // Tipi di tour disponibili basati su travelTypes
  const tourTypes = [
    { name: 'Tutti i Tour', value: 'all' },
    ...travelTypes.map(type => ({
      name: type.name,
      value: getFilterValue(type.slug)
    }))
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

  // Filtri area geografica
  const geographicAreaFilters = [
    { name: 'Tutte le Aree', value: 'all' },
    { name: 'EST', value: 'EST' },
    { name: 'OVEST', value: 'OVEST' },
    { name: 'EST E OVEST', value: 'EST E OVEST' }
  ];

  // Funzione per filtrare i tour lato client
  const filterTours = useCallback((tours, type, duration, price, geographicArea, search) => {
    let filtered = [...tours];

    // Filtro per tipo - confronto flessibile con mappatura esplicita
    if (type && type !== 'all') {
      filtered = filtered.filter(tour => {
        if (!tour.type) return false;
        
        // Ottieni tutte le varianti possibili per il valore del filtro
        const databaseVariants = getDatabaseTypeVariants(type);
        const tourTypeLower = tour.type.toLowerCase().trim();
        
        // Verifica se il tipo del tour corrisponde a una delle varianti
        return databaseVariants.some(variant => {
          const variantLower = variant.toLowerCase().trim();
          // Confronto esatto o se contiene la variante
          return tourTypeLower === variantLower || 
                 tourTypeLower.includes(variantLower) ||
                 variantLower.includes(tourTypeLower);
        });
      });
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

    // Filtro per prezzo - usa minPrice invece di price
    if (price && price !== 'all') {
      filtered = filtered.filter(tour => {
        const tourPrice = parseInt(tour.minPrice) || 0;
        switch (price) {
          case '0-500': return tourPrice >= 0 && tourPrice <= 500;
          case '500-1000': return tourPrice >= 500 && tourPrice <= 1000;
          case '1000-2000': return tourPrice >= 1000 && tourPrice <= 2000;
          case '2000+': return tourPrice >= 2000;
          default: return true;
        }
      });
    }

    // Filtro per area geografica
    if (geographicArea && geographicArea !== 'all') {
      filtered = filtered.filter(tour => {
        if (!tour.geographicArea) return false;
        // Confronto case-insensitive per gestire eventuali variazioni
        return tour.geographicArea.trim().toUpperCase() === geographicArea.toUpperCase();
      });
    }

    // Filtro per ricerca
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(searchLower) ||
        tour.description.toLowerCase().includes(searchLower) ||
        (tour.destination && tour.destination.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, []);

  // Aggiorna il filtro tipo quando cambia la prop type (da URL)
  useEffect(() => {
    if (type) {
      // Mappa lo slug dell'URL al valore del filtro
      const filterValue = getFilterValue(type);
      setSelectedType(filterValue);
    } else {
      setSelectedType('all');
    }
  }, [type]);

  // Carica tutti i tour una sola volta
  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        setLoading(true);
        let data;
        
        if (promotionsOnly) {
          data = await TourService.getPromotionTours();
        } else if (destination) {
          data = await TourService.getToursByDestination(destination);
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
  }, [destination, promotionsOnly]);

  // Filtra i tour ogni volta che cambiano i filtri
  useEffect(() => {
    const filtered = filterTours(allTours, selectedType, selectedDuration, selectedPrice, selectedGeographicArea, searchQuery);
    setFilteredTours(filtered);
  }, [allTours, selectedType, selectedDuration, selectedPrice, selectedGeographicArea, searchQuery, filterTours]);

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedDuration('all');
    setSelectedPrice('all');
    setSelectedGeographicArea('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedDuration !== 'all' || selectedPrice !== 'all' || selectedGeographicArea !== 'all' || searchQuery.trim();

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

            <div className="filter-dropdown">
              <select 
                value={selectedGeographicArea} 
                onChange={(e) => setSelectedGeographicArea(e.target.value)}
                className="filter-select"
              >
                {geographicAreaFilters.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.name}
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
          <div key={tour.id} className="promotion-card">
            <div className="promotion-card-image">
              <img 
                src={tour.heroImage ? TourService.getTourImageUrl(tour.id, 'hero') : '/images/placeholder.jpg'} 
                alt={tour.title}
                loading="lazy"
              />
            </div>
            
            <div className="promotion-card-content">
              {(promotionsOnly || tour.isPromotion) && (
                <div className="promotion-meta">
                  <div className="promotion-type-container">
                    <span className="promotion-type">{tour.type || 'Tour'}</span>
                    <span className="promotion-badge">PROMO</span>
                  </div>
                </div>
              )}
              
              <h3 className={(promotionsOnly || tour.isPromotion) ? "promotion-title" : "destination-card-title"}>{tour.title}</h3>
              
              <p className="promotion-description">
                {tour.description?.length > 150 
                  ? `${tour.description.substring(0, 150)}...` 
                  : tour.description
                }
              </p>
              
              <div className="promotion-features-container">
                <div className="promotion-features">
                  <div className="feature">
                    <i className="fa-solid fa-map-marker-alt"></i>
                    <span>{tour.destination || 'N/A'}</span>
                  </div>
                  <div className="feature">
                    <i className="fa-solid fa-clock"></i>
                    <span>{tour.duration}</span>
                  </div>
                  <div className="feature">
                    <i className="fa-solid fa-tag"></i>
                    <span>{tour.type || 'Tour'}</span>
                  </div>
                </div>
                
                <div className="promotion-price">
                  <span className="price-label">da</span>
                  <span className="price-amount">€{tour.minPrice || 0}</span>
                </div>
              </div>
              
              <a href={`/tour/${tour.code}`} className={(promotionsOnly || tour.isPromotion) ? "promotion-btn" : "scopri-viaggio-btn"}>
                Scopri Offerta
                <i className="fa-solid fa-arrow-right"></i>
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
