import { useEffect } from 'react';

/**
 * Componente per aggiornare il titolo della pagina
 * @param {string} title - Il titolo della sezione
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    if (title) {
      document.title = `Go2West - ${title}`;
    }
    
    // Cleanup: ripristina il titolo originale quando il componente viene smontato
    return () => {
      document.title = 'Go2West';
    };
  }, [title]);

  // Questo componente non renderizza nulla
  return null;
};

export default PageTitle;
