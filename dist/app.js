const $ = (id) => document.getElementById(id);
const form = $('booking-form');
const dialog = $('trip-dialog');
const today = new Date();
const localDay = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
$('date').min = localDay;
$('date').value = localDay;
$('year').textContent = today.getFullYear();
let trip = null;
$('swap').addEventListener('click', () => { const old = $('pickup').value; $('pickup').value = $('drop').value; $('drop').value = old; });
document.querySelectorAll('[data-from]').forEach(button => button.addEventListener('click', () => { $('pickup').value = button.dataset.from; $('drop').value = button.dataset.to; $('journey').scrollIntoView({behavior:'smooth'}); $('date').focus({preventScroll:true}); }));
document.querySelectorAll('[data-car]').forEach(button => button.addEventListener('click', () => { $('car').value = button.dataset.car; $('journey').scrollIntoView({behavior:'smooth'}); $('pickup').focus({preventScroll:true}); }));
form.addEventListener('submit', event => {
 event.preventDefault();
 const from = $('pickup').value.trim(), to = $('drop').value.trim();
 $('form-error').textContent = '';
 if(!from || !to){ $('form-error').textContent = 'Please enter both pickup and drop cities.'; return; }
 if(from.toLowerCase() === to.toLowerCase()){ $('form-error').textContent = 'Choose a different drop city for your one-way journey.'; return; }
 if(new Date(`${$('date').value}T${$('time').value}`) <= new Date()){ $('form-error').textContent = 'Please choose a pickup date and time in the future.'; return; }
 trip = {from,to,date:$('date').value,time:$('time').value};
 updateWhatsApp();
 $('trip-summary').textContent = `${from} → ${to}\n${new Date(trip.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} · ${trip.time}\nOne-way / Drop taxi`;
 document.querySelector('.saved-message').textContent = '';
 dialog.showModal();
});
function updateWhatsApp(){
 if(!trip)return;
 const message=`Hello VK Signature Travels, I would like a quote for a one-way drop taxi.\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nPreferred car: ${$('car').value}\nPlease confirm availability and the total fare including applicable charges.`;
 $('whatsapp-trip').href='https://wa.me/919677075741?text='+encodeURIComponent(message);
}
$('car').addEventListener('change',updateWhatsApp);
if(document.modelContext?.registerTool){
 try{Promise.resolve(document.modelContext.registerTool({name:'prepare_taxi_enquiry',description:'Fill the visible one-way taxi trip form for review. Does not book a taxi or send any message.',inputSchema:{type:'object',properties:{pickup:{type:'string'},drop:{type:'string'},date:{type:'string'},time:{type:'string'}},required:['pickup','drop','date','time'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){
 const {pickup,drop,date,time}=input;
 if(typeof pickup!=='string'||typeof drop!=='string'||!pickup.trim()||!drop.trim()||pickup.trim().toLowerCase()===drop.trim().toLowerCase()||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Number.isFinite(Date.parse(date+'T'+time))||new Date(date+'T'+time)<=new Date())throw new Error('Provide distinct cities and a valid future pickup date and time.');
 $('pickup').value=pickup.trim();$('drop').value=drop.trim();$('date').value=date;$('time').value=time;$('journey').scrollIntoView();return{status:'prepared',pickup:$('pickup').value,drop:$('drop').value,date:$('date').value,time:$('time').value};
 }})).catch(()=>{});}catch{}
}
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
$('save-trip').addEventListener('click',()=>{
 if(!trip)return;
 const text=`VK Signature Travels — Trip enquiry\n\nPickup: ${trip.from}\nDrop: ${trip.to}\nDate: ${trip.date}\nTime: ${trip.time}\nCar: ${$('car').value}\nTrip: One-way / Drop taxi\n\nThis is an enquiry draft, not a confirmed booking. Availability and total fare must be confirmed with the booking team.`;
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='vk-signature-trip.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.querySelector('.saved-message').textContent='Trip details saved. Your booking is not yet confirmed.';
});
