import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Scopri il mondo con Go2West, la tua agenzia di viaggi di fiducia.</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@go2west.com</p>
            <p>Tel: +39 123 456 789</p>
          </div>
          
          <div className="footer-section">
            <h4>Privacy Policy</h4>
            <p>Terms of Service</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Go2West. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 