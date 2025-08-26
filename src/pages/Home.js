import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Stati per i caroselli delle immagini
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Stato per il carousel delle destinazioni
  const [destinationCarouselIndex, setDestinationCarouselIndex] = useState(0);

  // Riferimento e stato visibilità form contatti
  const contactRef = useRef(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  // Refs per gestione sticky/fade della hero
  const heroSectionRef = useRef(null);
  const heroActionsRef = useRef(null);
  const [isHeroFaded, setIsHeroFaded] = useState(false);
  const [isHeroFixed, setIsHeroFixed] = useState(false);

  // Video hero iniziale
  const heroVideos = [
    '/images/video1.mp4',
    '/images/video2.mp4',
    '/images/video3.mp4',
    '/images/video4.mp4',
    '/images/video5.mp4'
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length);
    }, 7000);
    return () => clearInterval(intervalId);
  }, [heroVideos.length]);

  // Effetto: blocco fixed centrato e fade quando il bottom della sezione supera i pulsanti
  useEffect(() => {
    const handleScroll = () => {
      const section = heroSectionRef.current;
      const actions = heroActionsRef.current;
      if (!section || !actions) return;
      const sectionRect = section.getBoundingClientRect();
      const actionsRect = actions.getBoundingClientRect();
      
      // Fissa il blocco al centro quando la sezione è in viewport (parte superiore passata) ma non ancora uscita dal basso
      const shouldFix = sectionRect.top <= 0 && sectionRect.bottom > 100;
      if (shouldFix !== isHeroFixed) setIsHeroFixed(shouldFix);

      // Attiva il fade quando il bottom della sezione video raggiunge i bottoni
      const OFFSET = 0; // px di anticipo/ritardo
      const shouldFade = sectionRect.bottom <= (actionsRect.bottom + OFFSET);
      if (shouldFade !== isHeroFaded) setIsHeroFaded(shouldFade);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHeroFaded, isHeroFixed]);

  const destinations = [
    {
      name: 'USA',
      images: ['/images/usa.jpg', '/images/usa-parks.jpg', '/images/north-america3.jpg'],
      country: 'usa',
      description: 'Dalle grandi città ai parchi nazionali iconici.',
      shortDesc: 'Parchi, metropoli e strade leggendarie'
    },
    {
      name: 'Canada',
      images: ['/images/north-america.jpg', '/images/north-america3.jpg', '/images/usa-parks.jpg'],
      country: 'canada',
      description: 'Natura immensa, città moderne e cultura accogliente.',
      shortDesc: 'Natura maestosa e città vivibili'
    },
    {
      name: 'Messico',
      images: ['/images/mexico.jpg', '/images/mexico.jpg', '/images/mexico.jpg'],
      country: 'messico',
      description: 'Spiagge caraibiche da sogno, antiche rovine Maya immerse nella giungla e città dal cuore pulsante: il Messico è un mix esplosivo di storia, cultura e natura. Tra mercati colorati, piatti che profumano di spezie e tradizioni che raccontano secoli di civiltà, ogni angolo sorprende e conquista. Dai templi di Chichén Itzá alle acque cristalline di Tulum, fino alle feste che trasformano le strade in un tripudio di musica e colori, il Messico è un viaggio che unisce relax, avventura ed emozioni autentiche.',
      shortDesc: 'Cultura millenaria e mare da sogno'
    },
    {
      name: 'America Centrale',
      images: ['/images/north-america3.jpg', '/images/usa-parks.jpg', '/images/north-america.jpg'],
      country: 'america-centrale',
      description: 'Foreste pluviali, vulcani e oceani a due passi.',
      shortDesc: 'Avventura tra giungle e oceani'
    },
    {
      name: 'Sud America',
      images: ['/images/usa-parks.jpg', '/images/north-america3.jpg', '/images/north-america.jpg'],
      country: 'sud-america',
      description: 'Paesaggi epici e tradizioni senza tempo.',
      shortDesc: 'Grandi spazi e culture intense'
    },
    {
      name: 'Caraibi',
      images: ['/images/mexico.jpg', '/images/usa-parks.jpg', '/images/north-america3.jpg'],
      country: 'caraibi',
      description: 'Isole da cartolina, mare cristallino e relax.',
      shortDesc: 'Isole da sogno e acque turchesi'
    },
    {
      name: 'Polinesia Francese',
      images: ['/images/north-america3.jpg', '/images/usa-parks.jpg', '/images/north-america.jpg'],
      country: 'polinesia-francese',
      description: 'Lagune turchesi e bungalow sull’acqua.',
      shortDesc: 'Paradiso tropicale esclusivo'
    }
  ];

  // Inizializza le chiavi per gli indici immagini in base alle destinazioni
  useEffect(() => {
    setCurrentImageIndex(prev => {
      const next = { ...prev };
      destinations.forEach(d => {
        if (typeof next[d.country] !== 'number') next[d.country] = 0;
      });
      return next;
    });
  }, [destinations.length]);

  // Auto-scroll generico per i caroselli delle immagini
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const updated = { ...prev };
        destinations.forEach(d => {
          const len = d.images.length || 1;
          const key = d.country;
          const currentVal = typeof prev[key] === 'number' ? prev[key] : 0;
          updated[key] = (currentVal + 1) % len;
        });
        return updated;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [destinations]);

  // IntersectionObserver per mostrare/nascondere la CTA flottante
  useEffect(() => {
    const element = contactRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsContactVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver per reveal delle sezioni
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.2 }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToContact = () => {
    const element = contactRef.current;
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('all-destinations');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Funzione per cambiare immagine manualmente
  const changeImage = (destination, direction) => {
    // Normalizza eventuali camelCase in kebab-case (es. northAmerica -> north-america)
    const normalizedDestination = destination.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    const destData = destinations.find(
      (d) => d.country === destination || d.country === normalizedDestination
    );
    if (!destData) return;

    const maxIndex = destData.images.length - 1;

    setCurrentImageIndex((prev) => {
      const current = typeof prev[destination] === 'number' ? prev[destination] : 0;
      return {
        ...prev,
        [destination]:
          direction === 'next'
            ? current + 1 > maxIndex
              ? 0
              : current + 1
            : current - 1 < 0
            ? maxIndex
            : current - 1,
      };
    });
  };

  // Funzioni per il carousel delle destinazioni
  const nextDestinations = () => {
    setDestinationCarouselIndex(prev => 
      (prev + 1) % destinations.length
    );
  };

  const prevDestinations = () => {
    setDestinationCarouselIndex(prev => 
      prev === 0 ? destinations.length - 1 : prev - 1
    );
  };

  // Ottenere le 3 destinazioni correnti per il carousel
  const getCurrentDestinations = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (destinationCarouselIndex + i) % destinations.length;
      result.push(destinations[index]);
    }
    return result;
  };

  // Componente Carousel personalizzato per le immagini
  const ImageCarousel = ({ images, destination, className = "", showControls = true }) => {
    const currentIndex = currentImageIndex[destination] || 0;
    
    return (
      <div className={`image-carousel ${className}`}>
        <div 
          className="carousel-container"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`${destination} ${index + 1}`}
              className="carousel-image"
            />
          ))}
        </div>
        
        {showControls && (
          <>
            <button 
              className="carousel-btn prev-btn"
              onClick={() => changeImage(destination, 'prev')}
            >
              ‹
            </button>
            <button 
              className="carousel-btn next-btn"
              onClick={() => changeImage(destination, 'next')}
            >
              ›
            </button>
            
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(prev => ({ ...prev, [destination]: index }))}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="home">
      {/* Sezione Hero Video */}
      <section ref={heroSectionRef} id="hero-videos" className="hero-videos" aria-label="Video introduttivi">
        <video
          key={currentHeroIndex}
          className="hero-video"
          src={heroVideos[currentHeroIndex]}
          autoPlay
          muted
          playsInline
          onEnded={() => setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length)}
        />
        <div className="hero-overlay" />
        <div className={`hero-content ${isHeroFixed ? 'is-fixed' : ''} ${isHeroFaded ? 'fade-out' : ''}`}>
          <div className="hero-text">
            <h1 className="hero-title">Viaggi su misura, emozioni autentiche</h1>
            <p className="hero-subtitle">Scopri le nostre destinazioni d'eccellenza in tutto il mondo</p>
          </div>
          <div ref={heroActionsRef} className="hero-actions">
            <button className="hero-cta" onClick={scrollToDestinations}>
              Scopri Destinazioni
            </button>
            <button className="hero-cta ghost" onClick={scrollToContact}>
              Richiedi Info
            </button>
          </div>
        </div>
      </section>

      {/* Sezione Intro con fade-up */}
      <section className="intro-section reveal-on-scroll" aria-label="Presentazione">
        <div className="intro-container">
          <h2 className="intro-title">Viaggiare con Go2West</h2>
          <p className="intro-text">
            Con Go2West ogni viaggio diventa un’<strong>esperienza indimenticabile</strong>. Proponiamo 
            <strong> itinerari curati nei minimi dettagli</strong>, dalle <strong>metropoli più iconiche</strong> ai 
            <strong> paesaggi naturali più spettacolari</strong>, per offrirti <strong>vacanze che lasciano il segno</strong>.
            Con la nostra esperienza e passione, trasformiamo ogni destinazione in un ricordo da portare per sempre con te.
          </p>
        </div>
      </section>

      {/* Sezione Opzioni di Viaggio - layout a puzzle con reveal */}
      <section className="travel-options-section">
        <div className="options-header reveal-on-scroll">
          <h2>Le nostre proposte</h2>
          <p>Scegli lo stile di viaggio che ti rispecchia di più.</p>
        </div>
        <div className="options-grid two-by-two">
          {/* Riga 1: 2/5 + 3/5 */}
          <div className="option-card photo r1c1 reveal-on-scroll" style={{ backgroundImage: "url('/images/city.jpg')" }} data-dir="vertical">
            <div className="option-overlay">
              <h3>City Breaks</h3>
              <p>Itinerari completi, guide esperte e zero pensieri.</p>
              <Link to="/destination/usa" className="explore-btn">Scopri</Link>
            </div>
          </div>
          <div className="option-card photo r1c2 reveal-on-scroll" style={{ backgroundImage: "url('/images/drive.jpg')" }} data-dir="horizontal">
            <div className="option-overlay">
              <h3>Fly & Drive</h3>
              <p>Auto a noleggio e libertà totale di esplorare.</p>
              <Link to="/destination/usa" className="explore-btn">Scopri</Link>
            </div>
          </div>

          {/* Riga 2 invertita: 3/5 + 2/5 */}
          <div className="option-card photo r2c1 reveal-on-scroll" style={{ backgroundImage: "url('/images/ride_in_harley.jpg')" }} data-dir="vertical">
            <div className="option-overlay">
              <h3>Ride in Harley</h3>
              <p>Itinerari completi, guide esperte e zero pensieri.</p>
              <Link to="/destination/canada" className="explore-btn">Scopri</Link>
            </div>
          </div>
          <div className="option-card photo r2c2 reveal-on-scroll" style={{ backgroundImage: "url('/images/tour.jpg')" }} data-dir="horizontal">
            <div className="option-overlay">
              <h3>Tour Guidati</h3>
              <p>Avventure tra parchi e fauna selvatica.</p>
              <Link to="/destination/america-centrale" className="explore-btn">Scopri</Link>
            </div>
          </div>
        </div>
        <div className="options-footer reveal-on-scroll">
          <button className="options-cta" onClick={scrollToDestinations}>
            Scopri tutte le nostre opzioni di viaggio
          </button>
        </div>
      </section>

      {/* Nuova Hero Section Polinesia */}
      <section className="polynesia-hero">
        <div className="polynesia-hero-image">
          <img src="/images/polinesia.jpg" alt="Polinesia Francese - Paradiso tropicale" />
        </div>
        <div className="polynesia-hero-overlay" />
        <div className="polynesia-hero-content">
          <h2 className="polynesia-hero-title">Dove i sogni diventano realtà</h2>
          <p className="polynesia-hero-subtitle">Scopri la magia della Polinesia Francese, dove ogni atollo racconta una storia di bellezza infinita</p>
          <button className="polynesia-hero-cta" onClick={scrollToDestinations}>
            Esplora Destinazioni
          </button>
        </div>
      </section>

      {/* Cartolina Messico (reintrodotta) */}
      {(() => {
        const mexico = destinations.find(d => d.country === 'messico');
        if (!mexico) return null;
        return (
          <section className="postcard-mexico">
            <div className="postcard-container">
              <div className="destination-wide-card postcard">
                <div className="wide-content">
                  <div className="wide-images">
                    <ImageCarousel 
                      images={mexico.images}
                      destination={`${mexico.country}-postcard`}
                      className="wide-carousel"
                    />
                  </div>
                  <div className="wide-text">
                    <h2>{mexico.name}</h2>
                    <p>{mexico.description}</p>
                    <Link to={`/destination/${mexico.country}`} className="explore-btn">
                      Scopri {mexico.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Sezione Tutte le Destinazioni - Carousel Intelligente */}
      <section id="all-destinations" className="all-destinations-section">
        <div className="section-header">
          <h2>Tutte le Destinazioni</h2>
          <p>Esplora la nostra collezione completa di destinazioni esclusive</p>
        </div>

        <div className="all-destinations-container">
          <div className="destinations-carousel-container">
          <button 
            className="destination-nav-btn prev-destinations"
            onClick={prevDestinations}
          >
            ‹
          </button>

          <div className="destinations-carousel-content">
            {getCurrentDestinations().map((destination, position) => {
              // Posizione 0: Stile Australia (card larga con dettagli)
              if (position === 0) {
                return (
                  <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card australia-style">
                    <div className="card-image">
                      <ImageCarousel 
                        images={[destination.images[0]]} 
                        destination={destination.country}
                        className="australia-main-carousel"
                        showControls={false}
                      />
                      <div className="floating-info">
                        <h3 className="dest-title">{destination.name}</h3>
                      </div>
                    </div>
                    <div className="card-details">
                      <div className="detail-images">
                        <ImageCarousel 
                          images={destination.images.slice(1)} 
                          destination={`${destination.country}-detail`}
                          className="australia-detail-carousel"
                          showControls={false}
                        />
                      </div>
                      <div className="card-text">
                        <p>{destination.description}</p>
                      </div>
                    </div>
                    <Link to={`/destination/${destination.country}`} className="explore-btn image-cta">
                      Scopri {destination.name}
                    </Link>
                  </div>
                );
              }
              
              // Posizione 1: Stile Mexico (overlay scuro)
              if (position === 1) {
                return (
                  <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card mexico-style">
                    <ImageCarousel 
                      images={destination.images} 
                      destination={`${destination.country}-mexico`}
                      className="mexico-carousel"
                      showControls={false}
                    />
                     <div className="card-overlay-content">
                      <h3 className="dest-title">{destination.name}</h3>
                      <p>{destination.shortDesc}</p>
                      {/*<div className="experience-mini">
                        {destination.experiences.slice(0, 3).map((exp, idx) => (
                          <span key={idx}>{exp}</span>
                        ))}
                      </div>*/}
                      <Link to={`/destination/${destination.country}`} className="explore-btn image-cta">
                        Scopri {destination.name}
                      </Link>
                    </div>
                  </div>
                );
              }
              
              // Posizione 2: Stile USA (carousel con testo sotto)
              return (
                <div key={`${destination.country}-${destinationCarouselIndex}-${position}`} className="destination-card usa-style">
                  <div className="usa-carousel-grid">
                    <div className="usa-carousel-wrapper">
                      <ImageCarousel 
                        images={destination.images} 
                        destination={`${destination.country}-usa`}
                        className="usa-carousel"
                        showControls={false}
                      />
                        <div className="usa-overlay">
                          <h3 className="dest-title">{destination.name}</h3>
                        </div>
                    </div>
                    <div className="usa-text">
                      <p>{destination.shortDesc}</p>
                    </div>
                      <Link to={`/destination/${destination.country}`} className="explore-btn image-cta">
                        Scopri {destination.name}
                      </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            className="destination-nav-btn next-destinations"
            onClick={nextDestinations}
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {destinations.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === destinationCarouselIndex ? 'active' : ''}`}
              onClick={() => setDestinationCarouselIndex(index)}
            />
          ))}
        </div>
        </div>
      </section>

      {/* Sezione Contatti - Bacheca da Viaggio */}
      <section className="contact-section" id="contact" ref={contactRef}>
        <div className="contact-container">
          <img src="/images/pin.png" alt="" aria-hidden="true" className="contact-pin" />
          <div className="contact-header">
            <h2>Richiedi Informazioni</h2>
            <p>Compila il form per essere ricontattato dal nostro team</p>
          </div>
          
          <div className="contact-bulletin-board">
            {/* Colonna sinistra rimossa - ora il form occupa tutta la larghezza */}
            
            {/* Form principale - ora occupa tutta la larghezza */}
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome e Cognome</label>
                    <input type="text" placeholder="Mario Rossi" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="mario@example.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefono</label>
                    <input type="tel" placeholder="+39 333 1234567" />
                  </div>
                  <div className="form-group">
                    <label>Destinazione d'interesse</label>
                    <select defaultValue="">
                      <option value="" disabled>Seleziona una destinazione</option>
                      {destinations.map((d) => (
                        <option key={d.country} value={d.country}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Messaggio</label>
                  <textarea rows="4" placeholder="Raccontaci cosa stai cercando..." />
                </div>
                <button type="submit" className="submit-btn">Invia Richiesta</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA flottante */}
      <button 
        className={`floating-cta ${isContactVisible ? 'hide' : 'show'}`}
        onClick={scrollToContact}
        aria-label="Vai al form contatti"
      >
        Richiedi Info
      </button>

      {/* Sezione Statistiche e Info */}
      {/*
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>150+</h3>
            <p>Destinazioni Esclusive</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Clienti Soddisfatti</p>
          </div>
          <div className="stat-item">
            <h3>25</h3>
            <p>Anni di Esperienza</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Supporto Dedicato</p>
          </div>
        </div>
      </section>
      */}
      {/* Sezione CTA Finale */}
      {/*
      <section className="final-cta">
        <div className="cta-content">
          <h2>Pronti per la prossima avventura?</h2>
          <p>I nostri esperti sono qui per creare l'esperienza di viaggio perfetta per i vostri clienti</p>
          <div className="cta-buttons">
            <Link to="/destination/united-states" className="primary-cta">
              Richiedi Consulenza
            </Link>
            <Link to="/destination/kenya" className="secondary-cta">
              Sfoglia Catalogo
            </Link>
          </div>
        </div>
      </section>
      */}
    </div>
  );
};

export default Home; 