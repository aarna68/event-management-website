const events = [
  {id:1,title:"FutureTech Summit",category:"technology",date:"NOV 18",fullDate:"18 November 2026",venue:"KIIT Convention Centre",time:"10:00 AM",icon:"⚡",desc:"A day of AI, innovation and emerging technology with student builders, founders and industry experts."},
  {id:2,title:"Neon Nights",category:"music",date:"NOV 27",fullDate:"27 November 2026",venue:"Ekamra Arena",time:"7:00 PM",icon:"🎶",desc:"An electrifying live music night featuring independent artists, immersive lights and unforgettable performances."},
  {id:3,title:"Startup Unlocked",category:"business",date:"DEC 05",fullDate:"5 December 2026",venue:"KIIT School of Management",time:"11:00 AM",icon:"🚀",desc:"Meet founders, investors and ambitious creators in a practical day of startup stories and networking."},
  {id:4,title:"Canvas & Coffee",category:"creative",date:"DEC 12",fullDate:"12 December 2026",venue:"The Garden Studio",time:"4:00 PM",icon:"🎨",desc:"Slow down, pick up a brush and create your own artwork while enjoying coffee and good conversations."},
  {id:5,title:"Design Forward",category:"creative",date:"DEC 19",fullDate:"19 December 2026",venue:"Innovation Hub",time:"9:30 AM",icon:"✦",desc:"A hands-on creative workshop covering product thinking, visual design and building delightful digital experiences."},
  {id:6,title:"Code & Connect",category:"technology",date:"JAN 09",fullDate:"9 January 2027",venue:"KIIT Auditorium",time:"10:00 AM",icon:"💻",desc:"Code, collaborate and connect at a beginner-friendly tech meetup built around ideas, projects and community."}
];

const grid = document.getElementById("eventGrid");
const search = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const select = document.getElementById("eventSelect");
let activeCategory = "all";

function renderEvents(){
  const q = search.value.trim().toLowerCase();
  const filtered = events.filter(e =>
    (activeCategory === "all" || e.category === activeCategory) &&
    `${e.title} ${e.category} ${e.venue} ${e.desc}`.toLowerCase().includes(q)
  );
  grid.innerHTML = filtered.map(e => `
    <article class="event-card">
      <div class="event-image ${e.category}">
        <span class="date">${e.date}</span><span>${e.icon}</span>
      </div>
      <div class="event-body">
        <span class="category">${e.category.toUpperCase()}</span>
        <h3>${e.title}</h3>
        <p>${e.desc}</p>
        <div class="event-meta">
          <span>📍 ${e.venue}</span>
          <button class="view-btn" onclick="showEvent(${e.id})">Details →</button>
        </div>
      </div>
    </article>`).join("");
  document.getElementById("noResults").classList.toggle("hidden", filtered.length !== 0);
}

function populateSelect(){
  select.innerHTML = `<option value="">Choose an event</option>` +
    events.map(e => `<option value="${e.id}">${e.title} — ${e.fullDate}</option>`).join("");
}

function showEvent(id){
  const e = events.find(x => x.id === id);
  document.getElementById("modalContent").innerHTML = `
    <div class="modal-top ${e.category}">${e.icon}</div>
    <div class="modal-info">
      <span class="category">${e.category.toUpperCase()}</span>
      <h2>${e.title}</h2>
      <p>${e.desc}</p>
      <p><strong>📅 ${e.fullDate}</strong><br>🕐 ${e.time}<br>📍 ${e.venue}</p>
      <button class="btn primary" onclick="chooseEvent(${e.id})">Register for this event →</button>
    </div>`;
  document.getElementById("eventModal").showModal();
}
function chooseEvent(id){
  select.value = id;
  document.getElementById("eventModal").close();
  document.getElementById("register").scrollIntoView({behavior:"smooth"});
  showToast("Event selected. Complete the registration form.");
}
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("eventModal").close());
document.getElementById("eventModal").addEventListener("click",e=>{if(e.target.id==="eventModal")e.target.close()});
search.addEventListener("input",renderEvents);
filters.addEventListener("click",e=>{
  if(!e.target.matches(".filter")) return;
  activeCategory=e.target.dataset.category;
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  renderEvents();
});

document.getElementById("registrationForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const eventId=select.value;
  const terms=document.getElementById("terms").checked;
  const msg=document.getElementById("formMessage");
  const errors=[];
  if(name.length<3) errors.push("Enter a valid name");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Enter a valid email");
  if(!/^\d{10}$/.test(phone)) errors.push("Enter a valid 10-digit phone number");
  if(!eventId) errors.push("Select an event");
  if(!terms) errors.push("Accept the update preference");
  if(errors.length){msg.className="form-message error";msg.textContent=errors[0]+".";return;}
  const event=events.find(x=>x.id===Number(eventId));
  const registration={name,email,phone,event:event.title,date:event.fullDate,registeredAt:new Date().toISOString()};
  const saved=JSON.parse(localStorage.getItem("eventoraRegistrations")||"[]");
  saved.push(registration);localStorage.setItem("eventoraRegistrations",JSON.stringify(saved));
  msg.className="form-message success";
  msg.textContent=`Registration successful! ${name}, your spot for ${event.title} is reserved.`;
  e.target.reset();
  showToast("Registration confirmed ✓");
});

function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2800);
}
document.getElementById("themeToggle").addEventListener("click",()=>{
  const dark=document.documentElement.getAttribute("data-theme")==="dark";
  document.documentElement.setAttribute("data-theme",dark?"light":"dark");
  document.getElementById("themeToggle").textContent=dark?"☾":"☀";
  localStorage.setItem("eventoraTheme",dark?"light":"dark");
});
if(localStorage.getItem("eventoraTheme")==="dark"){document.documentElement.setAttribute("data-theme","dark");document.getElementById("themeToggle").textContent="☀";}
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));

populateSelect();
renderEvents();
