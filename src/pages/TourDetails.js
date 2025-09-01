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
        <div className="container">
          <h1>{tour.title}</h1>
          <p>{tour.description}</p>
          <div className="tour-meta">
            <span className="tour-country">{tour.country}</span>
            <span className="tour-type">{tour.type}</span>
            {tour.duration && <span className="tour-duration">{tour.duration} giorni</span>}
          </div>
        </div>
      </section>

      {/* Tour Images */}
      {tour.mainImage && (
        <section className="tour-gallery">
          <div className="container">
            <div className="gallery-grid">
              <div className="gallery-item main-image">
                <img src={tour.mainImage} alt={tour.title} />
              </div>
              {tour.images && tour.images.length > 0 && tour.images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image} alt={`${tour.title} - Immagine ${index + 2}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container">
        <div className="tour-content">
          {/* Left Column */}
          <div className="tour-main">
            {/* Tour Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="tour-highlights">
                <h2>Punti Salienti</h2>
                <ul>
                  {tour.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="itinerary">
                <h2>Itinerario</h2>
                <div className="itinerary-list">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="itinerary-item">
                      <div className="day-number">Giorno {index + 1}</div>
                      <div className="activity-content">
                        <h3>{item}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions */}
            {tour.included && tour.included.length > 0 && (
              <section className="inclusions">
                <h2>Servizi Inclusi</h2>
                <ul>
                  {tour.included.map((inclusion, index) => (
                    <li key={index}><i className="fas fa-check"></i> {inclusion}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exclusions */}
            {tour.notIncluded && tour.notIncluded.length > 0 && (
              <section className="exclusions">
                <h2>Servizi Non Inclusi</h2>
                <ul>
                  {tour.notIncluded.map((exclusion, index) => (
                    <li key={index}><i className="fas fa-times"></i> {exclusion}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Notes */}
            {tour.notes && (
              <section className="notes">
                <h2>Note Importanti</h2>
                <p>{tour.notes}</p>
              </section>
            )}
          </div>

          {/* Right Column - Pricing */}
          <div className="tour-sidebar">
            <div className="pricing-card">
              <h2>Prezzo</h2>
              <div className="price">
                <span className="price-amount">€ {tour.price}</span>
                <span className="price-per">per persona</span>
              </div>
              <p className="price-note">
                Prezzo a partire da € {tour.price} per persona. Supplemento singola disponibile. 
                Contattaci per prezzi di gruppo e opzioni di personalizzazione.
              </p>
              <button className="book-now-btn">Prenota Ora</button>
            </div>

            {/* Tour Info */}
            <div className="tour-info-card">
              <h3>Informazioni Tour</h3>
              <div className="info-item">
                <strong>Destinazione:</strong> {tour.country}
              </div>
              <div className="info-item">
                <strong>Tipo:</strong> {tour.type}
              </div>
              {tour.duration && (
                <div className="info-item">
                  <strong>Durata:</strong> {tour.duration} giorni
                </div>
              )}
              <div className="info-item">
                <strong>Codice Tour:</strong> {tour.slug}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 