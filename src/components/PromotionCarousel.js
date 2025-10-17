import React, { useState, useEffect, useRef } from 'react';
/*import { Link } from 'react-router-dom';*/
import TourService from '../services/TourService';
import './PromotionCarousel.css';

const PromotionCarousel = ({ itemsPerPage = 6 }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragCurrent, setDragCurrent] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentTransform, setCurrentTransform] = useState(0);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [animationStartTime, setAnimationStartTime] = useState(Date.now());
  const [manualOffset, setManualOffset] = useState(0);
  const scrollRef = useRef(null);

  // Carica i tour dal backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await TourService.getPromotionTours();
        setTours(data);
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Gestione drag/swipe
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setIsPaused(true);
    setDragStart(e.clientX);
    setDragCurrent(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setDragStart(e.touches[0].clientX);
    setDragCurrent(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newDragCurrent = e.touches[0].clientX;
    setDragCurrent(newDragCurrent);
    const dragDistance = newDragCurrent - dragStart;
    setCurrentTransform(manualOffset + dragDistance);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    
    const dragDistance = dragCurrent - dragStart;
    const newManualOffset = manualOffset + dragDistance;
    setManualOffset(newManualOffset);
    setCurrentTransform(newManualOffset);
    setAnimationStartTime(Date.now());
  };

  // Evita click accidentali dopo un drag: se movimento oltre soglia, blocca click fino al mouseup
  const clickBlockRef = useRef(false);

  useEffect(() => {
    if (!isDragging) {
      // sblocca il click al termine del drag nel prossimo tick
      const t = setTimeout(() => { clickBlockRef.current = false; }, 0);
      return () => clearTimeout(t);
    }
  }, [isDragging]);

  const handleGlobalMouseMove = (e) => {
    if (isDragging) {
      const newDragCurrent = e.clientX;
      if (Math.abs(newDragCurrent - dragStart) > 5) {
        clickBlockRef.current = true;
      }
      setDragCurrent(newDragCurrent);
      const dragDistance = newDragCurrent - dragStart;
      setCurrentTransform(manualOffset + dragDistance);
    }
  };

  const handleGlobalMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false);
      const dragDistance = dragCurrent - dragStart;
      const newManualOffset = manualOffset + dragDistance;
      setManualOffset(newManualOffset);
      setCurrentTransform(newManualOffset);
      setAnimationStartTime(Date.now());
    }
  };

  // Pausa al hover/touch (senza drag)
  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsPaused(false);
    }
  };

  // Event listeners globali per il drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, dragCurrent, manualOffset]);

  // Duplica i tour per creare l'effetto infinito
  const duplicatedTours = [...tours, ...tours, ...tours];

  if (loading) {
    return (
      <div className="promotion-carousel-container">
        <div className="promotion-loading">
          <div className="loading-spinner"></div>
          <p>Caricamento viaggi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promotion-carousel-container">
        <div className="promotion-error">
          <h3>Errore nel caricamento</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="promotion-carousel-container">
        <div className="no-tours-message">
          <h3>Nessun viaggio disponibile</h3>
          <p>Al momento non ci sono viaggi da mostrare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promotion-carousel-container">
      {/* Container del carosello */}
      <div 
        className="promotion-carousel-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scroller orizzontale infinito */}
        <div 
          ref={scrollRef}
          className={`promotion-horizontal-scroll ${isPaused ? 'paused' : ''} ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isDragging ? `translateX(${currentTransform}px)` : undefined,
            cursor: isDragging ? 'grabbing' : 'grab',
            '--manual-offset': `${manualOffset}px`
          }}
        >
          {duplicatedTours.map((tour, index) => (
            <div key={`${tour.id}-${index}`} className="promotion-tour-card">
              <div className="tour-card-image">
                {tour.heroImage ? (
                  <img 
                    src={TourService.getTourImageUrl(tour.id, 'hero')}
                    alt={tour.title}
                    loading="lazy"
                  />
                ) : (
                  <img 
                    src="/images/copertina.jpeg" 
                    alt={tour.title}
                    loading="lazy"
                  />
                )}
                <div className="tour-card-overlay">
                  <div className="tour-card-price">€{tour.minPrice || 0}</div>
                </div>
              </div>
              
              <div className="tour-card-content">
                <h3 className="tour-card-title">{tour.title}</h3>
                <p className="tour-card-description">
                  {tour.description?.length > 120 
                    ? `${tour.description.substring(0, 120)}...` 
                    : tour.description
                  }
                </p>
                
                <div className="tour-card-meta">
                  <div className="tour-duration">
                    <strong>Durata:</strong> {tour.duration ? `${tour.duration} giorni` : 'Variabile'}
                  </div>
                  <div className="tour-price">
                    <strong>A partire da:</strong> €{tour.minPrice || 0}
                  </div>
                 {/*} {tour.pasti && (
                    <div className="tour-meals">
                      <strong>Pasti:</strong> {tour.pasti}
                    </div>
                  )}*/}
                 {/*} {tour.itinerario && (
                    <div className="tour-itinerary">
                      <strong>Itinerario:</strong> {tour.itinerario}
                    </div>
                  )}*/}
                  <div className="tour-type">
                    {tour.type || 'Tour'}
                  </div>
                </div>
                
                <a href={`/tour/${tour.code}`} className="tour-card-button">
                  Scopri Viaggio
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Indicatore di drag */}
        <div className="drag-indicator">
          <i className="fa-solid fa-hand"></i> Trascina per scorrere
        </div>

        {/* Indicatore di pausa */}
        {isPaused && (
          <div className="pause-indicator">
            <i className="fa-solid fa-pause"></i>
          </div>
        )}
      </div>

      {/* Link per vedere tutte le promozioni */}
      <div className="promotions-link-container">
        <a href="/promozioni" className="options-cta">
          Vedi tutti i Viaggi in Primo Piano
        </a>
      </div>
    </div>
  );
};

export default PromotionCarousel;
