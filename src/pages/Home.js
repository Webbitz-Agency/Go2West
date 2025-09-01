import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DynamicTours from '../components/DynamicTours';
import './Home.css';

const Home = () => {
  // Stati per i caroselli delle immagini
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Stato per il carousel delle destinazioni
  const [destinationCarouselIndex, setDestinationCarouselIndex] = useState(0);
  
  // Stato per il carousel showcase
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Riferimento e stato visibilità form contatti
  const contactRef = useRef(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  // Refs per gestione sticky/fade della hero
  const heroSectionRef = useRef(null);
  const heroActionsRef = useRef(null);
  const [isHeroFaded, setIsHeroFaded] = useState(false);
  const [isHeroFixed, setIsHeroFixed] = useState(false);

  // Stato e logica Modale selezione destinazione/viaggio
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTravelType, setSelectedTravelType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [pendingTravelType, setPendingTravelType] = useState('');

  const openTravelModal = (travelTypeSlug) => {
    setPendingTravelType(travelTypeSlug);
    setSelectedTravelType(travelTypeSlug);
    setIsModalOpen(true);
  };

  const closeTravelModal = () => {
    setIsModalOpen(false);
    setSelectedCountry('');
  };

  const goToSelectedTravel = () => {
    if (!selectedTravelType || !selectedCountry) return;
    navigate(`/travel/${selectedTravelType}/${selectedCountry}`);
    closeTravelModal();
  };

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
      description: 'Dai grattacieli di New York ai canyon dell’Ovest, passando per strade leggendarie come la Route 66: gli Stati Uniti sono un viaggio tra natura estrema, cultura pop e città che non dormono mai..',
      shortDesc: 'Parchi, metropoli e strade leggendarie'
    },
    {
      name: 'Canada',
      images: ['/images/north-america.jpg', '/images/north-america3.jpg', '/images/usa-parks.jpg'],
      country: 'canada',
      description: 'Paesaggi infiniti, laghi cristallini e le maestose Montagne Rocciose: il Canada è la meta perfetta per chi cerca avventura, natura incontaminata e città moderne immerse in scenari mozzafiato.',
      shortDesc: 'Natura maestosa e città vivibili'
    },
    {
      name: 'Messico',
      images: ['/images/mexico.jpg', '/images/mexico.jpg', '/images/mexico.jpg'],
      country: 'messico',
      description: 'Spiagge caraibiche, rovine Maya e tradizioni coloratissime: il Messico è un mix di storia millenaria, paesaggi da cartolina e cucina indimenticabile che conquista tutti i sensi.',
      shortDesc: 'Cultura millenaria e mare da sogno'
    },
    {
      name: 'America Centrale',
      images: ['/images/north-america3.jpg', '/images/usa-parks.jpg', '/images/north-america.jpg'],
      country: 'america-centrale',
      description: 'Un mosaico di paesi pieni di energia: vulcani, foreste tropicali, spiagge spettacolari e città coloniali. L’America Centrale è il cuore vibrante dell’avventura latina, dove natura e cultura si fondono.',
      shortDesc: 'Avventura tra giungle e oceani'
    },
    {
      name: 'Sud America',
      images: ['/images/usa-parks.jpg', '/images/north-america3.jpg', '/images/north-america.jpg'],
      country: 'sud-america',
      description: 'Dal ritmo del samba brasiliano alle cime andine, il Sud America è pura emozione: una terra di contrasti, colori intensi, paesaggi straordinari e popoli accoglienti che regalano esperienze indimenticabili.',
      shortDesc: 'Grandi spazi e culture intense'
    },
    {
      name: 'Caraibi',
      images: ['/images/mexico.jpg', '/images/usa-parks.jpg', '/images/north-america3.jpg'],
      country: 'caraibi',
      description: 'Mare turchese, spiagge di sabbia bianca e atmosfere rilassate: i Caraibi sono il sogno tropicale per eccellenza. Tra isole da esplorare, natura rigogliosa e cultura vivace, il relax è assicurato.',
      shortDesc: 'Isole da sogno e acque turchesi'
    },
    {
      name: 'Polinesia Francese',
      images: ['/images/polinesia.jpg', '/images/usa-parks.jpg', '/images/polinesia.jpg'],
      country: 'polinesia-francese',
      description: 'Lagune turchesi, bungalow sull’acqua e paesaggi da sogno: la Polinesia Francese è il paradiso terrestre, perfetto per chi cerca romanticismo, natura incontaminata e un’esperienza indimenticabile in mezzo all’Oceano Pacifico.',
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
              <i class="fa-solid fa-angle-left"></i>
            </button>
            <button 
              className="carousel-btn next-btn"
              onClick={() => changeImage(destination, 'next')}
            >
              <i class="fa-solid fa-angle-right"></i>
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
      <section ref={heroSectionRef} id="hero-videos" className="home-hero" aria-label="Video introduttivi">
        <video
          key={currentHeroIndex}
          className="home-hero-video"
          src={heroVideos[currentHeroIndex]}
          autoPlay
          muted
          playsInline
          onEnded={() => setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length)}
        />
        <div className="home-hero-overlay" />
        <div className={`home-hero-content ${isHeroFixed ? 'is-fixed' : ''} ${isHeroFaded ? 'fade-out' : ''}`}>
          <div className="home-hero-text">
            <h1 className="home-hero-title">Viaggi su misura, emozioni autentiche</h1>
            <p className="home-hero-subtitle">Scopri le nostre destinazioni d'eccellenza in tutto il mondo</p>
          </div>
          <div ref={heroActionsRef} className="home-hero-actions">
            <button className="home-hero-cta" onClick={scrollToDestinations}>
              Scopri Destinazioni
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
          {/* Card cliccabili come grandi pulsanti */}
          <div onClick={() => openTravelModal('city-breaks')} className="option-card photo r1c1 reveal-on-scroll" style={{ backgroundImage: "url('/images/city.jpg')" }} data-dir="vertical">
            <div className="option-overlay">
              <h3>City Breaks</h3>
              <p>Itinerari completi, guide esperte e zero pensieri.</p>
              <span className="explore-btn">Scopri</span>
            </div>
          </div>
          <div onClick={() => openTravelModal('fly-drive')} className="option-card photo r1c2 reveal-on-scroll" style={{ backgroundImage: "url('/images/drive.jpg')" }} data-dir="horizontal">
            <div className="option-overlay">
              <h3>Fly & Drive</h3>
              <p>Auto a noleggio e libertà totale di esplorare.</p>
              <span className="explore-btn">Scopri</span>
            </div>
          </div>

          {/* Riga 2 */}
          <div onClick={() => openTravelModal('ride-harley')} className="option-card photo r2c1 reveal-on-scroll" style={{ backgroundImage: "url('/images/ride_in_harley.jpg')" }} data-dir="vertical">
            <div className="option-overlay">
              <h3>Ride in Harley</h3>
              <p>Itinerari completi, guide esperte e zero pensieri.</p>
              <span className="explore-btn">Scopri</span>
            </div>
          </div>
          <div onClick={() => openTravelModal('tour-guidati')} className="option-card photo r2c2 reveal-on-scroll" style={{ backgroundImage: "url('/images/tour.jpg')" }} data-dir="horizontal">
            <div className="option-overlay">
              <h3>Tour Guidati</h3>
              <p>Avventure tra parchi e fauna selvatica.</p>
              <span className="explore-btn">Scopri</span>
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

      {/* Nuovo Carosello Destinazioni con Hover Cartolina */}
      <section className="destinations-showcase">
        <div className="showcase-header">
          <h2>Tutte le Destinazioni</h2>
          <p>Scopri i nostri itinerari esclusivi in tutto il mondo</p>
        </div>
        
        <div className="destinations-carousel-showcase">
          <button 
            className="showcase-nav-btn prev-showcase"
            onClick={() => setShowcaseIndex(prev => prev === 0 ? Math.ceil(destinations.length / 4) - 1 : prev - 1)}
          >
            <i class="fa-solid fa-angle-left"></i>
          </button>
          
          <div className="showcase-content">
            {destinations.slice(showcaseIndex * 4, (showcaseIndex * 4) + 4).map((destination, index) => (
              <div key={`${destination.country}-showcase-${index}`} className="destination-showcase-card">
                <div className="card-image">
                  <img src={destination.images[0]} alt={destination.name} />
                  <div className="card-title">
                    <h3>{destination.name}</h3>
                  </div>
                </div>
                
                {/* Cartolina espansa su hover */}
                <div className="card-expanded">
                  <div className="expanded-image">
                    <img src={destination.images[0]} alt={destination.name} />
                  </div>
                  <div className="expanded-content">
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                    <Link to={`/destination/${destination.country}`} className="explore-btn">
                      Scopri
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="showcase-nav-btn next-showcase"
            onClick={() => setShowcaseIndex(prev => (prev + 1) % Math.ceil(destinations.length / 4))}
          >
            <i class="fa-solid fa-angle-right"></i>
          </button>
        </div>
        
        <div className="showcase-dots">
          {Array.from({ length: Math.ceil(destinations.length / 4) }).map((_, index) => (
            <span 
              key={index}
              className={`showcase-dot ${index === showcaseIndex ? 'active' : ''}`}
              onClick={() => setShowcaseIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Sezione Descrittiva - Non un viaggio qualsiasi */}
      <section className="descriptive-section" style={{paddingTop: '0px'}}>
        <div className="descriptive-container">
          <h2>Non un viaggio qualsiasi</h2>
          <p>
            Ogni proposta che trovi su Go2West è pensata per farti scoprire il <strong>meglio di ogni destinazione</strong>, senza stress. 
            Lasciati ispirare, scegli il tuo percorso e preparati a raccogliere <strong>ricordi che dureranno per sempre</strong>.
          </p>
        </div>
      </section>

      {/* Sezione I nostri suggerimenti - Tour Dinamici dal Backend */}
      <section id="all-destinations" className="suggestions-section">
        <div className="section-header">
          <h2>Viaggi su misura</h2>
          <p>Proposte di viaggio curate per esperienze indimenticabili</p>
        </div>

        <div className="suggestions-container">
          <DynamicTours limit={6} />
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
                      <option key="altro" value="altro">Altro</option>
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

      {/* Sezione Descrittiva - Dal sogno alla partenza */}
      <section className="descriptive-section">
        <div className="descriptive-container">
          <h2>Dal sogno alla partenza</h2>
          <p>
            Che tu stia pensando a una <strong>fuga romantica</strong>, a un'<strong>avventura on the road</strong> o a un <strong>viaggio con tutta la famiglia</strong>, 
            con Go2West trasformi il <strong>desiderio in itinerario</strong>. Noi ci occupiamo dei dettagli, tu solo di <strong>viverlo</strong>.
          </p>
        </div>
      </section>

      {/* Hero Finale con Citazione */}
      <section className="quote-hero">
        <div className="quote-hero-image">
          <img src="/images/argentina.jpg" alt="Argentina - Paesaggio mozzafiato" />
        </div>
        <div className="quote-hero-overlay" />
        <div className="quote-hero-content">
          <blockquote className="quote-text">
            "Il mondo è un libro e quelli che non viaggiano ne leggono solo una pagina."
          </blockquote>
          <cite className="quote-author">— Sant'Agostino</cite>
        </div>
      </section>

      {/* Modale Selezione Destinazione/Viaggio */}
      {isModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeTravelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" aria-label="Chiudi" onClick={closeTravelModal}>×</button>
            <h3>Seleziona la destinazione</h3>
            <p>Scegli in quale destinazione vuoi informazioni per questa tipologia di viaggio.</p>
            <div className="modal-form">
              <div className="form-group">
                <label>Tipologia di viaggio</label>
                <select value={selectedTravelType} onChange={(e) => setSelectedTravelType(e.target.value)}>
                  <option value="city-breaks">City Breaks</option>
                  <option value="fly-drive">Fly & Drive</option>
                  <option value="ride-harley">Ride in Harley</option>
                  <option value="tour-guidati">Tour Guidati</option>
                </select>
              </div>
              <div className="form-group">
                <label>Destinazione</label>
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                  <option value="" disabled>Seleziona una destinazione</option>
                  {destinations.map((d) => (
                    <option key={d.country} value={d.country}>{d.name}</option>
                  ))}
                </select>
              </div>
              <button className="submit-btn go-btn" disabled={!selectedCountry} onClick={goToSelectedTravel}>Vai</button>
            </div>
          </div>
        </div>
      )}

      {/* CTA flottante rimosso - ora integrato nell'header */}

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