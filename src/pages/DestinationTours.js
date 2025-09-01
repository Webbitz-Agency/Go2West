import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import TourService from '../services/TourService';
import DynamicTours from '../components/DynamicTours';
import './DestinationTours.css';

const DestinationTours = () => {
  const { country } = useParams();
  
  // Refs per gestione sticky/fade della hero
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const [isHeroFaded, setIsHeroFaded] = useState(false);
  const [isHeroFixed, setIsHeroFixed] = useState(false);
  const destinations = [
    {
      name: 'USA',
      country: 'usa',
      image: '/images/usa.jpg',
      description: 'Dai grattacieli di New York ai canyon dell\'Ovest, passando per strade leggendarie come la Route 66: gli Stati Uniti sono un viaggio tra natura estrema, cultura pop e città che non dormono mai.'
    },
    {
      name: 'Canada',
      country: 'canada',
      image: '/images/north-america.jpg',
      description: 'Paesaggi infiniti, laghi cristallini e le maestose Montagne Rocciose: il Canada è la meta perfetta per chi cerca avventura, natura incontaminata e città moderne immerse in scenari mozzafiato.'
    },
    {
      name: 'Messico',
      country: 'messico',
      image: '/images/mexico.jpg',
      description: 'Spiagge caraibiche, rovine Maya e tradizioni coloratissime: il Messico è un mix di storia millenaria, paesaggi da cartolina e cucina indimenticabile che conquista tutti i sensi.'
    },
    {
      name: 'America Centrale',
      country: 'america-centrale',
      image: '/images/north-america3.jpg',
      description: 'Un mosaico di paesi pieni di energia: vulcani, foreste tropicali, spiagge spettacolari e città coloniali. L\'America Centrale è il cuore vibrante dell\'avventura latina, dove natura e cultura si fondono.'
    },
    {
      name: 'Sud America',
      country: 'sud-america',
      image: '/images/usa-parks.jpg',
      description: 'Dal ritmo del samba brasiliano alle cime andine, il Sud America è pura emozione: una terra di contrasti, colori intensi, paesaggi straordinari e popoli accoglienti che regalano esperienze indimenticabili.'
    },
    {
      name: 'Caraibi',
      country: 'caraibi',
      image: '/images/mexico.jpg',
      description: 'Mare turchese, spiagge di sabbia bianca e atmosfere rilassate: i Caraibi sono il sogno tropicale per eccellenza. Tra isole da esplorare, natura rigogliosa e cultura vivace, il relax è assicurato.'
    },
    {
      name: 'Polinesia Francese',
      country: 'polinesia-francese',
      image: '/images/polinesia.jpg',
      description: 'Lagune turchesi, bungalow sull\'acqua e paesaggi da sogno: la Polinesia Francese è il paradiso terrestre, perfetto per chi cerca romanticismo, natura incontaminata e un\'esperienza indimenticabile in mezzo all\'Oceano Pacifico.'
    }
  ];

  // Trova la destinazione corrente
  const currentDestination = destinations.find(d => d.country === country) || destinations[0];

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
      {/* Hero Section */}
      <section ref={heroSectionRef} id="destination-hero" className="hero-top" aria-label={`${currentDestination.name} - Hero`}>
        <div className="hero-background-image">
          <img src={currentDestination.image} alt={`${currentDestination.name} - Paesaggio`} />
        </div>
        <div className="hero-overlay" />
        <div className={`hero-content ${isHeroFixed ? 'is-fixed' : ''} ${isHeroFaded ? 'fade-out' : ''}`}>
          <div ref={heroTextRef} className="hero-text">
            <h1 className="hero-title">{currentDestination.name}</h1>
            <p className="hero-subtitle">{currentDestination.description}</p>
          </div>
        </div>
      </section>

      <div className="container">
        
        {/* Tours Section */}
        <section className="tours-section">
          <DynamicTours country={country} showFilters={true} />
        </section>
      </div>
    </div>
  );
};

export default DestinationTours; 