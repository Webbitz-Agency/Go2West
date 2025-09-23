import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import dei componenti delle pagine
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import DestinationTours from './pages/DestinationTours';
import TourDetails from './pages/TourDetails';
import Admin from './pages/Admin';
import Promotions from './pages/Promotions';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/promozioni" element={<Promotions />} />
            <Route path="/destination/:country" element={<DestinationTours />} />
            <Route path="/travel/:type/:country" element={<DestinationTours />} />
            <Route path="/tour/:tourId" element={<TourDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 