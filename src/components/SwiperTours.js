import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TourService from '../services/TourService';
import './SwiperTours.css';

const SwiperTours = ({ itemsPerPage = 6 }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const swiperRef = useRef(null);

  // Carica i tour dal backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await TourService.getAllTours();
        setTours(data.slice(0, itemsPerPage)); // Limita al numero di tour richiesti
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [itemsPerPage]);

  // Gestisce l'interazione dell'utente
  const handleUserInteraction = () => {
    setIsUserInteracting(true);
    // Riavvia l'autoplay dopo 10 secondi di inattività
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 10000);
  };

  // Gestisce il cambio slide (senza scroll su mobile)
  const handleSlideChange = () => {
    handleUserInteraction();
    // Scroll disabilitato per mobile - solo gestione interazione utente
  };

  if (loading) {
    return (
      <div className="swiper-tours-container">
        <div className="swiper-loading">
          <div className="loading-spinner"></div>
          <p>Caricamento viaggi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="swiper-tours-container">
        <div className="swiper-error">
          <h3>Errore nel caricamento</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="swiper-tours-container">
        <div className="no-tours-message">
          <h3>Nessun viaggio disponibile</h3>
          <p>Al momento non ci sono viaggi da mostrare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swiper-tours-container">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        centeredSlides={false}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        autoplay={!isUserInteracting ? {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        loop={tours.length > 1}
        speed={600}
        onTouchStart={handleUserInteraction}
        onSlideChange={handleSlideChange}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 15,
          },
          480: {
            slidesPerView: 1.3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.1,
            spaceBetween: 25,
          }
        }}
        className="swiper-tours"
      >
        {tours.map((tour, index) => (
          <SwiperSlide key={tour.id || index}>
            <div className="swiper-tour-card">
              <div className="tour-card-image">
                <img 
                  src={tour.heroImage ? TourService.getTourImageUrl(tour.id, 'hero') : '/images/placeholder.jpg'} 
                  alt={tour.title}
                  loading="lazy"
                />
                <div className="tour-card-overlay">
                  <div className="tour-card-price">€{tour.minPrice || 0}</div>
                  <div className="tour-card-badge">
                    {tour.type || 'Tour'}
                  </div>
                </div>
              </div>
              
              <div className="tour-card-content">
                <h3 className="tour-card-title">{tour.title}</h3>
                <p className="tour-card-description">
                  {tour.description?.length > 100 
                    ? `${tour.description.substring(0, 100)}...` 
                    : tour.description
                  }
                </p>
                
                <div className="tour-card-meta">
                  <div className="tour-duration">
                    {/*<span className="meta-icon"></span>*/}
                    {tour.duration ? `${tour.duration}` : 'Durata variabile'}
                  </div>
                  <div className="tour-location">
                    {/*<span className="meta-icon">📍</span>*/}
                    {tour.destination || 'Destinazione'}
                  </div>
                  {tour.pasti && (
                    <div className="tour-meals">
                      <span className="meta-icon">🍽️</span>
                      <strong>Pasti:</strong> {tour.pasti}
                    </div>
                  )}
                  {tour.itinerario && (
                    <div className="tour-itinerary">
                      <span className="meta-icon">🗺️</span>
                      <strong>Itinerario:</strong> {tour.itinerario}
                    </div>
                  )}
                </div>
                
                <Link to={`/tour/${tour.code}`} className="tour-card-button">
                  Scopri Viaggio
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigazione personalizzata */}
      <div className="swiper-navigation">
        <button className="swiper-button-prev-custom">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="swiper-button-next-custom">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Paginazione personalizzata */}
      {/*<div className="swiper-pagination-custom"></div>*/}
    </div>
  );
};

export default SwiperTours;
