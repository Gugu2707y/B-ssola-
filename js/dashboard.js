import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1G18Jf6qujcLXRc6Wz4K3VcOqi8jfXY8",
  authDomain: "bancodedadosdourado2.firebaseapp.com",
  projectId: "bancodedadosdourado2",
  storageBucket: "bancodedadosdourado2.firebasestorage.app",
  messagingSenderId: "311352710045",
  appId: "1:311352710045:web:83ccfce9c45a0a266e9574"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// helpers
const $ = (id) => document.getElementById(id);

let dataAtual = new Date('2026-06-02T00:00:00');

function initDashboard(user) {
  // 👤 nome usuário
  const welcome = $("welcomeUserName");
  if (welcome) {
    welcome.innerText = user.email.split("@")[0];
  }

  // 📅 data
  const fullDate = $("textFullDate");
  if (fullDate) {
    fullDate.innerText = dataAtual.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  gerarSemana();
  atualizarBanner();
  gerarTimeline();
}

// 📆 SEMANA
function gerarSemana() {
  const week = $("weekContainer");
  if (!week) return;

  week.innerHTML = "";

  let base = new Date(dataAtual);
  let day = base.getDay();
  let diff = day === 0 ? -6 : 1 - day;
  base.setDate(base.getDate() + diff);

  for (let i = 0; i < 5; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const el = document.createElement("div");
    el.className = "week-day-card";

    if (d.toDateString() === dataAtual.toDateString()) {
      el.classList.add("active");
    }

    el.innerHTML = `
      <small>${d.toLocaleDateString("pt-BR", { weekday: "short" })}</small>
      <h3>${d.getDate()}</h3>
    `;

    el.onclick = () => {
      dataAtual = d;
      gerarSemana();
      atualizarBanner();
    };

    week.appendChild(el);
  }
}

// 📢 BANNER
function atualizarBanner() {
  const banner = $("dashboardBanner");
  if (!banner) return;

  banner.innerHTML = `
    <span class="material-symbols-outlined">info</span>
    <span>📍 ${dataAtual.toLocaleDateString("pt-BR")}</span>
  `;
}

// 📋 TIMELINE
function gerarTimeline() {
  const timeline = $("timelineContainer");
  if (!timeline) return;

  const rotina = [
    { nome: "Português", hora: "08:00 - 08:50", sala: "12" },
    { nome: "Matemática", hora: "08:50 - 09:40", sala: "12" },
    { nome: "História", hora: "09:40 - 10:30", sala: "15" }
  ];

  timeline.innerHTML = "";

  rotina.forEach(item => {
    const div = document.createElement("div");
    div.className = "info-block-card";

    div.innerHTML = `
      <strong>${item.nome}</strong>
      <div style="font-size:12px; opacity:.7">
        ${item.hora} • Sala ${item.sala}
      </div>
    `;

    timeline.appendChild(div);
  });
}

// 🔐 AUTH
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  initDashboard(user);
});

// botões
$("btnPrevDay")?.addEventListener("click", () => {
  dataAtual.setDate(dataAtual.getDate() - 1);
  gerarSemana();
  atualizarBanner();
});

$("btnNextDay")?.addEventListener("click", () => {
  dataAtual.setDate(dataAtual.getDate() + 1);
  gerarSemana();
  atualizarBanner();
});