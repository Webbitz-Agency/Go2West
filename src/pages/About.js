import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { sendLeadEmail } from '../services/LeadService';
import { trackLeadConversion } from '../utils/conversionTracking';
import './About.css';

const teamMembers = [
  {
    name: 'Raffaello',
    role: 'Manager / Product Manager',
    image: '/images/team/RAFFAELLO.PNG',
    objectPosition: 'center 22%',
    description: 'Scelta e sviluppo del prodotto per le destinazioni offerte.',
    background: 'Background di compagnie aeree (KLM e United) e business Travel (American Express) in Italia e all\'estero.'
  },
  {
    name: 'Daniel',
    role: 'Responsabile Booking',
    image: '/images/team/DANIEL.PNG',
    objectPosition: 'center 20%',
    description: 'Gestione delle piattaforme dei partner e dei processi di prenotazione.',
    background: 'Esperienza in compagnia aerea (Swiss) e business travel in American Express.'
  },
  {
    name: 'Saverio',
    role: 'Sviluppatore Web e AI',
    image: '/images/team/SAVERIO.JPG',
    objectPosition: 'center 18%',
    description: 'Esperto in React e AI, trasforma idee complesse in soluzioni digitali accattivanti e user friendly.',
    background: null
  },
  {
    name: 'Debora',
    role: 'Finance Manager',
    image: '/images/team/DEBORA.PNG',
    objectPosition: 'center 12%',
    description: 'Tiene i conti sotto controllo e la crescita in carreggiata. Mosse intelligenti, mente brillante. Sempre un passo avanti.',
    background: 'Background di tour operating (Cormorano, Eko Africa).'
  }
];

