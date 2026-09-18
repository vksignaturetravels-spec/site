const $ = (id) => document.getElementById(id);
const form = $('booking-form');
const dialog = $('trip-dialog');
const VK_MAPS_KEY = 'AIzaSyCMGXH6Uea9yrGqFO7VVs8jbpjARl3esJI';
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const CARS = [
  { id: 'Sedan CNG', seats: '4+1', ow: 15, extra: 'Carrier mandatory' },
  { id: 'Sedan (Non-CNG)', seats: '4+1', ow: 15 },
  { id: 'SUV CNG', seats: '7+1 / 6+1', ow: 20, extra: 'Carrier mandatory' },
  { id: 'SUV (Non-CNG)', seats: '7+1 / 6+1', ow: 20, extra: 'Carrier mandatory' },
  { id: 'Innova', ow: 21 },
  { id: 'Innova Crysta', seats: '6+1', owMin: 22, owMax: 25 }
];
const today = new Date();
const pickupAt = new Date(today.getTime() + 60 * 60 * 1000);
pickupAt.setMinutes(0, 0, 0);
if ($('date')) {
  $('date').min = isoDay(today);
  $('date').value = isoDay(pickupAt);
}
if ($('time')) $('time').value = `${pad(pickupAt.getHours())}:${pad(pickupAt.getMinutes())}`;
if ($('year')) $('year').textContent = today.getFullYear();
let trip = null;
const placeFields = { pickup: null, drop: null };

function placeLabel(place, fallback) {
  if (!place) return fallback || '';
  return place.formatted_address || place.name || fallback || '';
}

function restoreLocationInput(input, id) {
  if (!input) return;
  const broken =
    input.disabled ||
    input.readOnly ||
    /oops|something went wrong/i.test(input.placeholder || '');
  if (!broken) return;
  input.disabled = false;
  input.readOnly = false;
  input.placeholder = id === 'pickup' ? 'Search pickup location' : 'Search drop location';
}

function hardenLocationInputs() {
  ['pickup', 'drop'].forEach((id) => restoreLocationInput($(id), id));
}

function bindPlaceAutocomplete() {
  if (!window.google?.maps?.places) return;
  const opts = {
    fields: ['formatted_address', 'name', 'geometry', 'address_components', 'place_id'],
    componentRestrictions: { country: 'in' }
  };
  ['pickup', 'drop'].forEach((id) => {
    const input = $(id);
    if (!input || input.dataset.placesBound === '1') return;
    input.dataset.placesBound = '1';
    input.setAttribute('autocomplete', 'off');
    try {
      const ac = new google.maps.places.Autocomplete(input, opts);
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        placeFields[id] = place || null;
        const label = placeLabel(place, input.value.trim());
        if (label) input.value = label;
        updateLiveEstimate();
      });
    } catch (err) {
      console.warn('Places autocomplete unavailable', err);
      restoreLocationInput(input, id);
    }
    input.addEventListener('input', () => {
      placeFields[id] = null;
      restoreLocationInput(input, id);
    });
  });
  hardenLocationInputs();
  setTimeout(hardenLocationInputs, 500);
  setTimeout(hardenLocationInputs, 2000);
  setInterval(hardenLocationInputs, 3000);
}

function loadGooglePlaces() {
  if (!$('pickup') || !$('drop')) return;
  window.gm_authFailure = () => {
    hardenLocationInputs();
    const el = $('live-estimate');
    if (el && !lastEstimate && ($('fare-amount')?.textContent === '—' || !$('fare-amount')?.textContent)) {
      el.textContent =
        'Google location search is unavailable (API key / Places API). You can still type addresses manually.';
    }
  };
  if (window.google?.maps?.places) {
    bindPlaceAutocomplete();
    return;
  }
  if (document.getElementById('vk-google-maps')) return;
  window.initVkPlaces = bindPlaceAutocomplete;
  const script = document.createElement('script');
  script.id = 'vk-google-maps';
  script.async = true;
  script.defer = true;
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=' +
    encodeURIComponent(VK_MAPS_KEY) +
    '&libraries=places&callback=initVkPlaces&loading=async';
  script.onerror = () => {
    hardenLocationInputs();
    const el = $('live-estimate');
    if (el && !el.dataset.mapsError) {
      el.dataset.mapsError = '1';
      el.textContent = 'Location suggestions unavailable. You can still type pickup and drop addresses.';
    }
  };
  document.head.appendChild(script);
}

