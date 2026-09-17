const $ = (id) => document.getElementById(id);
const form = $('booking-form');
const dialog = $('trip-dialog');
const pad = (n) => String(n).padStart(2,'0');
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const CARS = [
  {id:'Sedan CNG', seats:'4+1', ow:15, extra:'Carrier mandatory'},
  {id:'Sedan (Non-CNG)', seats:'4+1', ow:15},
  {id:'SUV CNG', seats:'7+1 / 6+1', ow:20, extra:'Carrier mandatory'},
  {id:'SUV (Non-CNG)', seats:'7+1 / 6+1', ow:20, extra:'Carrier mandatory'},
  {id:'Innova', ow:21},
  {id:'Innova Crysta', seats:'6+1', owMin:22, owMax:25}
];
const today = new Date();
const pickupAt = new Date(today.getTime() + 60*60*1000);
pickupAt.setMinutes(0,0,0);
$('date').min = isoDay(today);
$('date').value = isoDay(pickupAt);
$('time').value = `${pad(pickupAt.getHours())}:${pad(pickupAt.getMinutes())}`;
$('year').textContent = today.getFullYear();
let trip = null;

function isRoundTrip(){
  return document.querySelector('input[name="trip-kind"]:checked')?.value === 'round-trip';
}
function tripKindLabel(){
  return isRoundTrip() ? 'Round trip' : 'One-way / Drop taxi';
}
function rateText(car, round){
  if(car.owMin != null){
    const min = round ? car.owMin - 1 : car.owMin;
    const max = round ? car.owMax - 1 : car.owMax;
    return `₹${min}–${max}/km`;
  }
  return `₹${round ? car.ow - 1 : car.ow}/km`;
}
function syncCarOptions(){
  const round = isRoundTrip();
  const current = $('car').value;
  $('car').innerHTML = CARS.map(car => {
    const seats = car.seats ? ` (${car.seats})` : '';
    const extra = car.extra ? ` · ${car.extra}` : '';
    const kind = round ? ' round trip' : ' one-way';
    return `<option value="${car.id}">${car.id}${seats} — ${rateText(car, round)}${kind}${extra}</option>`;
  }).join('');
  if(CARS.some(car => car.id === current)) $('car').value = current;
}
function selectedCarDetails(){
  return $('car').selectedOptions[0].textContent;
}

syncCarOptions();

$('swap').addEventListener('click', () => { const old = $('pickup').value; $('pickup').value = $('drop').value; $('drop').value = old; });
document.querySelectorAll('[data-from]').forEach(button => button.addEventListener('click', () => { $('pickup').value = button.dataset.from; $('drop').value = button.dataset.to; $('journey').scrollIntoView({behavior:'smooth'}); $('date').focus({preventScroll:true}); }));
document.querySelectorAll('[data-car]').forEach(button => button.addEventListener('click', () => { $('car').value = button.dataset.car; $('journey').scrollIntoView({behavior:'smooth'}); $('car').focus({preventScroll:true}); }));
document.querySelectorAll('input[name="trip-kind"]').forEach(input => input.addEventListener('change', () => { syncCarOptions(); updateWhatsApp(); }));
form.addEventListener('submit', event => {
  event.preventDefault();
  const from = $('pickup').value.trim(), to = $('drop').value.trim();
  $('form-error').textContent = '';
  if(!from || !to){ $('form-error').textContent = 'Please enter both pickup and drop cities.'; return; }
  if(from.toLowerCase() === to.toLowerCase()){ $('form-error').textContent = 'Choose a different drop city.'; return; }
  if(new Date(`${$('date').value}T${$('time').value}`) <= new Date()){ $('form-error').textContent = 'Please choose a pickup date and time in the future.'; return; }
  trip = {from,to,date:$('date').value,time:$('time').value,kind:tripKindLabel()};
  updateWhatsApp();
  $('trip-summary').textContent = `${from} → ${to}\n${new Date(trip.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} · ${trip.time}\n${selectedCarDetails()}\n${trip.kind}`;
  document.querySelector('.saved-message').textContent = '';
  dialog.showModal();
});
function updateWhatsApp(){
  if(!trip)return;
  const kind = trip.kind || tripKindLabel();
  const message=`Hello VK Signature Travels, I would like a quote for a ${kind.toLowerCase()} taxi.\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nTrip type: ${kind}\nPreferred car: ${selectedCarDetails()}\nPlease confirm availability and the total fare including applicable charges.`;
  $('whatsapp-trip').href='https://wa.me/919677075741?text='+encodeURIComponent(message);
}
$('car').addEventListener('change',updateWhatsApp);
function trackLead(){
  const payload={event_category:'enquiry'};
  if(typeof window.gtag==='function'){window.gtag('event','generate_lead',payload);}
  else{window.dataLayer=window.dataLayer||[];window.dataLayer.push(Object.assign({event:'generate_lead'},payload));}
}
$('whatsapp-trip').addEventListener('click',trackLead);
if(document.modelContext?.registerTool){
 try{Promise.resolve(document.modelContext.registerTool({name:'prepare_taxi_enquiry',description:'Fill the visible taxi trip form for review. Does not book a taxi or send any message.',inputSchema:{type:'object',properties:{pickup:{type:'string'},drop:{type:'string'},date:{type:'string'},time:{type:'string'}},required:['pickup','drop','date','time'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){
 const {pickup,drop,date,time}=input;
 if(typeof pickup!=='string'||typeof drop!=='string'||!pickup.trim()||!drop.trim()||pickup.trim().toLowerCase()===drop.trim().toLowerCase()||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Number.isFinite(Date.parse(date+'T'+time))||new Date(date+'T'+time)<=new Date())throw new Error('Provide distinct cities and a valid future pickup date and time.');
 $('pickup').value=pickup.trim();$('drop').value=drop.trim();$('date').value=date;$('time').value=time;$('journey').scrollIntoView();return{status:'prepared',pickup:$('pickup').value,drop:$('drop').value,date:$('date').value,time:$('time').value};
 }})).catch(()=>{});}catch{}
}
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
$('save-trip').addEventListener('click',()=>{
 if(!trip)return;
 const text=`VK Signature Travels — Trip enquiry\n\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nCar: ${selectedCarDetails()}\nTrip: ${trip.kind}\n\nThis is an enquiry draft, not a confirmed booking. Availability and total fare must be confirmed with the booking team.`;
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='vk-signature-trip.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.querySelector('.saved-message').textContent='Trip details saved. Your booking is not yet confirmed.';
});
const hideNetlifyHud=()=>{['nl-badge-frame','nl-hud-frame'].forEach(id=>document.getElementById(id)?.remove());};
hideNetlifyHud();
new MutationObserver(hideNetlifyHud).observe(document.documentElement,{childList:true,subtree:true});
