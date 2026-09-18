#!/usr/bin/env python3
"""Regenerate shared-shell homepage + SEO route pages under dist/."""
from pathlib import Path

ROUTES = [
  {
    'slug': 'coimbatore-to-munnar-taxi',
    'from': 'Coimbatore',
    'to': 'Munnar',
    'km': 175,
    'label': 'Hill station escape',
    'blurb': 'One-way and drop taxi from Coimbatore to Munnar. Doorstep pickup, sedan to Innova Crysta.',
    'keywords': 'coimbatore to munnar taxi, coimbatore to munnar cab, drop taxi munnar',
    'photo_tag': 'THE NILGIRIS CORRIDOR',
    'photo_label': 'Misty hills and winding road toward Munnar',
    'reason_mid': 'Hill routes',
    'reason_mid_copy': 'Coimbatore to Munnar with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Is Munnar covered?',
    'faq_cover_a': 'Yes. Munnar is a popular hill destination we serve from Coimbatore and other Tamil Nadu cities. Availability for your exact pickup is confirmed when you enquire.',
  },
  {
    'slug': 'coimbatore-to-kodaikanal-taxi',
    'from': 'Coimbatore',
    'to': 'Kodaikanal',
    'km': 170,
    'label': 'To the misty hills',
    'blurb': 'Book a Coimbatore to Kodaikanal cab for one-way or round trip. Confirm fare on WhatsApp before you travel.',
    'keywords': 'coimbatore to kodaikanal cab, coimbatore to kodaikanal taxi',
    'photo_tag': 'KODAIKANAL HILLS',
    'photo_label': 'Hill road toward Kodaikanal',
    'reason_mid': 'Hill routes',
    'reason_mid_copy': 'Coimbatore to Kodaikanal with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Is Kodaikanal covered?',
    'faq_cover_a': 'Yes. Kodaikanal is a popular hill destination we serve from Coimbatore and other Tamil Nadu cities. Availability for your exact pickup is confirmed when you enquire.',
  },
  {
    'slug': 'coimbatore-to-chennai-taxi',
    'from': 'Coimbatore',
    'to': 'Chennai',
    'km': 500,
    'label': 'City to coast',
    'blurb': 'Coimbatore to Chennai one-way and round-trip taxi. Transparent rupee-per-km rates, WhatsApp quote in minutes.',
    'keywords': 'coimbatore to chennai taxi, coimbatore to chennai cab',
    'photo_tag': 'WEST TO EAST',
    'photo_label': 'Open highway toward Chennai',
    'reason_mid': 'Long distance',
    'reason_mid_copy': 'Coimbatore to Chennai with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Do you cover Coimbatore to Chennai?',
    'faq_cover_a': 'Yes. This is a core outstation corridor. Availability for your exact pickup and timing is confirmed when you enquire.',
  },
  {
    'slug': 'chennai-to-coimbatore-taxi',
    'from': 'Chennai',
    'to': 'Coimbatore',
    'km': 500,
    'label': 'The city connection',
    'blurb': 'Chennai to Coimbatore drop taxi and round trip. Choose Sedan, SUV, Innova or Crysta.',
    'keywords': 'chennai to coimbatore taxi, chennai to coimbatore cab',
    'photo_tag': 'THE CITY CONNECTION',
    'photo_label': 'Highway toward Coimbatore',
    'reason_mid': 'Long distance',
    'reason_mid_copy': 'Chennai to Coimbatore with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Do you cover Chennai to Coimbatore?',
    'faq_cover_a': 'Yes. This is a core outstation corridor. Availability for your exact pickup and timing is confirmed when you enquire.',
  },
  {
    'slug': 'chennai-to-madurai-taxi',
    'from': 'Chennai',
    'to': 'Madurai',
    'km': 460,
    'label': 'To the temple city',
    'blurb': 'Chennai to Madurai one-way taxi with doorstep pickup. Fare confirmed on WhatsApp before booking.',
    'keywords': 'chennai to madurai taxi, chennai to madurai cab',
    'photo_tag': 'TO THE TEMPLE CITY',
    'photo_label': 'Road toward Madurai',
    'reason_mid': 'Temple city trips',
    'reason_mid_copy': 'Chennai to Madurai with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Do you cover Chennai to Madurai?',
    'faq_cover_a': 'Yes. Madurai is a frequent destination from Chennai. Availability for your exact pickup is confirmed when you enquire.',
  },
  {
    'slug': 'coimbatore-to-ooty-taxi',
    'from': 'Coimbatore',
    'to': 'Ooty',
    'km': 85,
    'label': 'A little mountain air',
    'blurb': 'Coimbatore to Ooty taxi for day trips and weekend getaways. One-way, drop and round trip.',
    'keywords': 'coimbatore to ooty taxi, coimbatore to ooty cab',
    'photo_tag': 'THE NILGIRIS',
    'photo_label': 'Nilgiris road toward Ooty',
    'reason_mid': 'Hill routes',
    'reason_mid_copy': 'Coimbatore to Ooty with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Is Ooty covered?',
    'faq_cover_a': 'Yes. Ooty is a core hill destination from Coimbatore. Availability for your exact pickup is confirmed when you enquire.',
  },
  {
    'slug': 'trichy-to-chennai-taxi',
    'from': 'Trichy',
    'to': 'Chennai',
    'km': 320,
    'label': 'Towards the coast',
    'blurb': 'Trichy to Chennai drop taxi and round trip. Outstation rates from ₹15/km for sedan.',
    'keywords': 'trichy to chennai taxi, tiruchirappalli to chennai cab',
    'photo_tag': 'TOWARDS THE COAST',
    'photo_label': 'Highway toward Chennai',
    'reason_mid': 'City corridors',
    'reason_mid_copy': 'Trichy to Chennai with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Do you cover Trichy to Chennai?',
    'faq_cover_a': 'Yes. Trichy (Tiruchirappalli) to Chennai is a regular outstation route. Availability is confirmed when you enquire.',
  },
  {
    'slug': 'chennai-to-ooty-taxi',
    'from': 'Chennai',
    'to': 'Ooty',
    'km': 545,
    'label': 'Nilgiris from the coast',
    'blurb': 'Chennai to Ooty one-way and round-trip taxi. Long-distance comfort with Sedan, SUV or Innova.',
    'keywords': 'chennai to ooty taxi, chennai to ooty cab',
    'photo_tag': 'NILGIRIS FROM THE COAST',
    'photo_label': 'Long run toward the Nilgiris',
    'reason_mid': 'Long hill runs',
    'reason_mid_copy': 'Chennai to Ooty with sedan, SUV, Innova or Crysta.',
    'faq_cover_q': 'Do you cover Chennai to Ooty?',
    'faq_cover_a': 'Yes. This is a long-distance hill corridor we serve. Availability and timing are confirmed when you enquire.',
  },
]

