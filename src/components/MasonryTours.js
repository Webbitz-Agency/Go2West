import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import TourService from '../services/TourService';
import SwiperTours from './SwiperTours';
import './MasonryTours.css';

const MasonryTours = ({ itemsPerPage = 6 }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const masonryRef = useRef(null);
  const masonryInstance = useRef(null);

  // Rileva se siamo su mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Carica i tour dal backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await TourService.getAllTours();
        setTours(data);
      } catch (err) {
        setError('Errore nel caricamento dei tour: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Calcola il numero totale di pagine
  const totalPages = Math.ceil(tours.length / itemsPerPage);
  
  // Ottieni i tour per la pagina corrente
  const getCurrentPageTours = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tours.slice(startIndex, endIndex);
  };

  // Inizializza Masonry quando i tour cambiano
  useEffect(() => {
    if (masonryRef.current && getCurrentPageTours().length > 0) {
      // Distruggi l'istanza precedente se esiste
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }

      // Crea una nuova istanza Masonry
      masonryInstance.current = new Masonry(masonryRef.current, {
        itemSelector: '.masonry-tour-card',
        columnWidth: '.masonry-tour-card',
        percentPosition: true,
        transitionDuration: '0.3s'
      });

      // Usa imagesLoaded per gestire il caricamento delle immagini
      const imgLoad = imagesLoaded(masonryRef.current);
      
      imgLoad.on('always', () => {
        if (masonryInstance.current) {
          masonryInstance.current.layout();
        }
      });
    }

    return () => {
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }
    };
  }, [currentPage, tours]);

  // Funzione per cambiare pagina con animazione
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || isAnimating) return;

    setIsAnimating(true);
    
    // Fade out
    if (masonryRef.current) {
      masonryRef.current.style.opacity = '0';
      masonryRef.current.style.transform = 'translateY(20px)';
    }

    setTimeout(() => {
      setCurrentPage(newPage);
      
      // Scroll all'inizio della sezione
      const sectionElement = document.getElementById('all-destinations');
      if (sectionElement) {
        sectionElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
      
      // Fade in
      setTimeout(() => {
        if (masonryRef.current) {
          masonryRef.current.style.opacity = '1';
          masonryRef.current.style.transform = 'translateY(0)';
        }
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Vai alla pagina precedente
  const goToPreviousPage = () => {
    changePage(currentPage - 1);
  };

  // Vai alla pagina successiva
  const goToNextPage = () => {
    changePage(currentPage + 1);
  };

  const currentTours = getCurrentPageTours();

  // Mostra Swiper su mobile, Masonry su desktop
  if (isMobile) {
    return <SwiperTours itemsPerPage={itemsPerPage} />;
  }

  if (loading) {
    return (
      <div className="masonry-tours-container">
        <div className="masonry-loading">
          <div className="loading-spinner"></div>
          <p>Caricamento viaggi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="masonry-tours-container">
        <div className="masonry-error">
          <h3>Errore nel caricamento</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="masonry-tours-container">
        <div className="no-tours-message">
          <h3>Nessun viaggio disponibile</h3>
          <p>Al momento non ci sono viaggi da mostrare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-tours-container">
      {/* Griglia Masonry */}
      <div 
        ref={masonryRef}
        className="masonry-grid"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        {currentTours.map((tour, index) => (
          <div key={`${tour.id}-${currentPage}-${index}`} className="masonry-tour-card">
            <div className="tour-card-image">
              <img 
                src={tour.heroImage ? TourService.getTourImageUrl(tour.id, 'hero') : '/images/placeholder.jpg'} 
                alt={tour.title}
                loading="lazy"
              />
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
                  {/*<span className="meta-icon"></span>*/}
                  {tour.duration ? `${tour.duration} giorni` : 'Durata variabile'}
                </div>
                <div className="tour-type">
                  <span className="meta-icon">🏷️</span>
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

      {/* Navigazione Paginazione */}
      {totalPages > 1 && (
        <div className="masonry-pagination">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isAnimating}
            className="pagination-btn prev-btn"
          >
            ←
          </button>
          
          <div className="pagination-info">
            <span className="current-page">{currentPage}</span>
            <span className="separator">di</span>
            <span className="total-pages">{totalPages}</span>
          </div>
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages || isAnimating}
            className="pagination-btn next-btn"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default MasonryTours;
