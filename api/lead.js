const nodemailer = require('nodemailer');

const LEAD_TO = 'preventivi@go2west.org';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailContent(payload) {
  const sourceLabels = {
    home: 'Home - Form contatti',
    about: 'About - Form contatti',
    tour: 'Tour - Richiesta preventivo',
  };

  const source = sourceLabels[payload.source] || payload.source || 'Sito web';
  const name = payload.name || [payload.firstName, payload.lastName].filter(Boolean).join(' ') || 'N/D';
  const email = payload.email || 'N/D';
  const phone = payload.phone || 'N/D';
  const message = payload.message || payload.comments || '';

  const rows = [
    ['Origine', source],
    ['Nome', name],
    ['Email', email],
    ['Telefono', phone],
  ];

  if (payload.destination) rows.push(['Destinazione', payload.destination]);
  if (payload.tourCode) rows.push(['Codice tour', payload.tourCode]);
  if (payload.tourTitle) rows.push(['Tour', payload.tourTitle]);
  if (payload.departureDate) rows.push(['Data partenza', payload.departureDate]);
  if (payload.adults != null) rows.push(['Adulti', String(payload.adults)]);
  if (payload.children != null && Number(payload.children) > 0) {
    rows.push(['Bambini', String(payload.children)]);
  }
  if (payload.childAge) rows.push(['Età bambini', payload.childAge]);
  if (payload.citizenship) rows.push(['Cittadinanza', payload.citizenship]);
  if (payload.city) rows.push(['Città', payload.city]);
  if (payload.country) rows.push(['Paese', payload.country]);
  if (payload.address) rows.push(['Indirizzo', payload.address]);
  if (payload.postalCode) rows.push(['CAP', payload.postalCode]);

  const rooms = [
    payload.singleRooms ? `${payload.singleRooms} singole` : null,
    payload.doubleRooms ? `${payload.doubleRooms} doppie` : null,
    payload.tripleRooms ? `${payload.tripleRooms} triple` : null,
    payload.quadrupleRooms ? `${payload.quadrupleRooms} quadruple` : null,
  ].filter(Boolean);
  if (rooms.length) rows.push(['Camere', rooms.join(', ')]);

  const textLines = rows.map(([label, value]) => `${label}: ${value}`);
  if (message) {
    textLines.push('', 'Messaggio:', message);
  }

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.5;">
      <h2 style="margin:0 0 16px;">Nuova richiesta lead</h2>
      <table style="border-collapse:collapse;">${htmlRows}</table>
      ${
        message
          ? `<p style="margin:16px 0 0;"><strong>Messaggio</strong></p><p style="white-space:pre-wrap;margin:8px 0 0;">${escapeHtml(message)}</p>`
          : ''
      }
    </div>
  `;

  return {
    subject: `[Go2West Lead] ${name}${payload.tourCode ? ` - ${payload.tourCode}` : ''}`,
    text: textLines.join('\n'),
    html,
    replyTo: email !== 'N/D' ? email : undefined,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
    return res.status(500).json({ error: 'Email non configurata sul server' });
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const email = (payload.email || '').trim();
  const name =
    (payload.name || '').trim() ||
    [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim();

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome ed email sono obbligatori' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email non valida' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const content = buildEmailContent({ ...payload, name, email });

    await transporter.sendMail({
      from: `"Go2West Website" <${gmailUser}>`,
      to: LEAD_TO,
      replyTo: content.replyTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Lead email error:', error);
    return res.status(500).json({ error: 'Invio email non riuscito' });
  }
};