ROOT = Path(__file__).resolve().parents[1] / 'dist'
ASSET_V = '16'

FLOAT = '''<nav class="contact-float" aria-label="Quick contact">
  <a class="contact-float-call" href="tel:+919677075741" aria-label="Call VK Signature Travels"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1z"/></svg></a>
  <a class="contact-float-wa" href="https://wa.me/919677075741" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp VK Signature Travels"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.94.51 3.82 1.48 5.48L2 22l4.85-1.57a10.07 10.07 0 005.19 1.44h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.77 13.96c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.2-.14.32-.28.5-.14.17-.3.38-.42.51-.14.14-.29.3-.12.58.16.29.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.17-.2.7-.81.88-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.32.07.12.07.68-.17 1.36z"/></svg></a>
</nav>'''

DIALOG = '''<dialog id="trip-dialog">
  <button class="close-dialog" aria-label="Close trip details">×</button>
  <p class="eyebrow">ONE STEP CLOSER TO THE ROAD</p>
  <h2>Your journey details</h2>
  <p id="trip-summary"></p>
  <p class="booking-status">Send this trip on WhatsApp to confirm availability and receive a fare quote. We usually reply within 15 minutes.</p>
  <a class="primary" id="whatsapp-trip" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp ↗</a>
  <button class="text-button save-secondary" id="save-trip">Save trip details ↓</button>
  <p class="saved-message" role="status"></p>
</dialog>'''

ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%23143d32'/%3E%3Ctext x='5' y='27' font-family='Arial' font-size='22' font-weight='bold' fill='%23d3ed88'%3EVK%3C/text%3E%3C/svg%3E"