function isRoundTrip() {
  return document.querySelector('input[name="trip-kind"]:checked')?.value === 'round-trip';
}
function tripKindLabel() {
  return isRoundTrip() ? 'Round trip' : 'One-way / Drop taxi';
}
function rateText(car, round) {
  if (car.owMin != null) {
    const min = round ? car.owMin - 1 : car.owMin;
    const max = round ? car.owMax - 1 : car.owMax;
    return `₹${min}–${max}/km`;
  }
  return `₹${round ? car.ow - 1 : car.ow}/km`;
}
function selectedCar() {
  return CARS.find((c) => c.id === $('car').value) || CARS[0];
}
function carRate(car, round) {
  if (car.owMin != null) return round ? car.owMin - 1 : car.owMin;
  return round ? car.ow - 1 : car.ow;
}

let estimateSeq = 0;
let lastEstimate = null;

function latLngOf(place) {
  const loc = place?.geometry?.location;
  if (!loc) return null;
  return {
    lat: typeof loc.lat === 'function' ? loc.lat() : Number(loc.lat),
    lng: typeof loc.lng === 'function' ? loc.lng() : Number(loc.lng)
  };
}

function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const MIN_ONE_WAY_KM = 130;
const MIN_ROUND_TRIP_KM = 250;

function samePlace(from, to) {
  const a = String(from || '').trim().toLowerCase();
  const b = String(to || '').trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  const cities = Object.keys(window.VK_CITY_COORDS || {}).sort((x, y) => y.length - x.length);
  for (const city of cities) {
    if (window.VK_placeHasCity?.(a, city) && window.VK_placeHasCity?.(b, city)) return true;
  }
  return false;
}

function formatEstimateLine(oneWayKm, source) {
  const car = selectedCar();
  const round = isRoundTrip();
  const rate = carRate(car, round);
  const leg = Math.max(1, Math.round(oneWayKm));
  const rawBillable = round ? leg * 2 : leg;
  const billableKm =
    source === 'local'
      ? round
        ? MIN_ROUND_TRIP_KM
        : MIN_ONE_WAY_KM
      : round
        ? Math.max(rawBillable, MIN_ROUND_TRIP_KM)
        : Math.max(rawBillable, MIN_ONE_WAY_KM);
  const usedMin = billableKm > rawBillable || source === 'local';
  const base = billableKm * rate;
  const label = round ? 'round-trip base' : 'one-way base';
  let dist;
  if (source === 'local') {
    dist = round
      ? `same-city package · ${billableKm} km min`
      : `same-city / local · ${billableKm} km min`;
  } else if (round) {
    dist = usedMin
      ? `~${leg} km each way · billed ${billableKm} km min`
      : `~${leg} km each way · ~${billableKm} km total`;
  } else if (usedMin) {
    dist = `~${leg} km · billed ${billableKm} km min`;
  } else if (source === 'driving') {
    dist = `~${leg} km driving`;
  } else if (source === 'table') {
    dist = `~${leg} km`;
  } else {
    dist = `~${leg} km (approx)`;
  }
  return `Approx. ${label} for ${dist} at ₹${rate}/km (${car.id}): ${window.VK_formatInr(base)}. Tolls, driver bata, parking and night charges are extra — confirmed on WhatsApp.`;
}

