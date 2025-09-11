import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DynamicTours from '../components/DynamicTours';
import MasonryTours from '../components/MasonryTours';
import { destinations, destinationImages } from '../config/destinations';
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
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true);

  // Stato e logica Modale selezione destinazione/viaggio
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTravelType, setSelectedTravelType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [pendingTravelType, setPendingTravelType] = useState('');

  // Stati per i caroselli della sezione orizzontale
  const [currentLeftImage, setCurrentLeftImage] = useState(0);
  const [currentRightImage, setCurrentRightImage] = useState(0);

  // Stato per il carosello della Polinesia
  const [currentPolynesiaImage, setCurrentPolynesiaImage] = useState(0);

  // Stati per i caroselli delle destinazioni showcase (metodo Polinesia)
  const [currentUSAImage, setCurrentUSAImage] = useState(0);
  const [currentCanadaImage, setCurrentCanadaImage] = useState(0);
  const [currentMexicoImage, setCurrentMexicoImage] = useState(0);
  const [currentAmericaCentraleImage, setCurrentAmericaCentraleImage] = useState(0);
  const [currentSudAmericaImage, setCurrentSudAmericaImage] = useState(0);
  const [currentCaraibiImage, setCurrentCaraibiImage] = useState(0);
  const [currentPolinesiaImage, setCurrentPolinesiaImage] = useState(0);

  const openTravelModal = (travelTypeSlug) => {
    setPendingTravelType(travelTypeSlug);
    setSelectedTravelType(travelTypeSlug);
    document.body.classList.add('body-modal-open');
    setIsModalOpen(true);
  };

  const closeTravelModal = () => {
    setIsModalOpen(false);
    setSelectedCountry('');
    document.body.classList.remove('body-modal-open');
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
  
  // Gestione del cambio automatico dei video
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length);
    }, 7000);
    return () => clearInterval(intervalId);
  }, [heroVideos.length]);

  // Gestione del preload e controllo dei video
  useEffect(() => {
    const videos = document.querySelectorAll('.home-hero-video');
    videos.forEach((video, index) => {
      if (index === currentHeroIndex) {
        video.play().catch(console.error);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentHeroIndex]);

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

      // Gestisce la visibilità della freccia di scroll
      // La freccia scompare quando si inizia a scrollare (top della sezione < 0)
      // e riappare quando la hero è completamente visibile (top >= 0)
      const shouldShowIndicator = sectionRect.top >= 0;
      if (shouldShowIndicator !== isScrollIndicatorVisible) {
        setIsScrollIndicatorVisible(shouldShowIndicator);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHeroFaded, isHeroFixed, isScrollIndicatorVisible]);

  // Array delle immagini per i caroselli della sezione orizzontale
  const leftImages = ['ny2.jpg', 'ny5.jpg', 'ny6.jpg', 'ny7.jpg'];
  const rightImages = ['ny1.jpg', 'ny3.jpg', 'ny4.jpg', 'city.jpg'];

  // Array delle immagini per i caroselli (metodo Polinesia) - ora dalla configurazione condivisa
  const polynesiaImages = destinationImages['polinesia-francese'];
  const usaImages = destinationImages['usa'];
  const canadaImages = destinationImages['canada'];
  const mexicoImages = destinationImages['messico'];
  const americaCentraleImages = destinationImages['america-centrale'];
  const sudAmericaImages = destinationImages['sud-america'];
  const caraibiImages = destinationImages['caraibi'];
  const polinesiaDestImages = destinationImages['polinesia-francese'];

  // Auto-scroll per i caroselli della sezione orizzontale
  useEffect(() => {
    const leftInterval = setInterval(() => {
      setCurrentLeftImage(prev => (prev + 1) % leftImages.length);
    }, 4000);

    const rightInterval = setInterval(() => {
      setCurrentRightImage(prev => (prev + 1) % rightImages.length);
    }, 5000);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, [leftImages.length, rightImages.length]);

  // Auto-scroll per il carosello della Polinesia
  useEffect(() => {
    const polynesiaInterval = setInterval(() => {
      setCurrentPolynesiaImage(prev => (prev + 1) % polynesiaImages.length);
    }, 6000);

    return () => {
      clearInterval(polynesiaInterval);
    };
  }, [polynesiaImages.length]);

  // Destinazioni ora dalla configurazione condivisa - aggiungiamo le proprietà mancanti
  const destinationsWithImages = destinations.map(dest => ({
    ...dest,
    images: destinationImages[dest.country].map(img => `/images/${img}`),
    shortDesc: dest.name === 'USA' ? 'Parchi, metropoli e strade leggendarie' :
               dest.name === 'Canada' ? 'Natura maestosa e città vivibili' :
               dest.name === 'Messico' ? 'Cultura millenaria e mare da sogno' :
               dest.name === 'America Centrale' ? 'Avventura tra giungle e oceani' :
               dest.name === 'Sud America' ? 'Grandi spazi e culture intense' :
               dest.name === 'Caraibi' ? 'Isole da sogno e acque turchesi' :
               'Paradiso tropicale esclusivo'
  }));

  // Auto-scroll per i caroselli delle destinazioni showcase (metodo Polinesia)
  useEffect(() => {
    const usaInterval = setInterval(() => {
      setCurrentUSAImage(prev => (prev + 1) % usaImages.length);
    }, 6000);

    const canadaInterval = setInterval(() => {
      setCurrentCanadaImage(prev => (prev + 1) % canadaImages.length);
    }, 5000);

    const mexicoInterval = setInterval(() => {
      setCurrentMexicoImage(prev => (prev + 1) % mexicoImages.length);
    }, 5000);

    const americaCentraleInterval = setInterval(() => {
      setCurrentAmericaCentraleImage(prev => (prev + 1) % americaCentraleImages.length);
    }, 5000);

    const sudAmericaInterval = setInterval(() => {
      setCurrentSudAmericaImage(prev => (prev + 1) % sudAmericaImages.length);
    }, 5000);

    const caraibiInterval = setInterval(() => {
      setCurrentCaraibiImage(prev => (prev + 1) % caraibiImages.length);
    }, 5000);

    const polinesiaInterval = setInterval(() => {
      setCurrentPolinesiaImage(prev => (prev + 1) % polinesiaDestImages.length);
    }, 5000);

    return () => {
      clearInterval(usaInterval);
      clearInterval(canadaInterval);
      clearInterval(mexicoInterval);
      clearInterval(americaCentraleInterval);
      clearInterval(sudAmericaInterval);
      clearInterval(caraibiInterval);
      clearInterval(polinesiaInterval);
    };
  }, [usaImages.length, canadaImages.length, mexicoImages.length, americaCentraleImages.length, sudAmericaImages.length, caraibiImages.length, polinesiaDestImages.length]);

  // Auto-scroll generico per i caroselli delle immagini (rimosso per evitare conflitti)

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

  const scrollToJourneys = () => {
    const el = document.getElementById('all-destinations');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations-showcase-new');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('.intro-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToNewYork = () => {
    navigate('/destination/usa?filter=new-york');
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


  // Funzione helper per ottenere l'array immagini e l'indice corrente per destinazione
  const getImageData = (country) => {
    switch(country) {
      case 'usa': return { images: usaImages, currentIndex: currentUSAImage };
      case 'canada': return { images: canadaImages, currentIndex: currentCanadaImage };
      case 'messico': return { images: mexicoImages, currentIndex: currentMexicoImage };
      case 'america-centrale': return { images: americaCentraleImages, currentIndex: currentAmericaCentraleImage };
      case 'sud-america': return { images: sudAmericaImages, currentIndex: currentSudAmericaImage };
      case 'caraibi': return { images: caraibiImages, currentIndex: currentCaraibiImage };
      case 'polinesia-francese': return { images: polinesiaDestImages, currentIndex: currentPolinesiaImage };
      default: return { images: [], currentIndex: 0 };
    }
  };

  // Funzioni per i caroselli della sezione orizzontale
  const nextLeftImage = () => {
    setCurrentLeftImage(prev => (prev + 1) % leftImages.length);
  };

  const prevLeftImage = () => {
    setCurrentLeftImage(prev => prev === 0 ? leftImages.length - 1 : prev - 1);
  };

  const nextRightImage = () => {
    setCurrentRightImage(prev => (prev + 1) % rightImages.length);
  };

  const prevRightImage = () => {
    setCurrentRightImage(prev => prev === 0 ? rightImages.length - 1 : prev - 1);
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
        {heroVideos.map((video, index) => (
          <video
            key={index}
            className={`home-hero-video ${index === currentHeroIndex ? 'active' : ''}`}
            src={video}
            autoPlay={index === currentHeroIndex}
            muted
            playsInline
            onEnded={() => setCurrentHeroIndex((prev) => (prev + 1) % heroVideos.length)}
          />
        ))}
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
        
        {/* Freccia di scroll con animazione rimbalzo */}
        <div className={`scroll-indicator ${isScrollIndicatorVisible ? 'visible' : 'hidden'}`}>
          <div className="scroll-arrow" onClick={scrollToNextSection}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Sezione Intro con fade-up */}
      <section className="intro-section reveal-on-scroll" aria-label="Presentazione" style={{ background: '#eefdff' }}>
        {/*<div className="intro-container">
          <h2 className="intro-title">Viaggiare con Go2West</h2>
          <p className="intro-text">
            Con Go2West ogni viaggio diventa un’<strong>esperienza indimenticabile</strong>. Proponiamo 
            <strong> itinerari curati nei minimi dettagli</strong>, dalle <strong>metropoli più iconiche</strong> ai 
            <strong> paesaggi naturali più spettacolari</strong>, per offrirti <strong>vacanze che lasciano il segno</strong>.
            Con la nostra esperienza e passione, trasformiamo ogni destinazione in un ricordo da portare per sempre con te.
          </p>
        </div>*/}
      </section>

      {/* Sezione Orizzontale - Immagini e Testo sullo stesso piano */}
      <section className="horizontal-section" aria-label="La nostra missione">
        <div className="horizontal-container">
          {/* Carosello immagine sinistra - più piccola */}
          <div className="horizontal-image-left">
            <div className="horizontal-carousel">
              <div className="carousel-container">
                {leftImages.map((image, index) => (
                  <img
                    key={index}
                    src={`/images/${image}`}
                    alt={`New York City - Immagine ${index + 1}`}
                    className={`carousel-image ${index === currentLeftImage ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="carousel-indicators">
                {leftImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentLeftImage ? 'active' : ''}`}
                    onClick={() => setCurrentLeftImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Container di testo centrale */}
          <div className="horizontal-text-container" style={{ background: '#eefdff' }}>
            <h2 className="horizontal-title">Viaggiare con Go2West</h2>
            <p className="horizontal-text">
              Ogni destinazione racconta una storia unica, ogni viaggio è un capitolo della tua vita. 
              Con Go2West non ti limitiamo a mostrarti luoghi, ti guidiamo attraverso esperienze che 
              trasformano il modo di vedere il mondo. 
            </p>
            <p className="horizontal-text-secondary">
              Scopri la magia di New York, dove ogni angolo racconta una storia diversa. Dai grattacieli 
              iconici di Manhattan ai quartieri bohémien di Brooklyn, dalla frenesia di Times Square alla 
              tranquillità di Central Park. Lasciati trasportare dall'energia unica di questa città che 
              non dorme mai.
            </p>
            <div className="horizontal-cta">
              <button className="horizontal-cta-btn" onClick={navigateToNewYork}>
                Esplora New York
              </button>
            </div>
          </div>
          
          {/* Carosello immagine destra - più grande */}
          <div className="horizontal-image-right">
            <div className="horizontal-carousel">
              <div className="carousel-container">
                {rightImages.map((image, index) => (
                  <img
                    key={index}
                    src={`/images/${image}`}
                    alt={`New York City - Immagine ${index + 1}`}
                    className={`carousel-image ${index === currentRightImage ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="carousel-indicators">
                {rightImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentRightImage ? 'active' : ''}`}
                    onClick={() => setCurrentRightImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
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
              <p>Alla scoperta delle metropoli più iconiche.</p>
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
              <p>Monta in sella e scopri i territori più suggestivi.</p>
              <span className="explore-btn">Scopri</span>
            </div>
          </div>
          <div onClick={() => openTravelModal('tour-guidati')} className="option-card photo r2c2 reveal-on-scroll" style={{ backgroundImage: "url('/images/tour.jpg')" }} data-dir="horizontal">
            <div className="option-overlay">
              <h3>Tour Guidati</h3>
              <p>Itinerari completi, guide esperte e zero pensieri.</p>
              <span className="explore-btn">Scopri</span>
            </div>
          </div>
        </div>
        <div className="options-footer reveal-on-scroll">
          <button className="options-cta" onClick={scrollToJourneys}>
            Scopri tutte le nostre opzioni di viaggio
          </button>
        </div>
      </section>

      {/* Nuova Hero Section Polinesia */}
      <section className="polynesia-hero">
        <div className="polynesia-hero-image">
          {polynesiaImages.map((image, index) => (
            <img 
              key={index}
              src={`/images/${image}`} 
              alt={`Polinesia Francese - Paradiso tropicale ${index + 1}`}
              className={index === currentPolynesiaImage ? 'active' : ''}
            />
          ))}
        </div>
        <div className="polynesia-hero-overlay" />
        <div className="polynesia-hero-content">
          <h2 className="polynesia-hero-title">Dove i sogni diventano realtà</h2>
          <p className="polynesia-hero-subtitle">Scopri la magia della Polinesia Francese, dove ogni atollo racconta una storia di bellezza infinita</p>
          <button className="polynesia-hero-cta" onClick={scrollToJourneys}>
            Scopri viaggi
          </button>
        </div>
      </section>

      {/* Nuovo Carosello Destinazioni con Hover Cartolina - COMMENTATO */}
      {/*
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
      */}

      {/* Nuova Sezione Destinazioni - Layout A&K Style */}
      <section id="destinations-showcase-new" className="destinations-showcase-new">
        <div className="showcase-header-new">
          <h2>Le nostre destinazioni</h2>
          <p>Scopri i nostri itinerari esclusivi in tutto il mondo</p>
        </div>
        
        <div className="destinations-grid-new">
          {/* Prima riga: USA a larghezza massima */}
          <div className="destination-card-new full-width-card">
            <div className="destination-image-new">
              {usaImages.map((image, index) => (
                <img 
                  key={index}
                  src={`/images/${image}`} 
                  alt={`${destinations[0].name} - Immagine ${index + 1}`}
                  className={`destination-carousel-image ${index === currentUSAImage ? 'active' : ''}`}
                />
              ))}
              <div className="image-overlay">
                <h3>{destinations[0].name}</h3>
              </div>
            </div>
            
            <div className="destination-content-new" style={{ background: '#eefdff' }}>
              <div className="destination-text-content">
                <h3 className="destination-title-new">{destinations[0].name}</h3>
                <p className="destination-description-new">{destinations[0].description}</p>
                <div className="destination-short-new">
                  {/*<span>{destinations[0].shortDesc}</span>*/}
                </div>
              </div>
              <div className="destination-btn-container">
                <Link to={`/destination/${destinations[0].country}`} className="explore-btn">
                  Scopri di più
                </Link>
              </div>
            </div>
          </div>

          {/* Dalle altre destinazioni in poi: layout a due colonne alternato */}
          {destinationsWithImages.slice(1).reduce((rows, destination, index) => {
            const rowIndex = Math.floor(index / 2);
            const isLeftCard = index % 2 === 0;
            const isEvenRow = rowIndex % 2 === 0;
            const cardClass = isEvenRow 
              ? (isLeftCard ? 'wide-card' : 'narrow-card')
              : (isLeftCard ? 'narrow-card' : 'wide-card');
            
            const card = (
              <div key={`${destination.country}-new-${index + 1}`} className={`destination-card-new ${cardClass}`}>
                <div className="destination-image-new">
                  {getImageData(destination.country).images.map((image, index) => (
                    <img 
                      key={index}
                      src={`/images/${image}`} 
                      alt={`${destination.name} - Immagine ${index + 1}`}
                      className={`destination-carousel-image ${index === getImageData(destination.country).currentIndex ? 'active' : ''}`}
                    />
                  ))}
                  <div className="image-overlay">
                    <h3>{destination.name}</h3>
                  </div>
                </div>
                
                <div className="destination-content-new" style={{ background: '#eefdff' }}>
                  <div className="destination-text-content">
                    <h3 className="destination-title-new">{destination.name}</h3>
                    <p className="destination-description-new">{destination.description}</p>
                    <div className="destination-short-new">
                      {/*<span>{destination.shortDesc}</span>*/}
                    </div>
                  </div>
                  <div className="destination-btn-container">
                    <Link to={`/destination/${destination.country}`} className="explore-btn">
                      Scopri di più
                    </Link>
                  </div>
                </div>
              </div>
            );

            if (isLeftCard) {
              // Inizia una nuova riga
              rows.push([card]);
            } else {
              // Aggiungi alla riga esistente
              rows[rows.length - 1].push(card);
            }
            
            return rows;
          }, []).map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="destinations-row">
              {row}
            </div>
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
          <MasonryTours limit={6} />
        </div>
      </section>

      {/* Sezione Contatti - Bacheca da Viaggio */}
      <section className="contact-section" id="contact" ref={contactRef}>
        <div className="contact-container">
          <img src="/images/pin.png" alt="" aria-hidden="true" className="contact-pin" />
          <div className="contact-header">
            <h2>Richiedi Informazioni</h2>
            <p>Compila il form per RICEVERE INFORMAZIONI e/O essere ricontattati dal nostro team</p>
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
                      {destinationsWithImages.map((d) => (
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
                  {destinationsWithImages.map((d) => (
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