GTAG = '''<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18457731741"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18457731741');</script>'''


def inr_in(n):
    s = str(int(round(n)))
    if len(s) <= 3:
        return '₹' + s
    last3, rest = s[-3:], s[:-3]
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return '₹' + ','.join(parts + [last3])


def header(home_href, prefix):
    return f'''<header class="site-header">
  <a class="brand" href="{home_href}" aria-label="VK Signature Travels home"><span class="brand-mark">VK<span>↗</span></span><span>SIGNATURE <b>TRAVELS</b></span></a>
  <nav class="site-nav" aria-label="Main navigation">
    <a href="{prefix}#journey">Book</a>
    <a href="{prefix}#fares">Fares</a>
    <a href="{prefix}#routes">Routes</a>
    <a href="{prefix}#fleet">Cars</a>
    <a href="{prefix}#answers">FAQs</a>
  </nav>
  <div class="site-header-actions">
    <a class="site-call" href="tel:+919677075741"><span>CALL US</span>+91 96770 75741</a>
    <a class="site-wa" href="#journey">WhatsApp quote</a>
  </div>
</header>'''


def footer(home_href, line):
    return f'''<footer class="site-footer">
  <a class="brand" href="{home_href}"><span class="brand-mark">VK<span>↗</span></span><span>SIGNATURE <b>TRAVELS</b></span></a>
  <p>{line}<br><a href="tel:+919677075741">+91 96770 75741</a></p>
  <span>© <span id="year"></span> VK Signature Travels</span>
</footer>'''


def booking_form(from_val='', to_val='', fare='—'):
    if from_val:
        from_field = f'<input id="pickup" name="pickup" value="{from_val}" required autocomplete="off" enterkeyhint="next" placeholder="Search pickup location">'
    else:
        from_field = '<input id="pickup" name="pickup" placeholder="Search pickup location" required autocomplete="off" enterkeyhint="next">'
    if to_val:
        to_field = f'<input id="drop" name="drop" value="{to_val}" required autocomplete="off" enterkeyhint="next" placeholder="Search drop location">'
    else:
        to_field = '<input id="drop" name="drop" placeholder="Search drop location" required autocomplete="off" enterkeyhint="next">'
    return f'''<form id="booking-form" class="booking-form">
      <label class="field-from"><span>PICKUP FROM</span>{from_field}</label>
      <button type="button" id="swap" class="swap-btn" aria-label="Swap pickup and drop cities">⇄</button>
      <label class="field-to"><span>DROP TO</span>{to_field}</label>
      <div class="form-row">
        <label class="field-date"><span>START DATE</span><input id="date" name="date" type="date" required></label>
        <label class="field-time"><span>TIME</span><input id="time" name="time" type="time" required></label>
      </div>
      <label class="field-end-date" id="end-date-field" hidden>
        <span>END DATE</span>
        <input id="end-date" name="end-date" type="date">
      </label>
      <label class="field-car"><span>SELECT CAR</span>
        <select id="car" name="car" required>
          <option value="Sedan CNG">Sedan CNG (4+1) — ₹15/km</option>
          <option value="Sedan (Non-CNG)">Sedan (Non-CNG) (4+1) — ₹15/km</option>
          <option value="SUV CNG">SUV CNG (7+1 / 6+1) — ₹20/km</option>
          <option value="SUV (Non-CNG)">SUV (Non-CNG) (7+1 / 6+1) — ₹20/km</option>
          <option value="Innova">Innova — ₹21/km</option>
          <option value="Innova Crysta">Innova Crysta (6+1) — ₹22–25/km</option>
        </select>
      </label>
      <div class="estimate-box">
        <div class="estimate-top">
          <div>
            <span class="tariff-kind">ESTIMATED BASE FARE</span>
            <p id="fare-amount">{fare}</p>
          </div>
          <div class="estimate-rate">
            <span id="rate-tag">₹15/km</span>
            <p id="trip-kind-label">One-way / Drop</p>
          </div>
        </div>
        <p id="live-estimate" class="live-estimate" role="status">Search pickup and drop to see a rough base fare for popular routes.</p>
      </div>
      <button class="primary wa-submit" type="submit">Get quote on WhatsApp <span>↗</span></button>
      <p class="form-note">No payment on this page. Tolls, bata and parking confirmed on WhatsApp. One-way min 130 km. Round trip min 250 km per day (start→end dates). Out-and-back distance used when higher. ₹1/km less on round trip. We usually reply within 15 minutes.</p>
      <p id="form-error" role="alert"></p>
    </form>'''


