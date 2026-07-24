import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

const Grazie = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <PageTitle title="Grazie" />
      <div>
        <h1 style={{ fontFamily: "'DM Serif Text', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>
          Grazie!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', maxWidth: '28rem' }}>
          Abbiamo ricevuto la tua richiesta. Ti ricontatteremo al più presto.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.85rem 1.75rem',
            background: '#1a1a1a',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
};

export default Grazie;
