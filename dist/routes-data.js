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

window.VK_routeByCities = (from, to) => {
  const a = from.trim().toLowerCase();
  const b = to.trim().toLowerCase();
  return window.VK_ROUTES.find((r) => r.from.toLowerCase() === a && r.to.toLowerCase() === b);
};