function applyKmEstimate(oneWayKm, source) {
  if (source !== 'local' && (!Number.isFinite(oneWayKm) || oneWayKm <= 0)) return false;
  const car = selectedCar();
  const round = isRoundTrip();
  const rate = carRate(car, round);
  const leg = source === 'local' ? (round ? MIN_ROUND_TRIP_KM / 2 : MIN_ONE_WAY_KM) : Math.max(1, Math.round(oneWayKm));
  const rawBillable = round ? leg * 2 : leg;
  const billableKm =
    source === 'local'
      ? round
        ? MIN_ROUND_TRIP_KM
        : MIN_ONE_WAY_KM
      : round
        ? Math.max(rawBillable, MIN_ROUND_TRIP_KM)
        : Math.max(rawBillable, MIN_ONE_WAY_KM);
  const base = billableKm * rate;
  lastEstimate = {
    km: leg,
    billableKm,
    round,
    source,
    text: formatEstimateLine(leg, source)
  };
  if ($('fare-amount')) $('fare-amount').textContent = window.VK_formatInr(base);
  if ($('rate-tag')) $('rate-tag').textContent = `₹${rate}/km`;
  if ($('trip-kind-label')) {
    $('trip-kind-label').textContent = round
      ? `Round trip · min ${MIN_ROUND_TRIP_KM} km`
      : `One-way · min ${MIN_ONE_WAY_KM} km`;
  }
  if ($('live-estimate')) $('live-estimate').textContent = lastEstimate.text;
  return true;
}

function clearEstimate(message) {
  lastEstimate = null;
  if ($('fare-amount')) $('fare-amount').textContent = '—';
  if ($('live-estimate') && message) $('live-estimate').textContent = message;
}

function estimateLine(from, to) {
  if (lastEstimate?.text) return lastEstimate.text;
  const match = window.VK_routeByCities?.(from, to);
  if (!match) return '';
  return formatEstimateLine(match.km, 'table');
}

function requestDrivingKm(origin, destination, seq) {
  if (!window.google?.maps?.DistanceMatrixService) return;
  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    },
    (response, status) => {
      if (seq !== estimateSeq) return;
      const el = response?.rows?.[0]?.elements?.[0];
      if (status !== 'OK' || el?.status !== 'OK' || !el.distance?.value) return;
      applyKmEstimate(el.distance.value / 1000, 'driving');
    }
  );
}

function geocodeAddress(address) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.Geocoder) {
      resolve(null);
      return;
    }
    new google.maps.Geocoder().geocode(
      { address, componentRestrictions: { country: 'in' } },
      (results, status) => {
        if (status !== 'OK' || !results?.[0]?.geometry?.location) {
          resolve(null);
          return;
        }
        resolve(latLngOf({ geometry: results[0].geometry }));
      }
    );
  });
}

async function resolveDistanceKm(from, to, seq) {
  const known = window.VK_routeByCities?.(from, to);
  if (known) {
    applyKmEstimate(known.km, 'table');
    return;
  }

  const fromLL = latLngOf(placeFields.pickup) || window.VK_coordsFromPlaceText?.(from);
  const toLL = latLngOf(placeFields.drop) || window.VK_coordsFromPlaceText?.(to);
  if (fromLL && toLL) {
    applyKmEstimate(haversineKm(fromLL, toLL) * 1.3, 'approx');
    requestDrivingKm(fromLL, toLL, seq);
    return;
  }

  if ($('fare-amount')) $('fare-amount').textContent = '…';
  if ($('live-estimate')) $('live-estimate').textContent = 'Calculating rough distance…';

  if (window.google?.maps?.DistanceMatrixService) {
    requestDrivingKm(from, to, seq);
  }

  if (window.google?.maps?.Geocoder) {
    const [a, b] = await Promise.all([geocodeAddress(from), geocodeAddress(to)]);
    if (seq !== estimateSeq) return;
    if (a && b) {
      if (!lastEstimate || lastEstimate.source !== 'driving') {
        applyKmEstimate(haversineKm(a, b) * 1.3, 'approx');
      }
      requestDrivingKm(a, b, seq);
      return;
    }
  }

  if (seq !== estimateSeq) return;
  if (!lastEstimate) {
    clearEstimate('Custom route — we will confirm distance and the full fare on WhatsApp.');
  }
}