def hero(eyebrow, title, lede, photo_tag, photo_label, form_html):
    return f'''<section class="hero-stage" id="journey">
  <div class="hero-panel">
    <p class="eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    <p class="hero-lede">{lede}</p>
    <div class="trip-toggle" role="radiogroup" aria-label="Trip type">
      <label class="trip-option"><input type="radio" name="trip-kind" value="one-way" checked> One-way / Drop</label>
      <label class="trip-option"><input type="radio" name="trip-kind" value="round-trip"> Round trip</label>
    </div>
    {form_html}
  </div>
  <aside class="hero-photo" role="img" aria-label="{photo_label}">
    <span class="hero-photo-tag">⌖ &nbsp; {photo_tag}</span>
  </aside>
</section>'''


def render_home():
    route_cards = ''.join(
        f'<a class="route-card" href="./{r["slug"]}/"><span class="route-index">{f"{i+1:02d} / {r["label"].upper()}"}</span>'
        f'<span class="route-cities">{r["from"]} <span>↗</span><br>{r["to"]}</span>'
        f'<span class="route-bottom">From {inr_in(r["km"] * 15)} sedan base <b>→</b></span></a>'
        for i, r in enumerate(ROUTES)
    )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
{GTAG}
<meta name="theme-color" content="#143d32">
<title>VK Signature Travels | One-way & Drop Taxi in Tamil Nadu</title>
<meta name="description" content="Plan your one-way and drop taxi journey across Tamil Nadu with VK Signature Travels. See rough fares for popular routes, choose your car, and get a WhatsApp quote.">
<link rel="canonical" href="https://vksignaturetravels.com/">
<link rel="icon" href="{ICON}">
<link rel="stylesheet" href="style.css?v={ASSET_V}">
<script src="routes-data.js?v={ASSET_V}" defer></script>
<script src="app.js?v={ASSET_V}" defer></script>
</head>
<body class="site-home">
{header('/', '')}
<main>
{hero('QUICK DISPATCH', 'One way. Endless possibilities.', 'One-way, round trip &amp; drop taxis across Tamil Nadu and nearby hill stations. Quote on WhatsApp in about 15 minutes.', 'THE NILGIRIS, TAMIL NADU', 'Green hills and a winding road in the Nilgiris', booking_form())}

<section class="tariff-strip" id="tariff-highlight" aria-label="Round trip savings">
  <p class="tariff-kicker">TARIFF, CLEARLY</p>
  <h2>Round trip is <em>₹1 less</em> a kilometre.</h2>
  <p>Same car. Same road. One rupee cheaper each km when you return. Sedan from ₹15/km one-way · ₹14/km round trip.</p>
  <a class="text-button" href="#fleet">See every car rate ↗</a>