const About = () => {
  // Stati per i caroselli delle immagini
  const [currentStoryImage, setCurrentStoryImage] = useState(0);
  const [currentValuesImage, setCurrentValuesImage] = useState(0);
  const [teamModalMember, setTeamModalMember] = useState(null);
  const [isTouchTeamCards, setIsTouchTeamCards] = useState(false);

  // Array delle immagini per i caroselli
  const storyImages = ['story1.jpg', 'story2.jpg', 'story3.jpg', 'story4.jpg', 'story5.jpg'];
  const valuesImages = ['values1.jpg', 'values2.jpg', 'values3.jpg', 'values4.jpg', 'values5.jpg'];

  // Auto-scroll per i caroselli
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setCurrentStoryImage(prev => (prev + 1) % storyImages.length);
    }, 5000);

    const valuesInterval = setInterval(() => {
      setCurrentValuesImage(prev => (prev + 1) % valuesImages.length);
    }, 6000);

    return () => {
      clearInterval(storyInterval);
      clearInterval(valuesInterval);
    };
  }, [storyImages.length, valuesImages.length]);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    const updateTouchMode = () => setIsTouchTeamCards(mediaQuery.matches);

    updateTouchMode();
    mediaQuery.addEventListener('change', updateTouchMode);
    return () => mediaQuery.removeEventListener('change', updateTouchMode);
  }, []);

  useEffect(() => {
    if (!teamModalMember) return undefined;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setTeamModalMember(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [teamModalMember]);

  const handleTeamCardClick = (member) => {
    if (isTouchTeamCards) {
      setTeamModalMember(member);
    }
  };

  const closeTeamModal = () => {
    setTeamModalMember(null);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="about">
      <PageTitle title="About" />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-image">
          <img src="/images/argentina.jpg" alt="Go2West - La nostra storia" />
        </div>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1 className="about-hero-title">Chi Siamo</h1>
          <p className="about-hero-subtitle">
            Benvenuti in Go2West,
            <br />la vostra porta d'accesso a esperienze di viaggio indimenticabili.
          </p>
        </div>
      </section>

      {/* Sezione La Nostra Storia */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-image">
            <div className="story-carousel">
              <div className="story-carousel-container">
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
               Noi di <strong>Go2West</strong> crediamo che viaggiare sia molto più che visitare posti nuovi: significa creare <strong>ricordi
               indelebili</strong>, entrare in contatto con culture diverse e vivere il mondo in modi che ispirano e trasformano.
             </p>
             <p className="story-text">
               Estensione dell'<strong>esperienza 25ennale</strong> di <strong>EKO Srl</strong>, siamo un team appassionato di esperti di viaggi provenienti
               da compagnie aeree (United Airlines, KLM) e business e leisure travel (American Express, Thomas Cook)
               dedicato alla creazione di <strong>viaggi eccezionali</strong> per ogni tipo di viaggiatore.
             </p>
             <p className="story-text">
               Dal tour organizzato e guidato con <strong>partenze garantite</strong>, alle esperienze più <strong>autentiche</strong> in ranch, glamping, 
               campi tendati, dai soggiorni culturali in città ai tour in auto indipendenti per circuiti all'insegna della 
               natura, delle visite di musei, di percorsi enogastronomici alla scoperta delle ricchezze naturali e culturali 
               del <strong>Nord, Centro e Sud America</strong>, progettiamo <strong>tour personalizzati</strong> che riflettono i tuoi interessi, i tuoi ritmi 
               e i tuoi sogni di viaggio.
             </p>
          </div>
        </div>
      </section>


      {/* Sezione Il Nostro Team */}
      <section className="team-section">
        <div className="team-container">
          <div className="team-content">
            <h2 className="team-title">Il Nostro Team</h2>
            <p className="team-text">
              Il nostro team è composto da <strong>esperti di viaggi</strong> con un background consolidato nelle principali compagnie aeree 
              e nel settore del business e leisure travel. Proveniamo da realtà come <strong>United Airlines</strong>, <strong>KLM</strong>, <strong>American Express </strong> 
              e <strong>Thomas Cook</strong>, portando con noi un'esperienza unica nel settore.
            </p>
            <p className="team-text">
              La nostra <strong>passione per i viaggi</strong> e la profonda conoscenza delle destinazioni che proponiamo ci permettono 
              di creare esperienze <strong>autentiche e memorabili</strong>. Ogni membro del team condivide la stessa visione: trasformare 
              ogni viaggio in <strong>un'avventura straordinaria</strong> che superi le aspettative dei nostri clienti.
            </p>
          </div>
          
          <div className="team-stats-container">
            <div className="team-stat-item experience-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <div className="stat-content">
              <div className="stat-title-container">
                <h3>25+</h3>                
                  <h4>Anni di Esperienza</h4>
                  </div>
                  <p>Un quarto di secolo dedicato alla creazione di viaggi indimenticabili, con competenze acquisite nelle principali compagnie aeree e nel settore del business travel.</p>
              </div>
            </div>
            
            <div className="team-stat-item continents-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-globe-americas"></i>
              </div>
              <div className="stat-content">
              <div className="stat-title-container">
                <h3>3</h3>
                  <h4>Continenti</h4>
                  </div>
                  <p>Nord America, Centro America e Sud America: la nostra specializzazione copre tutto il continente americano con tour personalizzati e esperienze autentiche.</p>
              </div>
            </div>
            
            <div className="team-stat-item dedication-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="stat-content">
              <div className="stat-title-container">
                <h3>100%</h3>
                  <h4>Dedizione</h4>
                  </div>
                  <p>Ogni viaggio è progettato con passione e attenzione ai dettagli, garantendo esperienze che superano le aspettative e creano ricordi indelebili.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Meet the Team */}
      <section className="meet-team-section">
        <div className="meet-team-header reveal-on-scroll">
          <h2>Meet the Team</h2>
          <p>Le persone che rendono possibile ogni viaggio Go2West</p>
        </div>

        <div className={`meet-team-grid ${isTouchTeamCards ? 'meet-team-grid--touch' : ''}`}>
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className={`meet-team-card ${isTouchTeamCards ? 'meet-team-card--touch' : ''}`}
              tabIndex={isTouchTeamCards ? -1 : 0}
              onClick={() => handleTeamCardClick(member)}
              onKeyDown={(event) => {
                if (!isTouchTeamCards && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                }
              }}
              role={isTouchTeamCards ? 'button' : undefined}
              aria-label={isTouchTeamCards ? `Apri dettagli di ${member.name}` : undefined}
            >
              <div className="meet-team-card-body">
                <img
                  src={member.image}
                  alt={member.name}
                  className="meet-team-photo-img"
                  style={{ objectPosition: member.objectPosition || 'center 22%' }}
                  loading="lazy"
                />
                <div className="meet-team-overlay" aria-hidden="true">
                  <div className="meet-team-overlay-content">
                    <span className="meet-team-role">{member.role}</span>
                    <p className="meet-team-description">{member.description}</p>
                    {member.background && (
                      <p className="meet-team-background">{member.background}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="meet-team-namebar">
                <h3>{member.name}</h3>
              </div>
            </article>
          ))}
        </div>

        {teamModalMember && (
          <div
            className="team-modal-backdrop"
            onClick={closeTeamModal}
            role="presentation"
          >
            <div
              className="team-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="team-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="team-modal-close"
                onClick={closeTeamModal}
                aria-label="Chiudi"
              >
                <i className="fa-solid fa-times"></i>
              </button>

              <div className="team-modal-header">
                <img
                  src={teamModalMember.image}
                  alt={teamModalMember.name}
                  className="team-modal-avatar"
                />
                <h3 id="team-modal-title">{teamModalMember.name}</h3>
                <span className="team-modal-role">{teamModalMember.role}</span>
              </div>

              <div className="team-modal-body">
                <p className="team-modal-description">{teamModalMember.description}</p>
                {teamModalMember.background && (
                  <p className="team-modal-background">{teamModalMember.background}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Sezione La Nostra Missione */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-image">
            <div className="mission-carousel">
              <div className="mission-carousel-container">
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
               <strong>Ispirare</strong> e mettere in contatto le persone attraverso i viaggi, offrendo <strong>esperienze arricchenti</strong>, sicure e
               significative che vanno oltre l'ordinario.
             </p>
             <p className="mission-text">
               Ogni viaggio che progettiamo è pensato per creare <strong>connessioni autentiche</strong>: con le culture locali, con la natura, 
               con se stessi. Crediamo che viaggiare sia un'opportunità di crescita personale e di scoperta, e ci impegniamo 
               ogni giorno per rendere questa <strong>esperienza accessibile e memorabile</strong> per tutti i nostri clienti.
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
             <h3>Competenza Locale</h3>
             <p>Grazie alla profonda conoscenza di ogni destinazione che offriamo, le nostre guide e il nostro staff locale vi assicurano di scoprire le gemme nascoste e le esperienze autentiche.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-cogs"></i>
            </div>
             <h3>Itinerari Su Misura</h3>
             <p>Non esistono due viaggiatori uguali. Ecco perché creiamo tour personalizzati in base alle vostre preferenze e al vostro stile di viaggio.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
             <h3>Pianificazione Perfetta</h3>
             <p>Dalla tua prima richiesta al tuo ritorno a casa, ci occupiamo di ogni dettaglio, così tu puoi concentrarti sul goderti il viaggio.</p>
          </div>
          
          <div className="why-card reveal-on-scroll">
            <div className="why-icon">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h3>Viaggi Responsabili</h3>
            <p>Abbiamo molto a cuore le comunità che visitiamo e l'ambiente che esploriamo. I nostri tour sono progettati per essere rispettosi e sostenibili.</p>
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
              <form className="contact-form" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const submitBtn = form.querySelector('button[type="submit"]');
                const formData = new FormData(form);

                if (submitBtn) submitBtn.disabled = true;
                try {
                  await sendLeadEmail({
                    source: 'about',
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                  });
                  trackLeadConversion();
                  alert('Richiesta inviata con successo!');
                  form.reset();
                } catch (error) {
                  alert(error.message || 'Invio non riuscito. Riprova tra poco.');
                } finally {
                  if (submitBtn) submitBtn.disabled = false;
                }
              }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome e Cognome</label>
                    <input name="name" type="text" placeholder="Mario Rossi" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="mario@example.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Messaggio</label>
                  <textarea name="message" rows="4" placeholder="Raccontaci cosa stai cercando..." />
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

      <section className="about-cta">
        <div className="about-cta-hero-image">
          <img src="/images/plane.jpg" alt="Aereo" />
        </div>
        <div className="about-cta-hero-content">
          <h2>Pronto per la tua prossima avventura?</h2>
          <p>Scopri le nostre destinazioni e inizia a pianificare il viaggio dei tuoi sogni</p>
          <div className="cta-buttons">
            <Link to="/#destinations-showcase-new" className="cta-btn primary">
              Scopri Destinazioni
            </Link>
            <button className="cta-btn secondary" onClick={scrollToContact}>
              Contattaci
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
