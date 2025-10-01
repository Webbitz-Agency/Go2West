import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TourService from '../services/TourService';
import { destinationImages } from '../config/destinations';
import './TourDetails.css';

const TourDetails = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Dati per le date dei tour per anno
  const tourDates = {
    2025: [
      { dateRange: "Gen 7 - Gen 20", price: tour?.price || 1599 },
      { dateRange: "Gen 14 - Gen 27", price: tour?.price || 1599 },
      { dateRange: "Gen 28 - Feb 10", price: (parseInt(tour?.price) || 1599) + 1305 },
      { dateRange: "Feb 11 - Feb 24", price: (parseInt(tour?.price) || 1599) + 1305 },
      { dateRange: "Feb 18 - Mar 3", price: tour?.price || 1599 },
      { dateRange: "Feb 25 - Mar 10", price: tour?.price || 1599 }
    ],
    2026: [
      { dateRange: "Gen 6 - Gen 19", price: (parseInt(tour?.price) || 1599) + 200 },
      { dateRange: "Gen 13 - Gen 26", price: (parseInt(tour?.price) || 1599) + 200 },
      { dateRange: "Gen 27 - Feb 9", price: (parseInt(tour?.price) || 1599) + 1505 },
      { dateRange: "Feb 10 - Feb 23", price: (parseInt(tour?.price) || 1599) + 1505 },
      { dateRange: "Feb 17 - Mar 2", price: (parseInt(tour?.price) || 1599) + 200 },
      { dateRange: "Feb 24 - Mar 9", price: (parseInt(tour?.price) || 1599) + 200 }
    ]
  };

  // Funzione per gestire il cambio di anno
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Funzione per ottenere le immagini del tour
  const getTourImages = () => {
    if (!tour) return [];
    
    const images = [];
    
    // Aggiungi l'immagine principale se esiste
    if (tour.mainImage) {
      images.push({
        src: tour.mainImage,
        alt: tour.title,
        isMain: true
      });
    }
    
    // Aggiungi le immagini della destinazione
    const countryKey = tour.country?.toLowerCase().replace(/\s+/g, '-');
    if (countryKey && destinationImages[countryKey]) {
      destinationImages[countryKey].forEach((imageName, index) => {
        images.push({
          src: `/images/${imageName}`,
          alt: `${tour.title} - Immagine ${index + 1}`,
          isMain: false
        });
      });
    }
    
    return images;
  };

  // Funzione per creare le immagini dei punti salienti
  const getHighlightImages = () => {
    if (!tour || !tour.highlights) return [];
    
    // Usa le immagini della destinazione per i punti salienti
    const countryKey = tour.country?.toLowerCase().replace(/\s+/g, '-');
    const destinationImagesList = countryKey && destinationImages[countryKey] 
      ? destinationImages[countryKey] 
      : ['usa.jpg', 'canada.jpg', 'mexico.jpg', 'sudamerica.jpg', 'caraibi.jpg'];
    
    return tour.highlights.map((highlight, index) => ({
      id: index,
      title: highlight,
      image: `/images/${destinationImagesList[index % destinationImagesList.length]}`,
      alt: `${highlight} - ${tour.title}`
    }));
  };

  // Effetto per lo scorrimento automatico del carosello
  useEffect(() => {
    if (!tour || !tour.highlights || tour.highlights.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHighlightIndex((prevIndex) => 
        (prevIndex + 1) % tour.highlights.length
      );
    }, 4000); // Cambia immagine ogni 4 secondi

    return () => clearInterval(interval);
  }, [tour]);

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

  const tourImages = getTourImages();

  return (
    <div className="tour-details">
      {/* Hero Section - Clean Image Gallery */}
      <section className="tour-hero-masonry">
        <div className="masonry-container">
          {tourImages.map((image, index) => (
            <div
              key={index}
              className={`masonry-item ${image.isMain ? 'main-image' : ''} ${hoveredImage === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredImage(index)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </section>

      {/* Tour Overview Section */}
      <section className="tour-overview-section">
        <div className="container-overview">
          <div className="overview-content">
            {/* Left Column - Overview Text */}
            <div className="overview-text">
              <div className="overview-header">
                <span className="overview-label">OVERVIEW</span>
                <h1 className="overview-title">{tour.title}</h1>
              </div>
              <div className="overview-description">
                <p>{tour.description}</p>
                <p>Un'esperienza di viaggio unica che ti porterà alla scoperta di destinazioni straordinarie, combinando comfort, avventura e autenticità. I nostri tour sono progettati per offrirti momenti indimenticabili e connessioni profonde con le culture locali.</p>
              </div>
            </div>
            
            {/* Right Column - Image Carousel */}
            <div className="overview-carousel">
              <div className="overview-carousel-container">
                {tourImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`overview-slide ${index === currentHighlightIndex % 4 ? 'active' : ''}`}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
              <div className="overview-indicators">
                {tourImages.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    className={`overview-indicator ${index === currentHighlightIndex % 4 ? 'active' : ''}`}
                    onClick={() => setCurrentHighlightIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-details">
        <div className="tour-content">
          {/* Left Column - Main Content */}
          <div className="tour-main">
            {/* Tour Highlights Carousel */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Punti Salienti</h2>
                <div className="highlights-carousel">
                  <div className="carousel-container">
                    {getHighlightImages().map((highlight, index) => (
                      <div
                        key={highlight.id}
                        className={`carousel-slide ${index === currentHighlightIndex ? 'active' : ''}`}
                        /*style={{
                          transform: `translateX(-${currentHighlightIndex * 100}%)`
                        }}*/
                      >
                        <img src={highlight.image} alt={highlight.alt} />
                        <div className="highlight-overlay">
                          <h3 className="highlight-title">{highlight.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicatori */}
                  {tour.highlights.length > 1 && (
                    <div className="carousel-indicators">
                      {tour.highlights.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentHighlightIndex ? 'active' : ''}`}
                          onClick={() => setCurrentHighlightIndex(index)}
                        />
                      ))}
                    </div>
                  )}
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

            {/* Tour Information */}
            <section className="tour-section">
              <h2 className="section-title">Informazioni Tour</h2>
              <div className="tour-info-grid">
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
            </section>

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

          {/* Right Column - Dates & Prices */}
          <div className="tour-sidebar">
            <div className="dates-prices-section">
              <h2 className="dates-prices-title">Dates & Prices</h2>
              
              {/* Year Selection */}
              <div className="year-selection">
                <button 
                  className={`year-button ${selectedYear === 2025 ? 'active' : ''}`}
                  onClick={() => handleYearChange(2025)}
                  id="first-year"
                >
                  2025
                </button>
                <button 
                  className={`year-button ${selectedYear === 2026 ? 'active' : ''}`}
                  onClick={() => handleYearChange(2026)}
                  id="second-year"
                >
                  2026
                </button>
              </div>
              
              <p className="pricing-disclaimer">
                Prezzi in EUR, inclusi voli interni, per persona, doppia occupazione.
              </p>
              
              {/* Tour Dates List */}
              <div className="tour-dates-list">
                {tourDates[selectedYear]?.map((dateInfo, index) => (
                  <div key={index} className="date-row">
                    <div className="date-info">
                      <span className="date-range">{dateInfo.dateRange}</span>
                    </div>
                    <div className="price-info">€{dateInfo.price}</div>
                    <button className="availability-button">
                      PRENOTA
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 