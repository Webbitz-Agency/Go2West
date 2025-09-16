import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Chi Siamo</h4>
            <p>Scopri il mondo con Go2West, la tua agenzia di viaggi di fiducia.
            Esperienza, passione e dedizione per creare viaggi indimenticabili.
            Specializzati in Americhe, Caraibi e Polinesia.</p>
          </div>
          
          <div className="footer-section">
            <h4>Contatti</h4>
            <p><strong>Email:</strong> ---</p>
            <p><strong>Telefono:</strong> ---</p>
            <p><strong>WhatsApp:</strong> ---</p>
            <p><strong>Orari:</strong> ---</p>
          </div>
          
          {/*<div className="footer-section">
            <h4>Servizi</h4>
            <p>City Breaks</p>
            <p>Fly & Drive</p>
            <p>Ride in Harley</p>
            <p>Tour Guidati</p>
            <p>Viaggi su Misura</p>
          </div>*/}
          
          <div className="footer-section">
            <h4>Informazioni</h4>
            <p><a href="/privacy-policy" className="footer-link">Privacy Policy</a></p>
            <p><a href="/termini-condizioni" className="footer-link">Termini e condizioni</a></p>
            <p><a href="/cookie-policy" className="footer-link">Cookie Policy</a></p>
            {/*<p>Assicurazione Viaggio</p>*/}
          </div>
          
          <div className="footer-section">
            <img src="/logo-nobg.png" alt="go2west" className="footer-logo-img" />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Go2West. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 