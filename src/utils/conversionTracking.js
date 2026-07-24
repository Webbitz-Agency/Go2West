export const CONVERSION_PATH = '/grazie';

/**
 * Aggiorna l'URL a /grazie senza lasciare la pagina e notifica gtag,
 * così Google Ads può tracciare la conversione via URL.
 */
export function trackLeadConversion() {
  const conversionUrl = `${window.location.origin}${CONVERSION_PATH}`;

  window.history.pushState({ conversion: true }, '', CONVERSION_PATH);

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: 'Richiesta inviata',
      page_location: conversionUrl,
      page_path: CONVERSION_PATH,
    });
    window.gtag('config', 'AW-18346881743', {
      page_path: CONVERSION_PATH,
    });
  }
}
