#!/usr/bin/env python3
"""Regenerate Dispatch-style SEO route landing pages under dist/."""
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
ASSET_V = '8'

FLOAT = '''<nav class="contact-float" aria-label="Quick contact">
  <a class="contact-float-call" href="tel:+919677075741" aria-label="Call VK Signature Travels"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1z"/></svg></a>
  <a class="contact-float-wa" href="https://wa.me/919677075741" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp VK Signature Travels"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.94.51 3.82 1.48 5.48L2 22l4.85-1.57a10.07 10.07 0 005.19 1.44h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.77 13.96c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.2-.14.32-.28.5-.14.17-.3.38-.42.51-.14.14-.29.3-.12.58.16.29.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.17-.2.7-.81.88-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.32.07.12.07.68-.17 1.36z"/></svg></a>
</nav>'''


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


def render(r):
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
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18457731741"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','AW-18457731741');</script>
<meta name="theme-color" content="#143d32">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="keywords" content="{r['keywords']}">
<link rel="canonical" href="https://vksignaturetravels.com/{r['slug']}/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%23143d32'/%3E%3Ctext x='5' y='27' font-family='Arial' font-size='22' font-weight='bold' fill='%23d3ed88'%3EVK%3C/text%3E%3C/svg%3E">
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
<body class="page-dispatch" data-from="{r['from']}" data-to="{r['to']}">
<header class="dispatch-header">
  <a class="brand" href="../" aria-label="VK Signature Travels home"><span class="brand-mark">VK<span>↗</span></span><span>SIGNATURE <b>TRAVELS</b></span></a>
  <div class="dispatch-header-actions">
    <a class="dispatch-call" href="tel:+919677075741"><span>CALL US</span>+91 96770 75741</a>
    <a class="nav-cta dispatch-wa-nav" href="#journey">WhatsApp quote</a>
  </div>
</header>

<main class="dispatch-stage">
  <section class="dispatch-panel" id="journey">
    <p class="eyebrow">QUICK DISPATCH</p>
    <h1>{r['from']} to {r['to']} taxi</h1>
    <p class="dispatch-lede">One-way and drop taxi · doorstep pickup · quote on WhatsApp in about 15 minutes.</p>

    <div class="trip-toggle dispatch-pills" role="radiogroup" aria-label="Trip type">
      <label class="trip-option"><input type="radio" name="trip-kind" value="one-way" checked> One-way / Drop</label>
      <label class="trip-option"><input type="radio" name="trip-kind" value="round-trip"> Round trip</label>
    </div>

    <form id="booking-form" class="dispatch-form">
      <label class="field-from"><span>PICKUP FROM</span><input id="pickup" name="pickup" list="cities" value="{r['from']}" required autocomplete="off"></label>
      <button type="button" id="swap" class="dispatch-swap" aria-label="Swap pickup and drop cities">⇄</button>
      <label class="field-to"><span>DROP TO</span><input id="drop" name="drop" list="cities" value="{r['to']}" required autocomplete="off"></label>
      <div class="dispatch-row">
        <label class="field-date"><span>DATE</span><input id="date" name="date" type="date" required></label>
        <label class="field-time"><span>TIME</span><input id="time" name="time" type="time" required></label>
      </div>
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

      <div class="dispatch-estimate">
        <div class="dispatch-estimate-top">
          <div>
            <span class="tariff-kind">ESTIMATED BASE FARE</span>
            <p id="fare-amount" class="dispatch-fare">{fare}</p>
          </div>
          <div class="dispatch-estimate-rate">
            <span id="rate-tag">₹15/km</span>
            <p id="trip-kind-label">One-way / Drop</p>
          </div>
        </div>
        <p id="live-estimate" class="live-estimate" role="status"></p>
      </div>

      <button class="primary dispatch-submit" type="submit">Get quote on WhatsApp <span>↗</span></button>
      <p class="form-note">No payment on this page. Tolls, bata and parking confirmed on WhatsApp. Round trip is ₹1/km less.</p>
      <p id="form-error" role="alert"></p>
    </form>
  </section>

  <aside class="dispatch-photo" role="img" aria-label="{r['photo_label']}">
    <span class="dispatch-photo-tag">⌖ &nbsp; {r['photo_tag']}</span>
  </aside>
</main>

<section class="dispatch-below">
  <h2>Why book this route with us</h2>
  <div class="dispatch-reasons">
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
      <p>Round trip is ₹1/km less. Final fare confirmed before you travel.</p>
    </div>
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

<footer>
  <a class="brand" href="../"><span class="brand-mark">VK<span>↗</span></span><span>SIGNATURE <b>TRAVELS</b></span></a>
  <p>One-way, round trip &amp; drop taxi · {r['from']} to {r['to']}<br><a href="tel:+919677075741">+91 96770 75741</a></p>
  <span>© <span id="year"></span> VK Signature Travels</span>
</footer>

<datalist id="cities">
  <option value="Chennai"><option value="Coimbatore"><option value="Madurai"><option value="Trichy"><option value="Salem"><option value="Ooty"><option value="Erode"><option value="Tirunelveli"><option value="Thanjavur"><option value="Vellore"><option value="Kanyakumari"><option value="Tiruppur"><option value="Dindigul"><option value="Rameswaram"><option value="Kodaikanal"><option value="Karur"><option value="Hosur"><option value="Cuddalore"><option value="Munnar">
</datalist>

<dialog id="trip-dialog">
  <button class="close-dialog" aria-label="Close trip details">×</button>
  <p class="eyebrow">ONE STEP CLOSER TO THE ROAD</p>
  <h2>Your journey details</h2>
  <p id="trip-summary"></p>
  <p class="booking-status">Send this trip on WhatsApp to confirm availability and receive a fare quote. We usually reply within 15 minutes.</p>
  <a class="primary" id="whatsapp-trip" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp ↗</a>
  <button class="text-button save-secondary" id="save-trip">Save trip details ↓</button>
  <p class="saved-message" role="status"></p>
</dialog>
{FLOAT}
</body>
</html>
'''


def main():
    for r in ROUTES:
        out = ROOT / r['slug'] / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(r), encoding='utf-8')
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
