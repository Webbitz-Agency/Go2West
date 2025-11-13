import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { it } from 'date-fns/locale';
import PageTitle from '../components/PageTitle';
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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    itinerario: false,
    included: false,
    notIncluded: false,
    notes: false
  });
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    // Step 1: Dettagli Viaggio
    departureDate: '',
    adults: 1,
    children: 0,
    childAge: '',
    singleRooms: 0,
    doubleRooms: 0,
    tripleRooms: 0,
    quadrupleRooms: 0,
    comments: '',
    // Step 2: Dati di Contatto
    firstName: '',
    lastName: '',
    citizenship: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: '',
    phone: '',
    // Step 3: Privacy
    privacyAccepted: false
  });

  // Funzione per ottenere le date del tour dal database
  const getTourDates = () => {
    // Se è modalità unique, restituisci un oggetto vuoto (le date verranno mostrate come testo)
    if (tour?.datesMode === 'unique' || (tour?.datesText && tour.datesText.trim() !== '')) {
      return {};
    }
    
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

  // Funzione per ottenere gli anni disponibili dal tour
  const getAvailableYears = () => {
    if (!tour || !tour.dates) return [];
    return Object.keys(tour.dates)
      .map(year => parseInt(year))
      .sort((a, b) => a - b);
  };

  // Funzione per ottenere il prezzo minimo del tour
  const getMinPrice = () => {
    if (!tour) return 0;
    return tour.minPrice || 0;
  };


  // Funzione per aprire il modale di prenotazione
  const handleBookingClick = (dateRange) => {
    setSelectedDate(dateRange);
    setWizardData(prev => ({
      ...prev,
      departureDate: dateRange
    }));
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
    setCurrentWizardStep(1);
    setWizardData({
      departureDate: '',
      adults: 1,
      children: 0,
      childAge: '',
      singleRooms: 0,
      doubleRooms: 0,
      tripleRooms: 0,
      quadrupleRooms: 0,
      comments: '',
      firstName: '',
      lastName: '',
      citizenship: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      email: '',
      phone: '',
      privacyAccepted: false
    });
    document.body.style.overflow = 'auto'; // Riavvia lo scroll della pagina
  };

  // Funzioni per gestire il wizard
  const handleWizardDataChange = (field, value) => {
    setWizardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextWizardStep = () => {
    // Validazione per Step 1: Dettagli Viaggio
    if (currentWizardStep === 1) {
      if (!wizardData.departureDate) {
        alert('Seleziona una data di partenza');
        return;
      }
      if (wizardData.adults < 1) {
        alert('Inserisci almeno 1 adulto');
        return;
      }
    }
    
    // Validazione per Step 2: Dati di Contatto
    if (currentWizardStep === 2) {
      if (!wizardData.firstName.trim()) {
        alert('Inserisci il nome');
        return;
      }
      if (!wizardData.lastName.trim()) {
        alert('Inserisci il cognome');
        return;
      }
      if (!wizardData.citizenship.trim()) {
        alert('Inserisci la cittadinanza');
        return;
      }
      if (!wizardData.email.trim()) {
        alert('Inserisci l\'email');
        return;
      }
      if (!wizardData.phone.trim()) {
        alert('Inserisci il telefono');
        return;
      }
      
      // Validazione email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(wizardData.email)) {
        alert('Inserisci un\'email valida');
        return;
      }
    }
    
    if (currentWizardStep < 3) {
      setCurrentWizardStep(prev => prev + 1);
    }
  };

  const prevWizardStep = () => {
    if (currentWizardStep > 1) {
      setCurrentWizardStep(prev => prev - 1);
    }
  };

  const submitWizard = () => {
    // Validazione finale
    if (!wizardData.privacyAccepted) {
      alert('Devi accettare l\'informativa sulla privacy per procedere');
      return;
    }
    
    // Qui implementeresti la logica per inviare i dati
    console.log('Dati del wizard:', wizardData);
    alert('Richiesta inviata con successo!');
    closeBookingModal();
  };

  // Funzione per aprire il modale delle date
  const openDatesModal = () => {
    setIsDatesModalOpen(true);
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  };

  // Funzione per chiudere il modale delle date
  const closeDatesModal = () => {
    setIsDatesModalOpen(false);
    document.body.style.overflow = 'auto'; // Riavvia lo scroll della pagina
  };

  // Funzione per aprire il modale dell'immagine
  const openImageModal = (imageSrc, imageAlt) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
    setIsImageModalOpen(true);
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  };

  // Funzione per chiudere il modale dell'immagine
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Riavvia lo scroll della pagina
  };

  // Funzione per gestire l'espansione delle sezioni su mobile
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
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
    for (let i = 1; i <= 5; i++) {
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

  // Funzione per ottenere le immagini del carosello
  const getCarouselImages = () => {
    if (!tour) return [];
    
    const carouselImages = [];
    
    // Aggiungi le immagini del carosello se esistono
    for (let i = 1; i <= 3; i++) {
      if (tour[`carouselImage${i}`]) {
        carouselImages.push({
          src: TourService.getTourImageUrl(tour.id, `carousel${i}`),
          alt: `${tour.title} - Carosello ${i}`,
          index: i
        });
      }
    }
    
    return carouselImages;
  };

  // Funzione per ottenere l'immagine della cartina
  const getMapImage = () => {
    if (!tour || !tour.mapImage) return null;
    
    return {
      src: TourService.getTourImageUrl(tour.id, 'map'),
      alt: `${tour.title} - Cartina Itinerario`
    };
  };

  // Funzione per creare le immagini dei servizi inclusi
  const getHighlightImages = () => {
    // Se è modalità unique, non mostrare immagini dal carousel
    if (tour?.includedMode === 'unique' || (tour?.includedText && tour.includedText.trim() !== '')) {
      return [];
    }
    
    if (!tour || !tour.included || !Array.isArray(tour.included)) return [];
    
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
    // Se è modalità unique, non fare scorrimento automatico
    if (tour?.includedMode === 'unique' || (tour?.includedText && tour.includedText.trim() !== '')) return;
    
    if (!tour || !tour.included || !Array.isArray(tour.included)) return;
    
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
        
        // Debug: verifica il campo itinerarioMode
        if (data) {
          console.log('=== DEBUG TOUR DATA LOADED ===');
          console.log('tour.itinerarioMode:', data.itinerarioMode);
          console.log('tour.itinerario_mode:', data.itinerario_mode);
          console.log('All tour keys:', Object.keys(data));
          console.log('Full tour object:', JSON.stringify(data, null, 2));
          console.log('================================');
        }
        
        // Imposta l'anno selezionato al primo anno disponibile
        if (data && data.dates) {
          const availableYears = Object.keys(data.dates)
            .map(year => parseInt(year))
            .sort((a, b) => a - b);
          if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
          }
        }
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

  // Gestisce la classe body-modal-open per nascondere il chatbot
  useEffect(() => {
    if (isBookingModalOpen || isDatesModalOpen || isImageModalOpen) {
      document.body.classList.add('body-modal-open');
    } else {
      document.body.classList.remove('body-modal-open');
    }

    // Cleanup: rimuovi la classe quando il componente si smonta
    return () => {
      document.body.classList.remove('body-modal-open');
    };
  }, [isBookingModalOpen, isDatesModalOpen, isImageModalOpen]);

  // Gestisce il tasto ESC per chiudere il modale dell'immagine
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        closeImageModal();
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isImageModalOpen]);

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
  const carouselImages = getCarouselImages();
  const rawMapImage = getMapImage();
  const mapImage = (() => {
    if (rawMapImage) {
      return rawMapImage;
    }
    if (tourImages.length > 0 && tourImages[0]) {
      return {
        src: tourImages[0].src,
        alt: tourImages[0].alt || tour.title
      };
    }
    return null;
  })();

  return (
    <div className="tour-details">
      <PageTitle title={tour.title} />
      {/* Hero Section - Clean Image Gallery */}
      {/*<section className="tour-hero-masonry">
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
      </section>*/}

      {/* Tour Overview Section */}
      <section className="tour-overview-section">
        <div className="container-overview">
          <div className="overview-content">
            {/* Left Column - Overview Text */}
              <div className="overview-header">
                <h1 className="overview-title">{tour.title}</h1>
              </div>
              <div className="overview-description">
                <p>{tour.description}</p>                
              </div>
              {mapImage && (
                <div className="overview-map-mobile">
                  <img
                    src={mapImage.src}
                    alt={mapImage.alt || `${tour.title} - Cartina Itinerario`}
                    onClick={() => openImageModal(mapImage.src, mapImage.alt || `${tour.title} - Cartina Itinerario`)}
                  />
                </div>
              )}
              {/* Three Images Row - Carousel Images */}
              {carouselImages.length > 0 && (
                <div className="overview-images-row">
                  {carouselImages.slice(0, 3).map((image, index) => (
                    <div key={index} className="overview-image-item">
                      <img 
                        src={image.src} 
                        alt={image.alt || `${tour.title} - Carosello ${index + 1}`}
                        onClick={() => openImageModal(image.src, image.alt || `${tour.title} - Carosello ${index + 1}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
           
          </div>
          
        </div>
         {/* Right Column - Map Image */}
         {mapImage && (
            <div className="overview-image-container">
              <img 
                src={mapImage.src} 
                alt={mapImage.alt || `${tour.title} - Cartina Itinerario`} 
                className="overview-single-image"
                onClick={() => openImageModal(mapImage.src, mapImage.alt || `${tour.title} - Cartina Itinerario`)}
              />
            </div>
          )}
      </section>

      <div className="container-details">
        <div className="tour-content">
          {/* Left Column - Main Content */}
          <div className="tour-main">
            {/* Tour Information */}
            <section className="tour-section">
              <h2 className="section-title">Informazioni Tour</h2>
              <div className="tour-info-container">
                <div className="tour-info-grid">
                  <div className="info-item">
                    <span className="info-label">Destinazione:</span>
                    <span className="info-value">{tour.destination}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tipo Viaggio:</span>
                    <span className="info-value">{tour.type}</span>
                  </div>
                  {tour.duration && (
                    <div className="info-item">
                      <span className="info-label">Durata:</span>
                      <span className="info-value">{tour.duration}</span>
                    </div>
                  )}
                  {tour.minPrice && (
                    <div className="info-item">
                      <span className="info-label">Prezzo Minimo:</span>
                      <span className="info-value">€{tour.minPrice}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Codice:</span>
                    <span className="info-value">{tour.code}</span>
                  </div>
                  {tour.pasti && (
                    <div className="info-item">
                      <span className="info-label">Pasti:</span>
                      <span className="info-value">{tour.pasti}</span>
                    </div>
                  )}
                </div>
                <div className="tour-pdf-section">
                  {tour.pdfUrl ? (
                    <button 
                      className="pdf-download-btn" 
                      onClick={() => {
                        // Se pdfUrl è un booleano true, costruisci l'URL usando TourService
                        const pdfUrl = typeof tour.pdfUrl === 'boolean' && tour.pdfUrl
                          ? TourService.getTourPdfUrl(tour.id)
                          : tour.pdfUrl;
                        window.open(pdfUrl || '#', '_blank');
                      }}
                    >
                      <i className="fa-solid fa-file-pdf"></i>
                      <span>Scarica PDF</span>
                    </button>
                  ) : (
                    <button className="pdf-download-btn pdf-download-btn-disabled" disabled>
                      <i className="fa-solid fa-file-pdf"></i>
                      <span>PDF non disponibile</span>
                    </button>
                  )}
                </div>
              </div>
            </section>
            {/* Itinerary */}
            {(() => {
              // Se ha il campo itinerario (testo unico), mostra quello
              // Altrimenti, se ha il program con giorni, mostra la suddivisione per giorni
              
              if (tour?.itinerario && tour.itinerario.trim() !== '') {
                // Modalità unique: mostra il testo unico
                return (
                  <section className="tour-section">
                    <h2 className="section-title">Itinerario</h2>
                    <div className={`info-content ${expandedSections.itinerario ? 'expanded' : 'collapsed'}`}>
                      <div style={{ whiteSpace: 'pre-line' }}>{tour.itinerario}</div>
                    </div>
                    <button 
                      className="read-more-btn"
                      onClick={() => toggleSection('itinerario')}
                    >
                      {expandedSections.itinerario ? (
                        <>
                          <span>Leggi di meno</span>
                          <i className="fa-solid fa-chevron-up"></i>
                        </>
                      ) : (
                        <>
                          <span>Leggi di più</span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </>
                      )}
                    </button>
                  </section>
                );
              } 
              // Altrimenti, se ha il program con giorni, mostra la suddivisione per giorni
              else if (tour?.program && tour.program.days && tour.program.days.length > 0) {
                return (
                  <section className="tour-section">
                    <h2 className="section-title">Itinerario</h2>
                    <div className="itinerary-list">
                      {tour.program.days.map((day, index) => {
                        const dayNumber = day.day;
                        return (
                          <div key={index} className="itinerary-item">
                            <div className="itinerary-item-header">
                              <div className="day-badge">Giorno {dayNumber}</div>
                              <div className="day-content">
                                <h3 className="day-title">{day.title}</h3>
                              </div>
                            </div>
                            <div className="itinerary-details">
                              <p className="day-description">
                                {day.description || "Descrizione dettagliata non disponibile per questo giorno."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              }
              // Se non ha né itinerario né program, non mostra nulla
              return null;
            })()}

            {/* Tour Highlights Carousel */}
          {(tour.included && tour.included.length > 0 && tour.includedMode !== 'unique') && (
              <section className="tour-section">
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
                        <img 
                          src={highlight.image} 
                          alt={highlight.alt}
                          onClick={() => openImageModal(highlight.image, highlight.alt)}
                        />
                        <div className="highlight-overlay">
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
            {(() => {
              // Se è modalità unique, mostra il testo unico
              if (tour?.includedMode === 'unique' && tour?.includedText && tour.includedText.trim() !== '') {
                return (
                  <section className="tour-section">
                    <h2 className="section-title">Servizi Inclusi</h2>
                    <div className={`info-content ${expandedSections.included ? 'expanded' : 'collapsed'}`}>
                      <div style={{ whiteSpace: 'pre-line' }}>{tour.includedText}</div>
                    </div>
                    <button 
                      className="read-more-btn"
                      onClick={() => toggleSection('included')}
                    >
                      {expandedSections.included ? (
                        <>
                          <span>Leggi di meno</span>
                          <i className="fa-solid fa-chevron-up"></i>
                        </>
                      ) : (
                        <>
                          <span>Leggi di più</span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </>
                      )}
                    </button>
                  </section>
                );
              }
              // Altrimenti, se ha la lista, mostra quella
              else if (tour?.included && Array.isArray(tour.included) && tour.included.length > 0) {
                return (
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
                );
              }
              return null;
            })()}

            {/* Exclusions */}
            {(() => {
              // Se è modalità unique, mostra il testo unico
              if (tour?.notIncludedMode === 'unique' && tour?.notIncludedText && tour.notIncludedText.trim() !== '') {
                return (
                  <section className="tour-section">
                    <h2 className="section-title">Servizi Non Inclusi</h2>
                    <div className={`info-content ${expandedSections.notIncluded ? 'expanded' : 'collapsed'}`}>
                      <div style={{ whiteSpace: 'pre-line' }}>{tour.notIncludedText}</div>
                    </div>
                    <button 
                      className="read-more-btn"
                      onClick={() => toggleSection('notIncluded')}
                    >
                      {expandedSections.notIncluded ? (
                        <>
                          <span>Leggi di meno</span>
                          <i className="fa-solid fa-chevron-up"></i>
                        </>
                      ) : (
                        <>
                          <span>Leggi di più</span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </>
                      )}
                    </button>
                  </section>
                );
              }
              // Altrimenti, se ha la lista, mostra quella
              else if (tour?.notIncluded && Array.isArray(tour.notIncluded) && tour.notIncluded.length > 0) {
                return (
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
                );
              }
              return null;
            })()}

            {/* Notes */}
            {tour.notes && (
              <section className="tour-section">
                <h2 className="section-title">Note Importanti</h2>
                <div className={`info-content ${expandedSections.notes ? 'expanded' : 'collapsed'}`}>
                  <p>{tour.notes}</p>
                </div>
                <button 
                  className="read-more-btn"
                  onClick={() => toggleSection('notes')}
                >
                  {expandedSections.notes ? (
                    <>
                      <span>Leggi di meno</span>
                      <i className="fa-solid fa-chevron-up"></i>
                    </>
                  ) : (
                    <>
                      <span>Leggi di più</span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </>
                  )}
                </button>
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

            {/* Floating Button per Date - Posizionato qui per il sticky behavior */}
            <button 
              className="floating-dates-button"
              onClick={openDatesModal}
            >
              <i className="fa-solid fa-calendar-days"></i>
              Date disponibili
            </button>
          </div>

          {/* Right Column - Dates & Prices */}
          <div className="tour-sidebar">
            <div className="dates-prices-section">
            <h2 className="section-title">Date disponibili</h2>
              {/*<h2 className="dates-prices-title">Dates & Prices</h2>*/}
              
              {/* Se è modalità unique, mostra il testo unico */}
              {tour?.datesMode === 'unique' && tour?.datesText && tour.datesText.trim() !== '' ? (
                <div className="info-content">
                  <div style={{ whiteSpace: 'pre-line' }}>{tour.datesText}</div>
                </div>
              ) : (
                <>
                  {/* Year Selection */}
                  {getAvailableYears().length > 0 && (
                    <div className="year-selection">
                      {getAvailableYears().map((year, index) => (
                        <button 
                          key={year}
                          className={`year-button ${selectedYear === year ? 'active' : ''}`}
                          onClick={() => handleYearChange(year)}
                          id={index === 0 ? 'first-year' : index === getAvailableYears().length - 1 ? 'last-year' : `year-${year}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="pricing-disclaimer">
                    A partire da €{getMinPrice().toLocaleString()} per persona.
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
                          RICHIEDI
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
              {/* Wizard Progress Bar */}
              <div className="wizard-progress">
                <div className="wizard-steps">
                  <div className={`wizard-step ${currentWizardStep >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Dettagli Viaggio</span>
                  </div>
                  <div className={`wizard-step ${currentWizardStep >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Dati di Contatto</span>
                  </div>
                  <div className={`wizard-step ${currentWizardStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Conferma</span>
                  </div>
                </div>
              </div>

              {/* Wizard Content */}
              <div className="wizard-content">
                {/* Step 1: Dettagli Viaggio */}
                {currentWizardStep === 1 && (
                  <div className="wizard-step-content">
                    <h3>Dettagli Viaggio</h3>
                    
                    <div className="booking-form-group">
                      <label htmlFor="departure-date">Data di partenza *</label>
                      <DatePicker
                        id="departure-date"
                        selected={(() => {
                          // Converte la stringa data in oggetto Date
                          if (wizardData.departureDate) {
                            const dateMatch = wizardData.departureDate.match(/^(\d{4}-\d{2}-\d{2})/);
                            if (dateMatch) {
                              const date = new Date(dateMatch[1]);
                              return isNaN(date.getTime()) ? null : date;
                            }
                            // Se è già nel formato YYYY-MM-DD
                            if (/^\d{4}-\d{2}-\d{2}$/.test(wizardData.departureDate)) {
                              const date = new Date(wizardData.departureDate);
                              return isNaN(date.getTime()) ? null : date;
                            }
                          }
                          return null;
                        })()}
                        onChange={(date) => {
                          // Converte l'oggetto Date in stringa YYYY-MM-DD
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            handleWizardDataChange('departureDate', `${year}-${month}-${day}`);
                          } else {
                            handleWizardDataChange('departureDate', '');
                          }
                        }}
                        minDate={new Date()}
                        locale={it}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Seleziona una data"
                        className="booking-form-input"
                        wrapperClassName="date-picker-wrapper"
                        required
                        autoComplete='off'
                        isClearable
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                      />
                    </div>
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="adults">Numero adulti *</label>
                        <select 
                          id="adults" 
                          className="booking-form-select" 
                          value={wizardData.adults}
                          onChange={(e) => handleWizardDataChange('adults', parseInt(e.target.value))}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="children">Numero bambini (&lt;16 anni)</label>
                        <select 
                          id="children" 
                          className="booking-form-select" 
                          value={wizardData.children}
                          onChange={(e) => handleWizardDataChange('children', parseInt(e.target.value))}
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {wizardData.children > 0 && (
                      <div className="booking-form-group">
                        <label htmlFor="child-age">Età bambini</label>
                        <input 
                          type="text" 
                          id="child-age" 
                          className="booking-form-input" 
                          placeholder="Es. 8, 12"
                          value={wizardData.childAge}
                          onChange={(e) => handleWizardDataChange('childAge', e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="single-rooms">Camere singole</label>
                        <select 
                          id="single-rooms" 
                          className="booking-form-select" 
                          value={wizardData.singleRooms}
                          onChange={(e) => handleWizardDataChange('singleRooms', parseInt(e.target.value))}
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="double-rooms">Camere doppie</label>
                        <select 
                          id="double-rooms" 
                          className="booking-form-select" 
                          value={wizardData.doubleRooms}
                          onChange={(e) => handleWizardDataChange('doubleRooms', parseInt(e.target.value))}
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="triple-rooms">Camere triple</label>
                        <select 
                          id="triple-rooms" 
                          className="booking-form-select" 
                          value={wizardData.tripleRooms}
                          onChange={(e) => handleWizardDataChange('tripleRooms', parseInt(e.target.value))}
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="quadruple-rooms">Camere quadruple</label>
                        <select 
                          id="quadruple-rooms" 
                          className="booking-form-select" 
                          value={wizardData.quadrupleRooms}
                          onChange={(e) => handleWizardDataChange('quadrupleRooms', parseInt(e.target.value))}
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="booking-form-group">
                      <label htmlFor="comments">Note aggiuntive</label>
                      <textarea 
                        id="comments" 
                        className="booking-form-textarea" 
                        rows="3"
                        placeholder="Richieste speciali, preferenze alimentari, ecc."
                        value={wizardData.comments}
                        onChange={(e) => handleWizardDataChange('comments', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 2: Dati di Contatto */}
                {currentWizardStep === 2 && (
                  <div className="wizard-step-content">
                    <h3>Dati di Contatto</h3>
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="first-name">Nome *</label>
                        <input 
                          type="text" 
                          id="first-name" 
                          className="booking-form-input" 
                          value={wizardData.firstName}
                          onChange={(e) => handleWizardDataChange('firstName', e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="last-name">Cognome *</label>
                        <input 
                          type="text" 
                          id="last-name" 
                          className="booking-form-input" 
                          value={wizardData.lastName}
                          onChange={(e) => handleWizardDataChange('lastName', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="booking-form-group">
                      <label htmlFor="citizenship">Cittadinanza *</label>
                      <input 
                        type="text" 
                        id="citizenship" 
                        className="booking-form-input" 
                        value={wizardData.citizenship}
                        onChange={(e) => handleWizardDataChange('citizenship', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="booking-form-group">
                      <label htmlFor="address">Indirizzo</label>
                      <input 
                        type="text" 
                        id="address" 
                        className="booking-form-input" 
                        value={wizardData.address}
                        onChange={(e) => handleWizardDataChange('address', e.target.value)}
                      />
                    </div>
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="city">Città</label>
                        <input 
                          type="text" 
                          id="city" 
                          className="booking-form-input" 
                          value={wizardData.city}
                          onChange={(e) => handleWizardDataChange('city', e.target.value)}
                        />
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="postal-code">Codice Postale</label>
                        <input 
                          type="text" 
                          id="postal-code" 
                          className="booking-form-input" 
                          value={wizardData.postalCode}
                          onChange={(e) => handleWizardDataChange('postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="booking-form-group">
                      <label htmlFor="country">Paese</label>
                      <input 
                        type="text" 
                        id="country" 
                        className="booking-form-input" 
                        value={wizardData.country}
                        onChange={(e) => handleWizardDataChange('country', e.target.value)}
                      />
                    </div>
                    
                    <div className="booking-form-row-preventivo">
                      <div className="booking-form-group">
                        <label htmlFor="email">Email *</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="booking-form-input" 
                          value={wizardData.email}
                          onChange={(e) => handleWizardDataChange('email', e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="booking-form-group">
                        <label htmlFor="phone">Telefono *</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          className="booking-form-input" 
                          value={wizardData.phone}
                          onChange={(e) => handleWizardDataChange('phone', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Conferma */}
                {currentWizardStep === 3 && (
                  <div className="wizard-step-content">
                    <h3>Conferma e Privacy</h3>
                    
                    <div className="confirmation-summary">
                      <h4>Riepilogo Richiesta</h4>
                      <div className="summary-item">
                        <strong>Codice Viaggio:</strong> {tour?.code || 'Nessun codice disponibile'}
                      </div>
                      <div className="summary-item">
                        <strong>Data:</strong> {wizardData.departureDate || 'Non specificata'}
                      </div>
                      <div className="summary-item">
                        <strong>Partecipanti:</strong> {wizardData.adults} adulti
                        {wizardData.children > 0 && `, ${wizardData.children} bambini`}
                      </div>
                      <div className="summary-item">
                        <strong>Contatto:</strong> {wizardData.firstName} {wizardData.lastName}
                      </div>
                      <div className="summary-item">
                        <strong>Email:</strong> {wizardData.email}
                      </div>
                    </div>
                    
                    <div className="privacy-checkbox-container">
                      <label className="privacy-checkbox-label">
                        <input 
                          type="checkbox" 
                          className="privacy-checkbox" 
                          checked={wizardData.privacyAccepted}
                          onChange={(e) => handleWizardDataChange('privacyAccepted', e.target.checked)}
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
                  </div>
                )}
              </div>

              {/* Wizard Actions */}
              <div className="wizard-actions">
                {currentWizardStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={prevWizardStep}>
                    <i className="fa-solid fa-arrow-left"></i>
                    Indietro
                  </button>
                )}
                
                {currentWizardStep < 3 ? (
                  <button type="button" className="btn-primary" onClick={nextWizardStep}>
                    Avanti
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={submitWizard}
                    disabled={!wizardData.privacyAccepted}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    Invia Richiesta
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modale delle Date */}
      {isDatesModalOpen && (
        <div className="dates-modal-overlay" onClick={closeDatesModal}>
          <div className="dates-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dates-modal-header">
              <h2>Date disponibili</h2>
              <button className="dates-modal-close" onClick={closeDatesModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="dates-modal-content">
              {/* Se è modalità unique, mostra il testo unico */}
              {tour?.datesMode === 'unique' && tour?.datesText && tour.datesText.trim() !== '' ? (
                <div className="info-content">
                  <div style={{ whiteSpace: 'pre-line' }}>{tour.datesText}</div>
                </div>
              ) : (
                <>
                  {/* Year Selection */}
                  {getAvailableYears().length > 0 && (
                    <div className="year-selection">
                      {getAvailableYears().map((year, index) => (
                        <button 
                          key={year}
                          className={`year-button ${selectedYear === year ? 'active' : ''}`}
                          onClick={() => handleYearChange(year)}
                          id={index === 0 ? 'first-year' : index === getAvailableYears().length - 1 ? 'last-year' : `year-${year}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="pricing-disclaimer">
                    A partire da €{getMinPrice().toLocaleString()} per persona.
                  </p>
                  
                  {/* Tour Dates List */}
                  <div className="tour-dates-list">
                    {tourDates[selectedYear]?.map((dateInfo, index) => (
                      <div key={index} className="date-row">
                        <div className="date-info">
                          <span className="date-range">{dateInfo.dateRange}</span>
                        </div>
                        <button 
                          className="availability-button"
                          onClick={() => {
                            handleBookingClick(dateInfo.dateRange);
                            closeDatesModal();
                          }}
                        >
                          RICHIEDI
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>
              <i className="fa-solid fa-times"></i>
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="image-modal-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetails; 