import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  // Stati per i caroselli delle immagini
  const [currentTeamImage, setCurrentTeamImage] = useState(0);
  const [currentStoryImage, setCurrentStoryImage] = useState(0);
  const [currentValuesImage, setCurrentValuesImage] = useState(0);

  // Array delle immagini per i caroselli
  const teamImages = ['ny1.jpg', 'ny2.jpg', 'ny3.jpg', 'ny4.jpg'];
  const storyImages = ['drive.jpg', 'drive2.jpg', 'drive3.jpg', 'drive4.jpg'];
  const valuesImages = ['city.jpg', 'tour.jpg', 'ride_in_harley.jpg', 'kenya.jpg'];

  // Auto-scroll per i caroselli
  useEffect(() => {
    const teamInterval = setInterval(() => {
      setCurrentTeamImage(prev => (prev + 1) % teamImages.length);
    }, 4000);

    const storyInterval = setInterval(() => {
      setCurrentStoryImage(prev => (prev + 1) % storyImages.length);
    }, 5000);

    const valuesInterval = setInterval(() => {
      setCurrentValuesImage(prev => (prev + 1) % valuesImages.length);
    }, 6000);

    return () => {
      clearInterval(teamInterval);
      clearInterval(storyInterval);
      clearInterval(valuesInterval);
    };
  }, [teamImages.length, storyImages.length, valuesImages.length]);

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
    const element = document.getElementById('contact');
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-image">
          <img src="/images/argentina.jpg" alt="Go2West - La nostra storia" />
        </div>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1 className="about-hero-title">Chi Siamo</h1>
          <p className="about-hero-subtitle">
            La passione per i viaggi che ci guida ogni giorno nel creare esperienze indimenticabili
          </p>
        </div>
      </section>

      {/* Sezione La Nostra Storia */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-image">
            <div className="story-carousel">
              <div className="carousel-container">
                {storyImages.map((image, index) => (
                  <img
                    key={index}
                    src={`/images/${image}`}
                    alt={`La nostra storia - Immagine ${index + 1}`}
                    className={`carousel-image ${index === currentStoryImage ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="carousel-indicators">
                {storyImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentStoryImage ? 'active' : ''}`}
                    onClick={() => setCurrentStoryImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="story-content">
            <h2 className="story-title">La Nostra Storia</h2>
            <p className="story-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="story-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="story-text">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </div>
      </section>

      {/* Sezione I Nostri Valori */}
      <section className="values-section">
        <div className="values-header reveal-on-scroll">
          <h2>I Nostri Valori</h2>
          <p>I principi che guidano ogni nostra scelta e ogni viaggio che proponiamo</p>
        </div>
        
        <div className="values-grid">
          <div className="value-card reveal-on-scroll">
            <div className="value-icon">
              <i className="fa-solid fa-heart"></i>
            </div>
            <h3>Passione</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          <div className="value-card reveal-on-scroll">
            <div className="value-icon">
              <i className="fa-solid fa-star"></i>
            </div>
            <h3>Qualità</h3>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          
          <div className="value-card reveal-on-scroll">
            <div className="value-icon">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h3>Fiducia</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
          
          <div className="value-card reveal-on-scroll">
            <div className="value-icon">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3>Esperienza</h3>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </section>

      {/* Sezione Il Nostro Team */}
      <section className="team-section">
        <div className="team-container">
          <div className="team-content">
            <h2 className="team-title">Il Nostro Team</h2>
            <p className="team-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="team-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="team-stats">
              <div className="stat-item">
                <h3>25+</h3>
                <p>Anni di Esperienza</p>
              </div>
              <div className="stat-item">
                <h3>150+</h3>
                <p>Destinazioni</p>
              </div>
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Clienti Soddisfatti</p>
              </div>
            </div>
          </div>
          
          <div className="team-image">
            <div className="team-carousel">
              <div className="carousel-container">
                {teamImages.map((image, index) => (
                  <img
                    key={index}
                    src={`/images/${image}`}
                    alt={`Il nostro team - Immagine ${index + 1}`}
                    className={`carousel-image ${index === currentTeamImage ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="carousel-indicators">
                {teamImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentTeamImage ? 'active' : ''}`}
                    onClick={() => setCurrentTeamImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione La Nostra Missione */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-image">
            <div className="mission-carousel">
              <div className="carousel-container">
                {valuesImages.map((image, index) => (
                  <img
                    key={index}
                    src={`/images/${image}`}
                    alt={`La nostra missione - Immagine ${index + 1}`}
                    className={`carousel-image ${index === currentValuesImage ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="carousel-indicators">
                {valuesImages.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentValuesImage ? 'active' : ''}`}
                    onClick={() => setCurrentValuesImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mission-content">
            <h2 className="mission-title">La Nostra Missione</h2>
            <p className="mission-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mission-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="mission-cta">
              <button className="mission-btn" onClick={scrollToContact}>
                Contattaci
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Perché Sceglierci */}
      <section className="why-choose-section">
        <div className="why-choose-header reveal-on-scroll">
          <h2>Perché Scegliere Go2West</h2>
          <p>Ecco cosa ci rende diversi e speciali nel mondo dei viaggi</p>
        </div>
        
        <div className="why-choose-grid">
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-map-marked-alt"></i>
            </div>
            <h3>Itinerari Personalizzati</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-shield-alt"></i>
            </div>
            <h3>Assistenza 24/7</h3>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <h3>Prezzi Trasparenti</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <h3>Guide Esperte</h3>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </section>

      {/* Sezione Contatti */}
      <section className="about-contact-section" id="contact">
        <div className="about-contact-container">
          <img src="/images/pin.png" alt="" aria-hidden="true" className="contact-pin" />
          <div className="about-contact-header">
            <h2>Inizia il Tuo Viaggio con Noi</h2>
            <p>Contattaci per ricevere informazioni personalizzate e creare insieme la tua prossima avventura</p>
          </div>
          
          <div className="about-contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>Info: <a href="mailto:info@go2west.org" className="about-contact-link">info@go2west.org</a></p>
                  <p>Preventivi: <a href="mailto:preventivi@go2west.org" className="about-contact-link">preventivi@go2west.org</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h4>Telefono</h4>
                  <p><a href="tel:+39056428595" className="about-contact-link">+39 0564 28595</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <i className="fa-solid fa-map-marker-alt"></i>
                <div>
                  <h4>Indirizzo</h4>
                  <p>Via Damiano Chiesa 7D<br />58100 Grosseto (GR) ITALIA</p>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container-about">
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

      {/* CTA Finale */}
      {/*<section className="about-cta-section">
        <div className="about-cta-container">
          <h2>Pronto per la tua prossima avventura?</h2>
          <p>Scopri le nostre destinazioni e inizia a pianificare il viaggio dei tuoi sogni</p>
          <div className="about-cta-buttons">
            
            
          </div>
        </div>
      </section>*/}

      <section className="promotions-cta">
      <div className="promotions-cta-hero-image">
          <img src="/images/plane.jpg" alt="Aereo" />
        </div>
        <div className="promotions-cta-hero-content">
        <h2>Pronto per la tua prossima avventura?</h2>
        <p>Scopri le nostre destinazioni e inizia a pianificare il viaggio dei tuoi sogni</p>
          <div className="cta-buttons">
          <Link to="/#destinations-showcase-new" className="primary-cta">
              Scopri Destinazioni
            </Link>
            <button className="secondary-cta" onClick={scrollToContact}>
              Contattaci
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
