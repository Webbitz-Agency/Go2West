import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import dei componenti delle pagine
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import DestinationTours from './pages/DestinationTours';
import TourDetails from './pages/TourDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destination/:country" element={<DestinationTours />} />
            <Route path="/travel/:type/:country" element={<DestinationTours />} />
            <Route path="/tour/:tourId" element={<TourDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 