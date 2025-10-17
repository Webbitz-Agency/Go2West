import React from 'react';
import { useLocation } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();
  
  // Nascondi il footer nella pagina admin e tour-editor
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/tour-editor')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Chi Siamo</h4>
            <p><a href="/about" className="footer-link">About Us</a></p>
            <p style={{marginBottom: "10px"}}><strong>Sede legale:</strong> EKO Ltd srl 
            <br />via Damiano Chiesa 7D 
            <br />58100 Grosseto ITALIA</p>
          </div>
          
          <div className="footer-section">
            <h4>Contatti</h4>
            <p><strong>Email:</strong> <a href="mailto:info@go2west.org" className="footer-contact-link">info@go2west.org</a></p>
            <p><strong>Richiedi preventivo:</strong> <a href="mailto:preventivi@go2west.org" className="footer-contact-link">preventivi@go2west.org</a></p>
            <p><strong>Telefono:</strong> <a href="tel:+39056428595" className="footer-contact-link">+39 0564 28595</a></p>            
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
            <p><a href="/PrivacyPolicy2025.pdf" target="_blank" rel="noopener noreferrer" className="footer-link">Privacy Policy</a></p>
            <p><a href="/CondizioniGenerali2025.pdf" target="_blank" rel="noopener noreferrer" className="footer-link">Termini e condizioni</a></p>
            <p><a href="/cookie-policy" className="footer-link">Cookie Policy</a></p>
            {/*<p>Assicurazione Viaggio</p>*/}
          </div>

          <div className="footer-section">
            <h4>Social</h4>
            <div className="Social-links">
            <a href="https://www.facebook.com/share/1EdVxEcxH2/?mibextid=wwXIfr" className="Social-link" target="_blank" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://www.instagram.com/go2_west?igsh=MW5pYnZhY2R4ZDN0OA==" className="Social-link" target="_blank" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
          <div className="footer-section">
            <img src="/logo-nobg.png" alt="go2west" className="footer-logo-img" />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Go2West. Tutti i diritti riservati.</p>
          <p class="mt-1">Made in <a href="https://webbitz.it" target="_blank" rel="noopener noreferrer" style={{color: "#0000d6"}}>Webbitz</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 