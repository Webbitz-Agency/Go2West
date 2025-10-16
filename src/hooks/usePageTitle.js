import { useEffect } from 'react';

/**
 * Hook personalizzato per gestire il titolo dinamico delle pagine
 * @param {string} title - Il titolo della sezione (es. "Home", "About", "Promozioni")
 */
const usePageTitle = (title) => {
  useEffect(() => {
    // Aggiorna il titolo della pagina
    document.title = `Go2West - ${title}`;
    
    // Cleanup: ripristina il titolo originale quando il componente viene smontato
    return () => {
      document.title = 'Go2West';
    };
  }, [title]);
};

export default usePageTitle;
