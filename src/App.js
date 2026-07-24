import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// Import dei componenti delle pagine e delle route principali.
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import About from './pages/About';
import DestinationTours from './pages/DestinationTours';
import TourDetails from './pages/TourDetails';
import Admin from './pages/Admin';
import TourEditor from './pages/TourEditor';
import Promotions from './pages/Promotions';
import SearchResults from './pages/SearchResults';
import Grazie from './pages/Grazie';

function AppContent() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window.fbq === 'function' && window.Cookiebot?.consent?.marketing) {
      window.fbq('track', 'PageView');
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);
  
  // Percorsi dove il chatbot non deve essere mostrato
  const hideChatbotPaths = ['/admin', '/admin/tour-editor'];
  const shouldShowChatbot = !hideChatbotPaths.includes(location.pathname);

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/grazie" element={<Grazie />} />
          <Route path="/promozioni" element={<Promotions />} />
          <Route path="/cerca" element={<SearchResults />} />
          <Route path="/destination/:country" element={<DestinationTours />} />
          <Route path="/travel/:type/:country" element={<DestinationTours />} />
          <Route path="/tour/:tourId" element={<TourDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/tour-editor" element={<TourEditor />} />
        </Routes>
      </main>
      <Footer />
      {shouldShowChatbot && <ChatBot />}
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 