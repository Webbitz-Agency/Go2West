import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TourService from '../services/TourService';
import './TourDetails.css';

const TourDetails = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica i dettagli del tour dal database
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await TourService.getTourBySlug(tourId);
        setTour(data);
      } catch (err) {
        setError('Errore nel caricamento del tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  // Mostra loading
  if (loading) {
    return (
      <div className="tour-details">
        <div className="loading-container">
          <div className="loading">Caricamento dettagli tour...</div>
        </div>
      </div>
    );
  }

  // Mostra errore
  if (error || !tour) {
    return (
      <div className="tour-details">
        <div className="error-container">
          <div className="error-message">{error || 'Tour non trovato'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-details">
      {/* Hero Section */}
      <section className="tour-hero">
        <div className="hero-background">
          {tour.mainImage && <img src={tour.mainImage} alt={tour.title} />}
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">{tour.title}</h1>
            <p className="hero-description">{tour.description}</p>
            <div className="hero-meta">
              <span className="meta-item">{tour.country}</span>
              <span className="meta-item">{tour.type}</span>
              {tour.duration && <span className="meta-item">{tour.duration} giorni</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="tour-content">
          {/* Left Column - Main Content */}
          <div className="tour-main">
            {/* Tour Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Punti Salienti</h2>
                <div className="highlights-grid">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="highlight-item">
                      <span className="highlight-icon">✓</span>
                      <span className="highlight-text">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Itinerario</h2>
                <div className="itinerary-list">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="itinerary-item">
                      <div className="day-badge">Giorno {index + 1}</div>
                      <div className="day-content">
                        <h3 className="day-title">{item}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions */}
            {tour.included && tour.included.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Servizi Inclusi</h2>
                <div className="inclusions-list">
                  {tour.included.map((inclusion, index) => (
                    <div key={index} className="inclusion-item">
                      <span className="inclusion-icon">✓</span>
                      <span className="inclusion-text">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exclusions */}
            {tour.notIncluded && tour.notIncluded.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Servizi Non Inclusi</h2>
                <div className="exclusions-list">
                  {tour.notIncluded.map((exclusion, index) => (
                    <div key={index} className="exclusion-item">
                      <span className="exclusion-icon">✗</span>
                      <span className="exclusion-text">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            {tour.notes && (
              <section className="tour-section">
                <h2 className="section-title">Note Importanti</h2>
                <div className="notes-content">
                  <p>{tour.notes}</p>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="tour-sidebar">
            {/* Pricing Card */}
            <div className="pricing-card">
              <div className="price-header">
                <h3 className="price-title">Prezzo</h3>
                <div className="price-amount">€ {tour.price}</div>
                <div className="price-per">per persona</div>
              </div>
              <div className="price-note">
                Prezzo a partire da € {tour.price} per persona. Supplemento singola disponibile.
              </div>
              <button className="book-button">Prenota Ora</button>
            </div>

            {/* Tour Info Card */}
            <div className="info-card">
              <h3 className="info-title">Informazioni Tour</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Destinazione:</span>
                  <span className="info-value">{tour.country}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tipo:</span>
                  <span className="info-value">{tour.type}</span>
                </div>
                {tour.duration && (
                  <div className="info-item">
                    <span className="info-label">Durata:</span>
                    <span className="info-value">{tour.duration} giorni</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Codice:</span>
                  <span className="info-value">{tour.slug}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 