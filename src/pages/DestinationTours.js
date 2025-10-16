import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import TourService from '../services/TourService';
import DynamicTours from '../components/DynamicTours';
import { destinations, destinationImages } from '../config/destinations';
import './DestinationTours.css';

const DestinationTours = () => {
  const { country } = useParams();
  
  // Refs per gestione sticky/fade della hero
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const [isHeroFaded, setIsHeroFaded] = useState(false);
  const [isHeroFixed, setIsHeroFixed] = useState(false);
  
  // Stato per il carosello hero
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Mappa il parametro URL alla destinazione del database
  const getDestinationFromParam = (param) => {
    const mapping = {
      'usa': 'USA',
      'canada': 'Canada', 
      'messico': 'Messico',
      'america-centrale': 'America Centrale',
      'sud-america': 'Sud America',
      'caraibi': 'Caraibi',
      'polinesia-francese': 'Polinesia Francese'
    };
    return mapping[param] || param;
  };

  // Trova la destinazione corrente
  const currentDestination = destinations.find(d => d.country === country) || destinations[0];
  const destinationParam = getDestinationFromParam(country);
  
  // Ottieni le immagini per la destinazione corrente
  const currentImages = destinationImages[country] || destinationImages['usa'];

  // Auto-scroll per il carosello hero (metodo Polinesia)
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % currentImages.length);
    }, 5000);

    return () => {
      clearInterval(heroInterval);
    };
  }, [currentImages.length]);

  // Effetto: blocco fixed centrato e fade quando il bottom della sezione supera il testo
  useEffect(() => {
    const handleScroll = () => {
      const section = heroSectionRef.current;
      const text = heroTextRef.current;
      if (!section || !text) return;
      const sectionRect = section.getBoundingClientRect();
      const textRect = text.getBoundingClientRect();
      
      // Fissa il blocco al centro quando la sezione è in viewport (parte superiore passata) ma non ancora uscita dal basso
      const shouldFix = sectionRect.top <= 0 && sectionRect.bottom > 100;
      if (shouldFix !== isHeroFixed) setIsHeroFixed(shouldFix);

      // Attiva il fade quando il bottom della sezione immagine raggiunge il testo
      // Aggiungiamo un offset più generoso per evitare riapparizioni
      const OFFSET = 50; // px di anticipo per il fade
      const shouldFade = sectionRect.bottom <= (textRect.bottom + OFFSET);
      
      // Aggiungiamo una condizione extra: se la sezione è completamente fuori dal viewport, forza il fade
      const isSectionCompletelyHidden = sectionRect.bottom <= 0;
      const finalShouldFade = shouldFade || isSectionCompletelyHidden;
      
      if (finalShouldFade !== isHeroFaded) setIsHeroFaded(finalShouldFade);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHeroFaded, isHeroFixed]);

  // Funzione per tornare in cima
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="destination-tours">
      <PageTitle title={currentDestination.name} />
      {/* Hero Section con Carosello */}
      <section ref={heroSectionRef} id="destination-hero" className="hero-top" aria-label={`${currentDestination.name} - Hero`}>
        <div className="hero-background-image">
          {currentImages.map((image, index) => (
            <img 
              key={index}
              src={`/images/${image}`} 
              alt={`${currentDestination.name} - Paesaggio ${index + 1}`}
              className={`hero-carousel-image ${index === currentHeroImage ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className={`hero-content ${isHeroFixed ? 'is-fixed' : ''} ${isHeroFaded ? 'fade-out' : ''}`}>
          <div ref={heroTextRef} className="hero-text">
            <h1 className="destination-hero-title">{currentDestination.name}</h1>
          </div>
        </div>
      </section>

      <div className="container-tours">
        
        {/* Introduzione Destinazione */}
        <section className="destination-intro-section">
          <div className="destination-intro">
            <p className="destination-intro-text">{currentDestination.description}</p>
          </div>
        </section>
        
        {/* Tours Section */}
        <section className="tours-section">
          <DynamicTours destination={destinationParam} showFilters={true} />
        </section>
      </div>
    </div>
  );
};

export default DestinationTours; 