function updateLiveEstimate() {
  const from = $('pickup')?.value.trim() || '';
  const to = $('drop')?.value.trim() || '';
  const car = selectedCar();
  const round = isRoundTrip();
  const rate = carRate(car, round);
  if ($('rate-tag')) $('rate-tag').textContent = `₹${rate}/km`;
  if ($('trip-kind-label')) {
    $('trip-kind-label').textContent = round
      ? `Round trip · min ${MIN_ROUND_TRIP_KM} km`
      : `One-way · min ${MIN_ONE_WAY_KM} km`;
  }

  if (!from || !to) {
    clearEstimate('Search pickup and drop to see a rough base fare.');
    return;
  }

  if (samePlace(from, to)) {
    applyKmEstimate(round ? MIN_ROUND_TRIP_KM / 2 : MIN_ONE_WAY_KM, 'local');
    return;
  }

  const seq = ++estimateSeq;
  const known = window.VK_routeByCities?.(from, to);
  if (known) {
    applyKmEstimate(known.km, 'table');
    return;
  }

  resolveDistanceKm(from, to, seq);
}

function syncCarOptions() {
  if (!$('car')) return;
  const round = isRoundTrip();
  const current = $('car').value;
  $('car').innerHTML = CARS.map((car) => {
    const seats = car.seats ? ` (${car.seats})` : '';
    const extra = car.extra ? ` · ${car.extra}` : '';
    const kind = round ? ' round trip' : ' one-way';
    return `<option value="${car.id}">${car.id}${seats} — ${rateText(car, round)}${kind}${extra}</option>`;
  }).join('');
  if (CARS.some((car) => car.id === current)) $('car').value = current;
}
function selectedCarDetails() {
  return $('car').selectedOptions[0].textContent;
}

syncCarOptions();

const params = new URLSearchParams(location.search);
const prefillFrom = document.body.dataset.from || params.get('from');
const prefillTo = document.body.dataset.to || params.get('to');
const prefillCar = document.body.dataset.car || params.get('car');
if (prefillFrom && $('pickup')) $('pickup').value = prefillFrom;
if (prefillTo && $('drop')) $('drop').value = prefillTo;
if (prefillCar && $('car') && CARS.some((c) => c.id === prefillCar)) $('car').value = prefillCar;
updateLiveEstimate();

$('swap')?.addEventListener('click', () => {
  const old = $('pickup').value;
  $('pickup').value = $('drop').value;
  $('drop').value = old;
  const oldPlace = placeFields.pickup;
  placeFields.pickup = placeFields.drop;
  placeFields.drop = oldPlace;
  updateLiveEstimate();
});
document.querySelectorAll('[data-from]').forEach((el) => {
  if (el === document.body || el.tagName === 'BODY') return;
  el.addEventListener('click', () => {
    if (el.tagName === 'A' && el.getAttribute('href')?.includes('-taxi')) return;
    $('pickup').value = el.dataset.from;
    $('drop').value = el.dataset.to;
    $('journey').scrollIntoView({ behavior: 'smooth' });
    $('date')?.focus({ preventScroll: true });
    updateLiveEstimate();
  });
});
document.querySelectorAll('[data-car]').forEach((button) =>
  button.addEventListener('click', () => {
    $('car').value = button.dataset.car;
    syncCarOptions();
    $('car').value = button.dataset.car;
    $('journey').scrollIntoView({ behavior: 'smooth' });
    $('car').focus({ preventScroll: true });
    updateLiveEstimate();
  })
);
document.querySelectorAll('input[name="trip-kind"]').forEach((input) =>
  input.addEventListener('change', () => {
    syncCarOptions();
    updateWhatsApp();
    updateLiveEstimate();
  })
);
let estimateTimer = null;
['pickup', 'drop'].forEach((id) => {
  $(id)?.addEventListener('input', () => {
    clearTimeout(estimateTimer);
    estimateTimer = setTimeout(updateLiveEstimate, 350);
  });
  $(id)?.addEventListener('change', updateLiveEstimate);
});
$('car')?.addEventListener('change', () => {
  updateWhatsApp();
  updateLiveEstimate();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const from = $('pickup').value.trim();
  const to = $('drop').value.trim();
  $('form-error').textContent = '';
  if (!from || !to) {
    $('form-error').textContent = 'Please choose both pickup and drop locations.';
    return;
  }
  if (new Date(`${$('date').value}T${$('time').value}`) <= new Date()) {
    $('form-error').textContent = 'Please choose a pickup date and time in the future.';
    return;
  }
  trip = { from, to, date: $('date').value, time: $('time').value, kind: tripKindLabel() };
  updateWhatsApp();
  const estimate = estimateLine(from, to);
  $('trip-summary').textContent = `${from} → ${to}\n${new Date(trip.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · ${trip.time}\n${selectedCarDetails()}\n${trip.kind}${estimate ? '\n\n' + estimate : ''}`;
  document.querySelector('.saved-message').textContent = '';
  dialog.showModal();
});