</section>

<section class="fares section" id="fares">
  <div class="section-heading">
    <div>
      <p class="eyebrow">ROUGH FARES, BEFORE YOU CHAT</p>
      <h2>Popular routes, from estimates.</h2>
    </div>
    <p>Sedan one-way base at ₹15/km × typical highway distance. Tolls, bata and parking are confirmed on WhatsApp.</p>
  </div>
  <div class="fare-grid" data-fill-route-fares="8" data-base="./"></div>
</section>

<section class="routes section" id="routes">
  <div class="section-heading">
    <div>
      <p class="eyebrow">FAMILIAR ROADS. NEW MEMORIES.</p>
      <h2>Where the road takes you.</h2>
    </div>
    <p>Open a route page, or fill the form with your own cities.</p>
  </div>
  <div class="route-grid">{route_cards}</div>
  <p class="coverage">Also travel to Salem, Tirunelveli, Erode, Thanjavur, Vellore, Kanyakumari, Rameswaram and destinations across Tamil Nadu — plus Ooty, Kodaikanal and Munnar.</p>
</section>

<section class="fleet section" id="fleet">
  <div class="section-heading">
    <div>
      <p class="eyebrow">ROOM FOR YOUR PLANS</p>
      <h2>A comfortable way to go.</h2>
    </div>
    <p>Choose your preferred car. Vehicle and fare are confirmed before booking.</p>
  </div>
  <div class="fleet-grid">
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>Sedan CNG</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹15<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹14<span> / km</span></p></div></div><div class="specs"><span>4+1 seating</span><span>Carrier mandatory</span></div><button class="text-button" data-car="Sedan CNG">Choose Sedan CNG ↗</button></article>
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>Sedan (Non-CNG)</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹15<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹14<span> / km</span></p></div></div><div class="specs"><span>4+1 seating</span></div><button class="text-button" data-car="Sedan (Non-CNG)">Choose Sedan (Non-CNG) ↗</button></article>
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>SUV CNG</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹20<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹19<span> / km</span></p></div></div><div class="specs"><span>7+1 / 6+1 seating</span><span>Carrier mandatory</span></div><button class="text-button" data-car="SUV CNG">Choose SUV CNG ↗</button></article>
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>SUV (Non-CNG)</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹20<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹19<span> / km</span></p></div></div><div class="specs"><span>7+1 / 6+1 seating</span><span>Carrier mandatory</span></div><button class="text-button" data-car="SUV (Non-CNG)">Choose SUV (Non-CNG) ↗</button></article>
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>Innova</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹21<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹20<span> / km</span></p></div></div><div class="specs"></div><button class="text-button" data-car="Innova">Choose Innova ↗</button></article>
    <article><span class="vehicle-label">OUTSTATION TAXI</span><h3>Innova Crysta</h3><div class="tariffs"><div><span class="tariff-kind">ONE-WAY / DROP</span><p class="vehicle-price">₹22–25<span> / km</span></p></div><div><span class="tariff-kind">ROUND TRIP</span><p class="vehicle-price">₹21–24<span> / km</span></p></div></div><div class="specs"><span>6+1 seating</span></div><button class="text-button" data-car="Innova Crysta">Choose Innova Crysta ↗</button></article>
  </div>
  <p class="fare-note">Seating is passengers + driver. Minimum billing: 130 km one-way · 250 km per day round trip (by start/end dates). Round trip is ₹1/km less than one-way. Confirm final fare and charges before booking.</p>
</section>

