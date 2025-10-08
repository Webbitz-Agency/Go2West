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
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Funzione per ottenere le date del tour dal database
  const getTourDates = () => {
    if (!tour || !tour.dates) return {};
    
    // Converte le date dal database nel formato utilizzato dal componente
    const formattedDates = {};
    Object.keys(tour.dates).forEach(year => {
      if (Array.isArray(tour.dates[year])) {
        formattedDates[year] = tour.dates[year].map(dateInfo => ({
          dateRange: `${dateInfo.startDate} - ${dateInfo.endDate}`,
          price: tour.minPrice || 0
        }));
      }
    });
    
    return formattedDates;
  };

  const tourDates = getTourDates();

  // Funzione per gestire il cambio di anno
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Dati estesi per ogni giorno dell'itinerario
  const itineraryDetails = {
    1: "Arrivo all'aeroporto JFK di New York. Trasferimento in hotel nel cuore di Manhattan. Tempo libero per esplorare i dintorni. Cena di benvenuto in un ristorante tipico newyorkese. Pernottamento a New York.",
    2: "Colazione in hotel. Tour completo di New York: Times Square, Central Park, Fifth Avenue, Empire State Building, Statua della Libertà (vista da Battery Park), Wall Street, Ground Zero Memorial. Pranzo libero. Pomeriggio dedicato allo shopping su Broadway. Cena in Little Italy. Pernottamento a New York.",
    3: "Prima colazione e partenza per Philadelphia. Visita della città: Independence Hall, Liberty Bell, Reading Terminal Market. Pranzo tipico con cheesesteak. Proseguimento per Washington DC. Arrivo e sistemazione in hotel. Cena libera. Pernottamento a Washington DC.",
    4: "Colazione in hotel. Giornata dedicata alla visita di Washington DC: Casa Bianca (esterno), Campidoglio, Memoriale di Lincoln, Memoriale di Washington, Memoriale di Jefferson, Museo Smithsonian. Pranzo libero. Pomeriggio: Arlington Cemetery, Georgetown. Cena in un ristorante del centro. Pernottamento a Washington DC.",
    5: "Prima colazione e partenza per Charleston, South Carolina. Viaggio panoramico attraverso la Virginia e la Carolina del Nord. Arrivo a Charleston nel pomeriggio. Visita del centro storico: Battery Park, Rainbow Row, Charleston City Market. Cena in un ristorante tipico del Sud. Pernottamento a Charleston."
  };

  // Funzione per gestire il toggle degli elementi dell'itinerario (solo uno aperto alla volta)
  const toggleDayExpansion = (dayNumber) => {
    setExpandedDays(prev => {
      const newSet = new Set();
      if (!prev.has(dayNumber)) {
        newSet.add(dayNumber); // Apri solo il giorno cliccato, chiudi tutti gli altri
      }
      return newSet;
    });
  };

  // Funzione per aprire il modale di prenotazione
  const handleBookingClick = (dateRange) => {
    setSelectedDate(dateRange);
    setIsBookingModalOpen(true);
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  };

  // Funzione per aprire il modale senza data pre-compilata
  const handleQuoteRequest = () => {
    setSelectedDate('');
    setIsBookingModalOpen(true);
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  };

  // Funzione per chiudere il modale
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDate('');
    document.body.style.overflow = 'auto'; // Riavvia lo scroll della pagina
  };

  // Funzione per ottenere le immagini del tour
  const getTourImages = () => {
    if (!tour) return [];
    
    const images = [];
    
    // Aggiungi l'immagine hero se esiste
    if (tour.heroImage) {
      images.push({
        src: TourService.getTourImageUrl(tour.id, 'hero'),
        alt: tour.title,
        isMain: true
      });
    }
    
    // Aggiungi le immagini image1,2,3 se esistono (per i caroselli)
    for (let i = 1; i <= 3; i++) {
      if (tour[`image${i}`]) {
        images.push({
          src: TourService.getTourImageUrl(tour.id, `image${i}`),
          alt: `${tour.title} - Immagine ${i}`,
          isMain: false
        });
      }
    }
    
    // Se non ci sono immagini dal database, usa le immagini di fallback della destinazione
    if (images.length === 0) {
      const destinationKey = tour.destination?.toLowerCase().replace(/\s+/g, '-');
      if (destinationKey && destinationImages[destinationKey]) {
        destinationImages[destinationKey].forEach((imageName, index) => {
          images.push({
            src: `/images/${imageName}`,
            alt: `${tour.title} - Immagine ${index + 1}`,
            isMain: index === 0
          });
        });
      }
    }
    
    return images;
  };

  // Funzione per creare le immagini dei servizi inclusi
  const getHighlightImages = () => {
    if (!tour || !tour.included) return [];
    
    return tour.included.slice(0, 5).map((service, index) => {
      const imageField = `image${index + 1}`;
      let imageSrc = null;
      
      // Se esiste l'immagine caricata per questo servizio, usala
      if (tour[imageField]) {
        imageSrc = TourService.getTourImageUrl(tour.id, imageField);
      }
      
      return {
        id: index,
        title: service,
        image: imageSrc,
        alt: `${service} - ${tour.title}`
      };
    });
  };

  // Effetto per lo scorrimento automatico del carosello
  useEffect(() => {
    if (!tour || !tour.included) return;
    
    const highlightImages = getHighlightImages().filter(highlight => highlight.image);
    if (highlightImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHighlightIndex((prevIndex) => 
        (prevIndex + 1) % highlightImages.length
      );
    }, 4000); // Cambia immagine ogni 4 secondi

    return () => clearInterval(interval);
  }, [tour]);

  // Carica i dettagli del tour dal database
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        // Prova prima con getTourByCode, poi con getTourById come fallback
        let data;
        try {
          data = await TourService.getTourByCode(tourId);
        } catch (codeError) {
          // Se non trova per code, prova con ID
          data = await TourService.getTourById(tourId);
        }
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
            {tourImages.length > 0 && (
              <div className="overview-carousel">
                <div className="overview-carousel-container">
                  {tourImages.map((image, index) => (
                    <div
                      key={index}
                      className={`overview-slide ${index === currentHighlightIndex % tourImages.length ? 'active' : ''}`}
                    >
                      <img src={image.src} alt={image.alt} />
                    </div>
                  ))}
                </div>
                {tourImages.length > 1 && (
                  <div className="overview-indicators">
                    {tourImages.map((_, index) => (
                      <button
                        key={index}
                        className={`overview-indicator ${index === currentHighlightIndex % tourImages.length ? 'active' : ''}`}
                        onClick={() => setCurrentHighlightIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-details">
        <div className="tour-content">
          {/* Left Column - Main Content */}
          <div className="tour-main">
            {/* Itinerary */}
            {tour.program && tour.program.days && tour.program.days.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Itinerario</h2>
                <div className="itinerary-list">
                  {tour.program.days.map((day, index) => {
                    const dayNumber = day.day;
                    const isExpanded = expandedDays.has(dayNumber);
                    return (
                      <div key={index} className="itinerary-item">
                        <div 
                          className="itinerary-item-header"
                          onClick={() => toggleDayExpansion(dayNumber)}
                        >
                          <div className="day-badge">Giorno {dayNumber}</div>
                          <div className="day-content">
                            <h3 className="day-title">{day.title}</h3>
                          </div>
                          <div className="expand-icon">
                            <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                            <i class="fa-solid fa-angle-right"></i>
                            </span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="itinerary-details">
                            <p className="day-description">
                              {day.description || "Descrizione dettagliata non disponibile per questo giorno."}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tour Highlights Carousel */}
          {tour.included && tour.included.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Servizi Inclusi</h2>
                <div className="highlights-carousel">
                  <div className="carousel-container">
                    {getHighlightImages().filter(highlight => highlight.image).map((highlight, index) => (
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
                  
                  {/* Indicatori - solo se ci sono immagini */}
                  {getHighlightImages().filter(highlight => highlight.image).length > 1 && (
                    <div className="carousel-indicators">
                      {getHighlightImages().filter(highlight => highlight.image).map((_, index) => (
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

            {/* Pricing Section */}
            {tour.prices && tour.prices.prices && tour.prices.prices.length > 0 && (
              <section className="tour-section">
                <h2 className="section-title">Prezzi</h2>
                <div className="pricing-table-container">
                  <table className="pricing-table">
                    <thead>
                      <tr>
                        <th className="pricing-header-cell">Tipologia di camera</th>
                        <th className="pricing-header-cell">Singola</th>
                        <th className="pricing-header-cell">Doppia</th>
                        <th className="pricing-header-cell">Tripla</th>
                        <th className="pricing-header-cell">Quadrupla</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tour.prices.prices.map((priceRow, index) => (
                        <tr key={index} className="pricing-row">
                          <td className="pricing-label-cell">{priceRow.category}</td>
                          <td className="pricing-value-cell">
                            {priceRow.single ? `€ ${priceRow.single.toLocaleString()}` : 'n.d.'}
                          </td>
                          <td className="pricing-value-cell">
                            {priceRow.double ? `€ ${priceRow.double.toLocaleString()}` : 'n.d.'}
                          </td>
                          <td className="pricing-value-cell">
                            {priceRow.triple ? `€ ${priceRow.triple.toLocaleString()}` : 'n.d.'}
                          </td>
                          <td className="pricing-value-cell">
                            {priceRow.quad ? `€ ${priceRow.quad.toLocaleString()}` : 'n.d.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pricing-note">
                    <p><strong>Nota:</strong> I prezzi sono indicativi e possono variare in base alla stagionalità e alla disponibilità. Contattaci per un preventivo personalizzato.</p>
                  </div>
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
                  <span className="info-value">{tour.destination}</span>
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
                  <span className="info-value">{tour.code}</span>
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

            {/* Quote Request CTA */}
            <section className="tour-section quote-request-section">
              <div className="quote-request-content">
                <h2 className="quote-request-title">Interessato a questo viaggio?</h2>
                <p className="quote-request-description">
                  Richiedi un preventivo personalizzato e scopri tutte le opzioni disponibili per il tuo viaggio ideale.
                </p>
                <button 
                  className="quote-request-btn"
                  onClick={handleQuoteRequest}
                >
                  <i className="fa-solid fa-calculator"></i>
                  Richiedi un Preventivo
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Dates & Prices */}
          <div className="tour-sidebar">
            <div className="dates-prices-section">
              {/*<h2 className="dates-prices-title">Dates & Prices</h2>*/}
              
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
                A partire da €3500 per persona.
              </p>
              
              {/* Tour Dates List */}
              <div className="tour-dates-list">
                {tourDates[selectedYear]?.map((dateInfo, index) => (
                  <div key={index} className="date-row">
                    <div className="date-info">
                      <span className="date-range">{dateInfo.dateRange}</span>
                    </div>
                    {/*<div className="price-info">€{dateInfo.price}</div>*/}
                    <button 
                      className="availability-button"
                      onClick={() => handleBookingClick(dateInfo.dateRange)}
                    >
                      PRENOTA
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h2>Richiesta di Prenotazione</h2>
              <button className="booking-modal-close" onClick={closeBookingModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="booking-modal-content">
              <form className="booking-form">
                {/* Sezione Dettagli Viaggio */}
                <div className="booking-section">
                  <h3>Dettagli Viaggio</h3>
                  
                  <div className="form-group">
                    <label htmlFor="departure-date">Data di partenza *</label>
                    {selectedDate ? (
                      <input 
                        type="text" 
                        id="departure-date" 
                        value={selectedDate} 
                        readOnly 
                        className="form-input"
                      />
                    ) : (
                      <select id="departure-date" className="form-select" required>
                        <option value="">Seleziona una data</option>
                        {tourDates[selectedYear]?.map((dateInfo, index) => (
                          <option key={index} value={dateInfo.dateRange}>
                            {dateInfo.dateRange}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="adults">Numero adulti *</label>
                      <select id="adults" className="form-select" defaultValue="1">
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="children">Numero bambini (&lt;16 anni)</label>
                      <select id="children" className="form-select" defaultValue="0">
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="child-age">Età bambino</label>
                      <input 
                        type="text" 
                        id="child-age" 
                        className="form-input" 
                        placeholder="Es. 8, 12"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="single-rooms">Numero camere singole</label>
                      <select id="single-rooms" className="form-select" defaultValue="0">
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="double-rooms">Numero camere doppie</label>
                      <select id="double-rooms" className="form-select" defaultValue="0">
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="triple-rooms">Numero camere triple</label>
                      <select id="triple-rooms" className="form-select" defaultValue="0">
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="quadruple-rooms">Numero camere quadruple</label>
                      <select id="quadruple-rooms" className="form-select" defaultValue="0">
                        {[...Array(6)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="comments">Commenti</label>
                    <textarea 
                      id="comments" 
                      className="form-textarea" 
                      rows="4"
                      placeholder="Note aggiuntive, richieste speciali, ecc."
                    ></textarea>
                  </div>
                </div>
                
                {/* Sezione Dati di Contatto */}
                <div className="booking-section">
                  <h3>Dati di Contatto</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first-name">Nome (contatto principale) *</label>
                      <input 
                        type="text" 
                        id="first-name" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="last-name">Cognome (contatto principale) *</label>
                      <input 
                        type="text" 
                        id="last-name" 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="citizenship">Cittadinanza *</label>
                    <input 
                      type="text" 
                      id="citizenship" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Indirizzo</label>
                    <input 
                      type="text" 
                      id="address" 
                      className="form-input" 
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">Città</label>
                      <input 
                        type="text" 
                        id="city" 
                        className="form-input" 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="postal-code">Codice Postale</label>
                      <input 
                        type="text" 
                        id="postal-code" 
                        className="form-input" 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="country">Paese</label>
                    <input 
                      type="text" 
                      id="country" 
                      className="form-input" 
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Telefono *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="privacy-checkbox-container">
                  <label className="privacy-checkbox-label">
                    <input 
                      type="checkbox" 
                      className="privacy-checkbox" 
                      required 
                    />
                    <span className="privacy-checkbox-text">
                      Ho letto e accetto l'
                      <a href="/PrivacyPolicy2025.pdf" target="_blank" rel="noopener noreferrer" className="privacy-link">
                        informativa sulla privacy
                      </a>
                      *
                    </span>
                  </label>
                </div>
                
                <div className="booking-modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeBookingModal}>
                    Annulla
                  </button>
                  <button type="submit" className="btn-primary">
                    Invia Richiesta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetails; 