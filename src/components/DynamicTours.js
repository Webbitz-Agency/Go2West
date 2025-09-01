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

  // Tipi di tour disponibili
  const tourTypes = [
    { name: 'Tutti', value: 'all' },
    { name: 'Tour', value: 'tour' },
    { name: 'Fly & Drive', value: 'fly-drive' },
    { name: 'Safari', value: 'safari' },
    { name: 'Crociera', value: 'cruise' },
    { name: 'Avventura', value: 'adventure' }
  ];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        let data;
        
        const currentType = selectedType === 'all' ? type : selectedType;
        
        if (currentType && country) {
          // Filtra per tipo e paese
          const allTours = await TourService.getAllTours();
          data = allTours.filter(tour => 
            tour.type === currentType && tour.country === country
          );
        } else if (currentType && currentType !== 'all') {
          // Filtra solo per tipo
          data = await TourService.getToursByType(currentType);
        } else if (country) {
          // Filtra solo per paese
          data = await TourService.getToursByCountry(country);
        } else {
          // Tutti i tour
          data = await TourService.getAllTours();
        }
        
        // Limita il numero di risultati
        setTours(data.slice(0, limit));
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [type, country, limit, selectedType]);

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

  if (tours.length === 0) {
    return (
      <div className="dynamic-tours-empty">
        <p>Nessun tour disponibile</p>
      </div>
    );
  }

  return (
    <div className="dynamic-tours">
      {showFilters && (
        <div className="tour-filters">
          <div className="filter-buttons">
            {tourTypes.map((tourType) => (
              <button
                key={tourType.value}
                className={`filter-btn ${selectedType === tourType.value ? 'active' : ''}`}
                onClick={() => setSelectedType(tourType.value)}
              >
                {tourType.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {tours.map((tour) => (
        <div key={tour.id} className="dynamic-tour-card">
          <div className="tour-image">
            <img 
              src={tour.mainImage || '/images/placeholder.jpg'} 
              alt={tour.title} 
            />
          </div>
          <div className="tour-content">
            <h3>{tour.title}</h3>
            <p>{tour.description}</p>
            <div className="tour-details">
              <span className="tour-duration">
                {tour.duration ? `${tour.duration} giorni` : 'Durata variabile'}
              </span>
              <span className="tour-price">€ {tour.price}</span>
            </div>
            <Link to={`/tour/${tour.slug}`} className="tour-button">
              Scopri Viaggio
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicTours;
