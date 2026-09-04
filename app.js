const sampleProfessionals=[
{id:"TL-1001",name:"Ravi Kumar Services",phone:"9876543210",category:"Electrician",area:"Vizianagaram",services:"Home wiring, fan repair, electrical maintenance",notes:"Identity and service details checked.",rating:4.8,verified:true,verifiedAt:"2026-08-20"},
{id:"TL-1002",name:"Sai AC Care",phone:"9123456780",category:"AC Technician",area:"Visakhapatnam",services:"AC service, installation, gas filling",notes:"Professional profile verified.",rating:4.6,verified:true,verifiedAt:"2026-08-18"},
{id:"TL-1003",name:"Krishna Plumbing Works",phone:"9988776655",category:"Plumber",area:"Vizianagaram",services:"Pipe repair, bathroom fittings, leakage repair",notes:"Customer-listed profile.",rating:4.2,verified:false,verifiedAt:null},
{id:"TL-1004",name:"TechFix Solutions",phone:"9000012345",category:"Mobile/Laptop Repair",area:"Vizianagaram",services:"Phone repair, laptop service, software support",notes:"Profile information recorded.",rating:4.7,verified:true,verifiedAt:"2026-08-22"},
{id:"TL-1005",name:"Srinivas Home Care",phone:"9555512345",category:"Carpenter",area:"Visakhapatnam",services:"Furniture repair, doors, modular work",notes:"Customer-listed profile.",rating:4.5,verified:false,verifiedAt:null}
];

let professionals=JSON.parse(localStorage.getItem("trustlayer_user_profiles")||"null")||sampleProfessionals;
let activeFilter="all";

const $=id=>document.getElementById(id);
const results=$("results"),empty=$("emptyState"),search=$("searchInput"),category=$("categoryFilter"),locationInput=$("locationInput"),modal=$("profileModal"),profile=$("profileContent");

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function render(){
 const q=search.value.trim().toLowerCase(), cat=category.value, loc=locationInput.value.trim().toLowerCase();
 let list=professionals.filter(p=>{
  const text=`${p.name} ${p.category} ${p.area} ${p.services} ${p.notes}`.toLowerCase();
  const qok=!q||text.includes(q), cok=!cat||p.category===cat, lok=!loc||(p.area||"").toLowerCase().includes(loc);
  const fok=activeFilter==="all"||(activeFilter==="verified"&&p.verified)||(activeFilter==="top"&&Number(p.rating)>=4.5);
  return qok&&cok&&lok&&fok;
 });
 list.sort((a,b)=>Number(b.verified)-Number(a.verified)||Number(b.rating)-Number(a.rating));
 results.innerHTML=list.map(card).join("");
 empty.classList.toggle("hidden",list.length>0);
 $("resultCount").textContent=`${list.length} result${list.length===1?"":"s"}`;
}

function card(p){
 return `<article class="card">
 <div class="card-top"><div><h3 class="name">${esc(p.name)}</h3><div class="category">${esc(p.category)}</div></div>
 <span class="badge ${p.verified?"":"unverified"}">${p.verified?"✓ Verified":"Not verified"}</span></div>
 <div class="meta"><span>📍 ${esc(p.area||"Location not provided")}</span><span>⭐ ${Number(p.rating).toFixed(1)}</span></div>
 <div class="services">🛠 ${esc(p.services||"Services not listed")}</div>
 <div class="actions">
 <button class="action primary" onclick="openProfile('${p.id}')">View Profile</button>
 <button class="action" onclick="callPro('${p.phone}')">📞 Call</button>
 <button class="action" onclick="waPro('${p.phone}')">💬 WhatsApp</button>
 </div></article>`;
}

function openProfile(id){
 const p=professionals.find(x=>x.id===id);if(!p)return;
 profile.innerHTML=`<div class="profile-title"><h2>${esc(p.name)}</h2><div class="category">${esc(p.category)}</div><p>${p.verified?"✓ Verification record available":"⚠ No verification record available"}</p></div>
 <div class="profile-row"><div class="profile-label">LOCATION</div><div class="profile-value">📍 ${esc(p.area||"Not provided")}</div></div>
 <div class="profile-row"><div class="profile-label">SERVICES</div><div class="profile-value">${esc(p.services||"Not provided")}</div></div>
 <div class="profile-row"><div class="profile-label">RATING</div><div class="profile-value">⭐ ${Number(p.rating).toFixed(1)} / 5</div></div>
 <div class="profile-row"><div class="profile-label">VERIFICATION</div><div class="profile-value">${p.verified?"Verified on "+esc(p.verifiedAt||"recorded date"):"This profile has not been marked verified."}</div></div>
 <div class="profile-row"><div class="profile-label">PROFILE ID</div><div class="profile-value">${esc(p.id)}</div></div>
 <div class="profile-row"><div class="profile-label">NOTES</div><div class="profile-value">${esc(p.notes||"No notes available")}</div></div>
 <div class="profile-actions"><button class="primary" onclick="callPro('${p.phone}')">📞 Call</button><button onclick="waPro('${p.phone}')">💬 WhatsApp</button></div>`;
 modal.classList.remove("hidden");
}

function callPro(phone){if(phone)location.href=`tel:${phone}`;}
function waPro(phone){if(phone){const clean=phone.replace(/\D/g,"");location.href=`https://wa.me/91${clean}`;}}

search.addEventListener("input",render);category.addEventListener("change",render);locationInput.addEventListener("input",render);

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
 btn.classList.add("active");activeFilter=btn.dataset.filter;render();
}));

document.querySelectorAll(".quick-categories button").forEach(btn=>btn.addEventListener("click",()=>{
 category.value=btn.dataset.cat;search.value="";render();
}));

$("closeModal").addEventListener("click",()=>modal.classList.add("hidden"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.add("hidden")});
$("themeBtn").addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 localStorage.setItem("trustlayer_theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("trustlayer_theme")==="dark")document.body.classList.add("dark");
render();