function updateWhatsApp() {
  if (!trip) return;
  const kind = trip.kind || tripKindLabel();
  const estimate = estimateLine(trip.from, trip.to);
  const message = `Hello VK Signature Travels, I would like a quote for a ${kind.toLowerCase()} taxi.\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nTrip type: ${kind}\nPreferred car: ${selectedCarDetails()}${estimate ? '\nEstimate note: ' + estimate : ''}\nPlease confirm availability and the total fare including applicable charges.`;
  $('whatsapp-trip').href = 'https://wa.me/919677075741?text=' + encodeURIComponent(message);
}

function trackLead() {
  const payload = { event_category: 'enquiry' };
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', payload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: 'generate_lead' }, payload));
  }
}
$('whatsapp-trip')?.addEventListener('click', trackLead);

if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(
      document.modelContext.registerTool({
        name: 'prepare_taxi_enquiry',
        description: 'Fill the visible taxi trip form for review. Does not book a taxi or send any message.',
        inputSchema: {
          type: 'object',
          properties: {
            pickup: { type: 'string' },
            drop: { type: 'string' },
            date: { type: 'string' },
            time: { type: 'string' }
          },
          required: ['pickup', 'drop', 'date', 'time'],
          additionalProperties: false
        },
        annotations: { readOnlyHint: false },
        execute(input) {
          const { pickup, drop, date, time } = input;
          if (
            typeof pickup !== 'string' ||
            typeof drop !== 'string' ||
            !pickup.trim() ||
            !drop.trim() ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
            !Number.isFinite(Date.parse(date + 'T' + time)) ||
            new Date(date + 'T' + time) <= new Date()
          )
            throw new Error('Provide pickup, drop, and a valid future pickup date and time.');
          $('pickup').value = pickup.trim();
          $('drop').value = drop.trim();
          $('date').value = date;
          $('time').value = time;
          $('journey').scrollIntoView();
          updateLiveEstimate();
          return {
            status: 'prepared',
            pickup: $('pickup').value,
            drop: $('drop').value,
            date: $('date').value,
            time: $('time').value
          };
        }
      })
    ).catch(() => {});
  } catch {}
}

document.querySelector('.close-dialog')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
$('save-trip')?.addEventListener('click', () => {
  if (!trip) return;
  const text = `VK Signature Travels — Trip enquiry\n\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nCar: ${selectedCarDetails()}\nTrip: ${trip.kind}\n\nThis is an enquiry draft, not a confirmed booking. Availability and total fare must be confirmed with the booking team.`;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vk-signature-trip.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('.saved-message').textContent = 'Trip details saved. Your booking is not yet confirmed.';
});

const hideNetlifyHud = () => {
  ['nl-badge-frame', 'nl-hud-frame'].forEach((id) => document.getElementById(id)?.remove());
};
hideNetlifyHud();
new MutationObserver(hideNetlifyHud).observe(document.documentElement, { childList: true, subtree: true });

document.querySelectorAll('[data-fill-route-fares]').forEach((grid) => {
  const routes = window.VK_ROUTES || [];
  grid.innerHTML = routes
    .slice(0, Number(grid.dataset.fillRouteFares) || 8)
    .map((r) => {
      const href = grid.dataset.base ? `${grid.dataset.base}${r.slug}/` : `./${r.slug}/`;
      return `<a class="fare-card" href="${href}"><span class="route-index">${r.label.toUpperCase()}</span><span class="fare-cities">${r.from} <span>↗</span><br>${r.to}</span><span class="fare-amount">From ${window.VK_fareFrom(r.km)}<small> sedan · ~${r.km} km · one-way base</small></span></a>`;
    })
    .join('');
});

loadGooglePlaces();
