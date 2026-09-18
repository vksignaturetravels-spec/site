/** @type {import('@netlify/functions').Handler} */
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8690368723:AAEzuWkn2HE-sSQ9oHUFwY2CyAeebZPS1uE';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6088607890';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function json(statusCode, body) {
  return { statusCode, headers: cors, body: JSON.stringify(body) };
}

function clean(value, max = 200) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max);
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const name = clean(data.name, 80);
  const phoneRaw = clean(data.phone, 20).replace(/\s+/g, '');
  const from = clean(data.from, 180);
  const to = clean(data.to, 180);
  const date = clean(data.date, 20);
  const endDate = clean(data.endDate, 20);
  const time = clean(data.time, 10);
  const kind = clean(data.kind, 40);
  const car = clean(data.car, 120);
  const estimate = clean(data.estimate, 400);
  const fare = clean(data.fare, 40);
  const page = clean(data.page, 200);
  const ref = clean(data.ref, 24) || `VK-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const digits = phoneRaw.replace(/\D/g, '');
  const mobile = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;

  if (!name || name.length < 2) return json(400, { ok: false, error: 'Name is required' });
  if (!/^[6-9]\d{9}$/.test(mobile)) return json(400, { ok: false, error: 'Valid 10-digit Indian mobile required' });
  if (!from || !to || !date || !time || !kind || !car) return json(400, { ok: false, error: 'Missing trip details' });

  const lines = [
    '🚕 <b>New booking request</b>',
    `Ref: <code>${ref}</code>`,
    '',
    `👤 <b>${name}</b>`,
    `📞 +91 ${mobile}`,
    '',
    `Trip: <b>${kind}</b>`,
    `From: ${from}`,
    `To: ${to}`,
    `Start: ${date} · ${time}`,
    endDate ? `End: ${endDate}` : '',
    `Car: ${car}`,
    fare ? `Estimate: ${fare}` : '',
    estimate ? `Note: ${estimate}` : '',
    page ? `Page: ${page}` : ''
  ].filter(Boolean);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const result = await tgRes.json();
    if (!result.ok) {
      console.error('telegram error', result);
      return json(502, { ok: false, error: 'Could not notify booking desk' });
    }
    return json(200, { ok: true, ref });
  } catch (err) {
    console.error(err);
    return json(500, { ok: false, error: 'Server error sending booking' });
  }
};
