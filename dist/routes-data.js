/** Shared route distances (approx. highway km) and SEO page metadata. */
window.VK_ROUTES = [
  {
    slug: 'coimbatore-to-munnar-taxi',
    from: 'Coimbatore',
    to: 'Munnar',
    km: 175,
    label: 'Hill station escape',
    blurb: 'One-way and drop taxi from Coimbatore to Munnar. Doorstep pickup, sedan to Innova Crysta.',
    keywords: 'coimbatore to munnar taxi, coimbatore to munnar cab, drop taxi munnar'
  },
  {
    slug: 'coimbatore-to-kodaikanal-taxi',
    from: 'Coimbatore',
    to: 'Kodaikanal',
    km: 170,
    label: 'To the misty hills',
    blurb: 'Book a Coimbatore to Kodaikanal cab for one-way or round trip. Confirm fare on WhatsApp before you travel.',
    keywords: 'coimbatore to kodaikanal cab, coimbatore to kodaikanal taxi'
  },
  {
    slug: 'coimbatore-to-chennai-taxi',
    from: 'Coimbatore',
    to: 'Chennai',
    km: 500,
    label: 'City to coast',
    blurb: 'Coimbatore to Chennai one-way and round-trip taxi. Transparent ₹/km rates, WhatsApp quote in minutes.',
    keywords: 'coimbatore to chennai taxi, coimbatore to chennai cab'
  },
  {
    slug: 'chennai-to-coimbatore-taxi',
    from: 'Chennai',
    to: 'Coimbatore',
    km: 500,
    label: 'The city connection',
    blurb: 'Chennai to Coimbatore drop taxi and round trip. Choose Sedan, SUV, Innova or Crysta.',
    keywords: 'chennai to coimbatore taxi, chennai to coimbatore cab'
  },
  {
    slug: 'chennai-to-madurai-taxi',
    from: 'Chennai',
    to: 'Madurai',
    km: 460,
    label: 'To the temple city',
    blurb: 'Chennai to Madurai one-way taxi with doorstep pickup. Fare confirmed on WhatsApp before booking.',
    keywords: 'chennai to madurai taxi, chennai to madurai cab'
  },
  {
    slug: 'coimbatore-to-ooty-taxi',
    from: 'Coimbatore',
    to: 'Ooty',
    km: 85,
    label: 'A little mountain air',
    blurb: 'Coimbatore to Ooty taxi for day trips and weekend getaways. One-way, drop and round trip.',
    keywords: 'coimbatore to ooty taxi, coimbatore to ooty cab'
  },
  {
    slug: 'trichy-to-chennai-taxi',
    from: 'Trichy',
    to: 'Chennai',
    km: 320,
    label: 'Towards the coast',
    blurb: 'Trichy to Chennai drop taxi and round trip. Outstation rates from ₹15/km for sedan.',
    keywords: 'trichy to chennai taxi, tiruchirappalli to chennai cab'
  },
  {
    slug: 'chennai-to-ooty-taxi',
    from: 'Chennai',
    to: 'Ooty',
    km: 545,
    label: 'Nilgiris from the coast',
    blurb: 'Chennai to Ooty one-way and round-trip taxi. Long-distance comfort with Sedan, SUV or Innova.',
    keywords: 'chennai to ooty taxi, chennai to ooty cab'
  }
];

window.VK_formatInr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

window.VK_fareFrom = (km, rate = 15) => window.VK_formatInr(km * rate);

window.VK_routeBySlug = (slug) => window.VK_ROUTES.find((r) => r.slug === slug);

window.VK_CITY_ALIASES = {
  trichy: ['trichy', 'tiruchirappalli', 'tiruchirapalli'],
  ooty: ['ooty', 'udhagamandalam', 'ootacamund'],
  chennai: ['chennai', 'madras'],
  coimbatore: ['coimbatore', 'kovai'],
  madurai: ['madurai'],
  munnar: ['munnar'],
  kodaikanal: ['kodaikanal', 'kodai']
};

window.VK_placeHasCity = (place, city) => {
  const text = String(place || '').toLowerCase();
  if (!text) return false;
  const key = String(city || '').toLowerCase();
  const aliases = window.VK_CITY_ALIASES[key] || [key];
  return aliases.some((alias) => {
    if (text === alias) return true;
    if (text.startsWith(alias + ',') || text.startsWith(alias + ' ')) return true;
    return new RegExp(`(?:^|[,\\s])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[,\\s])`, 'i').test(text);
  });
};

window.VK_CITY_COORDS = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  madras: { lat: 13.0827, lng: 80.2707 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  kovai: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  tiruchirapalli: { lat: 10.7905, lng: 78.7047 },
  salem: { lat: 11.6643, lng: 78.146 },
  ooty: { lat: 11.4102, lng: 76.695 },
  udhagamandalam: { lat: 11.4102, lng: 76.695 },
  erode: { lat: 11.341, lng: 77.7172 },
  tirunelveli: { lat: 8.7139, lng: 77.7567 },
  thanjavur: { lat: 10.787, lng: 79.1378 },
  vellore: { lat: 12.9165, lng: 79.1325 },
  kanyakumari: { lat: 8.0883, lng: 77.5385 },
  tiruppur: { lat: 11.1085, lng: 77.3411 },
  dindigul: { lat: 10.3624, lng: 77.9754 },
  rameswaram: { lat: 9.2876, lng: 79.3129 },
  kodaikanal: { lat: 10.2381, lng: 77.4892 },
  kodai: { lat: 10.2381, lng: 77.4892 },
  karur: { lat: 10.9601, lng: 78.0766 },
  hosur: { lat: 12.7409, lng: 77.8253 },
  cuddalore: { lat: 11.748, lng: 79.7714 },
  munnar: { lat: 10.0889, lng: 77.0595 }
};

window.VK_coordsFromPlaceText = (place) => {
  const text = String(place || '').toLowerCase();
  if (!text) return null;
  const keys = Object.keys(window.VK_CITY_COORDS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (window.VK_placeHasCity(text, key)) return window.VK_CITY_COORDS[key];
  }
  return null;
};

window.VK_routeByCities = (from, to) =>
  window.VK_ROUTES.find((r) => window.VK_placeHasCity(from, r.from) && window.VK_placeHasCity(to, r.to));
