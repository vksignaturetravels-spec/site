const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8690368723:AAEzuWkn2HE-sSQ9oHUFwY2CyAeebZPS1uE';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6088607890';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...cors },
    body: JSON.stringify(body)
  };
}

function clean(value, max = 200) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max);
}

function bookingRef() {
  const n = Date.now().toString(36).toUpperCase();
  return `VK-${n.slice(-8)}`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const name = clean(data.name, 80);
  const phone = clean(data.phone, 20).replace(/\s+/g, '');
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

  if (!name || name.length < 2) {
    return json(400, { ok: false, error: 'Name is required' });
  }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/^(\+91|91)/, ''))) {
    const digits = phone.replace(/\D/g, '');
    const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(local)) {
      return json(400, { ok: false, error: 'Valid 10-digit Indian mobile number required' });
    }
  }
  if (!from || !to || !date || !time || !kind || !car) {
    return json(400, { ok: false, error: 'Missing trip details' });
  }

  const digits = phone.replace(/\D/g, '');
  const mobile = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  const ref = clean(data.ref, 24) || bookingRef();

  const lines = [
    `🚕 <b>New booking request</b>`,
    `Ref: <code>${ref}</code>`,
    ``,
    `👤 <b>${name}</b>`,
    `📞 <a href="tel:+91${mobile}">+91 ${mobile}</a>`,
    ``,
    `Trip: <b>${kind}</b>`,
    `From: ${from}`,
    `To: ${to}`,
    `Start: ${date} · ${time}`,
    endDate ? `End: ${endDate}` : null,
    `Car: ${car}`,
    fare ? `Estimate: ${fare}` : null,
    estimate ? `Note: ${estimate}` : null,
    page ? `Page: ${page}` : null
  ].filter(Boolean);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const result = await tg.json();
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