<section class="trust section" id="trust">
  <div class="section-heading">
    <div>
      <p class="eyebrow">BEFORE YOU HAND OVER THE KEYS</p>
      <h2>Clear quotes. Fast replies.</h2>
    </div>
    <p>No online payment. Your ride is confirmed only after availability and the full fare are agreed on WhatsApp or call.</p>
  </div>
  <div class="trust-metrics">
    <div><strong>~15 min</strong><span>Typical WhatsApp reply</span></div>
    <div><strong>₹/km published</strong><span>Same rates on site and quote</span></div>
    <div><strong>Confirm first</strong><span>Fare agreed before you travel</span></div>
    <div><strong>+91 96770 75741</strong><span>Call or WhatsApp anytime</span></div>
  </div>
  <div class="trust-quotes">
    <figure><blockquote>“Booked Chennai to Coimbatore for a family function. Quote came quickly on WhatsApp and the pickup was on time.”</blockquote><figcaption>Priya · Chennai → Coimbatore</figcaption></figure>
    <figure><blockquote>“Needed a one-way drop to Madurai — no return charge confusion. They confirmed tolls and bata before we left.”</blockquote><figcaption>Arun · Chennai → Madurai</figcaption></figure>
    <figure><blockquote>“Coimbatore to Ooty with an Innova. Clear rate, helpful on the ghat timing, and easy to reach on the phone.”</blockquote><figcaption>Meena · Coimbatore → Ooty</figcaption></figure>
  </div>
</section>

<section class="faq section" id="answers">
  <div>
    <p class="eyebrow">BEFORE YOU HIT THE ROAD</p>
    <h2>A few things you might ask.</h2>
    <a href="#journey" class="text-button">Plan your trip ↗</a>
  </div>
  <div class="questions">
    <details><summary>Can I book a one-way drop taxi?</summary><p>Yes. Choose one-way / drop, then your pickup city, destination and travel date. You do not need to plan a return trip.</p></details>
    <details><summary>How is round trip priced?</summary><p>Round trip is ₹1 per km less than the one-way rate for the same car, billed for both directions. Minimum billing is 250 km per day based on your start and end dates (inclusive). One-way minimum is 130 km. Confirm the total fare, driver allowance, tolls, parking and any other applicable charges before accepting a trip.</p></details>
    <details><summary>Which locations do you cover?</summary><p>We cover journeys across Tamil Nadu and popular nearby hill destinations such as Ooty, Kodaikanal and Munnar. You can enter any town or city. Availability is confirmed for your specific route.</p></details>
    <details><summary>How accurate are the “from” fares?</summary><p>They are rough one-way sedan bases using ₹15/km × a typical highway distance. Tolls, bata and parking can change the total. Always confirm with our team.</p></details>
    <details><summary>Is my trip confirmed when I fill in the form?</summary><p>No. The form prepares your trip details. A booking is confirmed only after the team agrees on availability, pickup details and the final fare with you.</p></details>
  </div>
</section>

<section class="closing">
  <div>
    <p>ALL ACROSS TAMIL NADU</p>
    <h2>Your destination.<br>Our next journey.</h2>
  </div>
  <a href="#journey">Plan your ride <span>↗</span></a>
</section>
</main>
{footer('/', 'One-way, round trip &amp; drop taxi · Tamil Nadu &amp; nearby hills')}
<p class="photo-credit">Photo: <a href="https://commons.wikimedia.org/wiki/File:Misty_hills_kotagiri_ooty_tamilnadu_-_panoramio.jpg" target="_blank" rel="noopener noreferrer">rajaraman sundaram / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> · Cropped</p>
{DIALOG}
{FLOAT}
</body>
</html>
'''


def render_route(r):
    fare = inr_in(r['km'] * 15)
    related = [x for x in ROUTES if x['slug'] != r['slug']][:4]
    related_html = ''.join(
        f'<a class="route-card" href="../{x["slug"]}/"><span class="route-index">{x["label"].upper()}</span>'
        f'<span class="route-cities">{x["from"]} <span>↗</span><br>{x["to"]}</span>'
        f'<span class="route-bottom">From {inr_in(x["km"] * 15)} sedan base <b>→</b></span></a>'
        for x in related
    )
    title = f"{r['from']} to {r['to']} Taxi | VK Signature Travels"
    desc = f"{r['blurb']} From {fare} sedan one-way base (~{r['km']} km at ₹15/km). Round trip is ₹1/km less."
    form = booking_form(r['from'], r['to'], fare)
    hero_html = hero(
        'QUICK DISPATCH',
        f"{r['from']} to {r['to']} taxi",
        'One-way and drop taxi · doorstep pickup · quote on WhatsApp in about 15 minutes.',
        r['photo_tag'],
        r['photo_label'],
        form,
    )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
{GTAG}
<meta name="theme-color" content="#143d32">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="keywords" content="{r['keywords']}">
<link rel="canonical" href="https://vksignaturetravels.com/{r['slug']}/">
<link rel="icon" href="{ICON}">
<link rel="stylesheet" href="../style.css?v={ASSET_V}">
<script src="../routes-data.js?v={ASSET_V}" defer></script>
<script src="../app.js?v={ASSET_V}" defer></script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "VK Signature Travels — {r['from']} to {r['to']} Taxi",
  "areaServed": ["{r['from']}", "{r['to']}", "Tamil Nadu"],
  "url": "https://vksignaturetravels.com/{r['slug']}/",
  "telephone": "+919677075741",
  "priceRange": "{fare}+"
}}
</script>
</head>
<body class="site-route" data-from="{r['from']}" data-to="{r['to']}">
{header('../', '../')}
<main>
{hero_html}

<section class="reasons" aria-label="Why book this route">
  <div>
    <h3>One-way drop</h3>
    <p>Pay for the trip you need — no forced return booking.</p>
  </div>
  <div>
    <h3>{r['reason_mid']}</h3>
    <p>{r['reason_mid_copy']}</p>
  </div>
  <div>
    <h3>Clear ₹/km</h3>
    <p>Round trip is ₹1/km less, billed both ways. Min 250 km round trip · 130 km one-way.</p>
  </div>
</section>

<section class="faq section" id="answers">
  <div>
    <p class="eyebrow">ROUTE QUESTIONS</p>
    <h2>{r['from']} to {r['to']}<br>FAQs</h2>
    <a href="#journey" class="text-button">Book this route ↗</a>
  </div>
  <div class="questions">
    <details open><summary>What is a rough fare for {r['from']} to {r['to']}?</summary><p>A sedan one-way base is about {fare} using ~{r['km']} km at ₹15/km. SUVs and Innovas cost more per km. Tolls, bata and parking are extra and confirmed on WhatsApp.</p></details>
    <details><summary>Do you offer one-way drop on this route?</summary><p>Yes. Choose One-way / Drop in the form. You do not need a return booking.</p></details>
    <details><summary>How fast do you reply?</summary><p>We usually reply on WhatsApp within about 15 minutes during working hours. You can also call +91 96770 75741.</p></details>
    <details><summary>{r['faq_cover_q']}</summary><p>{r['faq_cover_a']}</p></details>
  </div>
</section>

<section class="related-routes">
  <h2>Other routes people book</h2>
  <div class="route-grid">{related_html}</div>
</section>
</main>
{footer('../', f"One-way, round trip &amp; drop taxi · {r['from']} to {r['to']}")}
{DIALOG}
{FLOAT}
</body>
</html>
'''


def main():
    (ROOT / 'index.html').write_text(render_home(), encoding='utf-8')
    print('wrote dist/index.html')
    for r in ROUTES:
        out = ROOT / r['slug'] / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render_route(r), encoding='utf-8')
        print('wrote', out.relative_to(ROOT.parent))
    urls = ['https://vksignaturetravels.com/'] + [f'https://vksignaturetravels.com/{r["slug"]}/' for r in ROUTES]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls)
    sitemap += '</urlset>\n'
    (ROOT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
    (ROOT / 'robots.txt').write_text(
        'User-agent: *\nAllow: /\nSitemap: https://vksignaturetravels.com/sitemap.xml\n',
        encoding='utf-8',
    )
    print('sitemap + robots updated')


if __name__ == '__main__':
    main()
