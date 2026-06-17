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

// Helper prático para selecionar IDs
const $ = (id) => document.getElementById(id);

let dataAtual = new Date('2026-06-02T00:00:00');

function initDashboard(user) {
  // 👤 Nome do usuário no cabeçalho
  const welcome = $("welcomeUser");
  if (welcome) {
    welcome.innerText = user.email.split("@")[0];
  }

  // 📅 Formatação da data por extenso com o ícone integrado
  const fullDate = $("textFullDate");
  if (fullDate) {
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    fullDate.innerHTML = `<span class="material-icons-round">calendar_today</span> ${dataFormatada}`;
  }

  gerarSemana();
  atualizarBanner();
  gerarTimeline();
  atualizarCardsPrincipais(); // Nova integração para atualizar os cards de "Agora" e "Próxima"
}

// 📆 GERADOR DA GRADE DA SEMANA (Calendário Semanal)
function gerarSemana() {
  const week = $("weekGrid");
  if (!week) return;

  week.innerHTML = "";

  let base = new Date(dataAtual);
  let day = base.getDay();
  let diff = day === 0 ? -6 : 1 - day; // Ajuste para começar na segunda-feira
  base.setDate(base.getDate() + diff);

  for (let i = 0; i < 5; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const el = document.createElement("div");
    // Classe atualizada para bater com o style.css (.day-tab)
    el.className = "day-tab"; 

    if (d.toDateString() === dataAtual.toDateString()) {
      el.classList.add("active");
    }

    // Estrutura interna com os seletores corretos (.day-name e .day-num)
    el.innerHTML = `
      <span class="day-name">${d.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', '')}</span>
      <span class="day-num">${d.getDate()}</span>
    `;

    el.onclick = () => {
      dataAtual = d;
      const fullDate = $("textFullDate");
      if (fullDate) {
        const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        fullDate.innerHTML = `<span class="material-icons-round">calendar_today</span> ${dataFormatada}`;
      }
      gerarSemana();
      atualizarBanner();
      atualizarCardsPrincipais();
    };

    week.appendChild(el);
  }
}

// 📢 BANNER INFORMATIVO (Aviso azul elegante)
function atualizarBanner() {
  const banner = $("bannerText");
  if (!banner) return;

  banner.innerHTML = `<span class="emoji-pin">📍</span> Você está visualizando a rotina de <strong>${dataAtual.toLocaleDateString("pt-BR")}</strong>.`;
}

// 📋 RENDERIZADOR DA GRADE HORÁRIA (Coluna Direita)
function gerarTimeline() {
  const timeline = $("timelineList");
  if (!timeline) return;

  const rotina = [
    { nome: "Português", hora: "08:00 - 08:50", sala: "12" },
    { nome: "Matemática", hora: "08:50 - 09:40", sala: "12" },
    { nome: "História", hora: "09:40 - 10:30", sala: "15" }
  ];

  timeline.innerHTML = "";

  rotina.forEach(item => {
    const div = document.createElement("div");
    // Estilização direta em linha simulando blocos limpos para a lista lateral
    div.style.marginBottom = "16px";
    div.style.textAlign = "left";

    div.innerHTML = `
      <strong style="display: block; font-size: 0.95rem; color: #1e293b; font-weight: 600;">${item.nome}</strong>
      <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px; font-weight: 500;">
        ${item.hora} • Sala ${item.sala}
      </div>
    `;

    timeline.appendChild(div);
  });
}

// ✨ GERENCIADOR DINÂMICO DOS CARDS DE ATIVIDADE ("Agora" e "Próxima")
function atualizarCardsPrincipais() {
  const currentName = $("currentSubjectName");
  const currentMeta = $("currentSubjectMeta");
  const currentProgress = $("currentProgressFill");
  const timeLeft = $("timeLeftText");

  const nextName = $("nextSubjectName");
  const nextMeta = $("nextSubjectMeta");

  // Mock ou lógica simples para demonstração visual dinâmica nos cards baseado na seleção
  if (dataAtual.getDay() === 6 || dataAtual.getDay() === 0) {
    // Fim de semana
    if (currentName) currentName.innerText = "Fim de Semana";
    if (currentMeta) currentMeta.innerText = "Aproveite para descansar!";
    if (currentProgress) currentProgress.style.width = "0%";
    if (timeLeft) timeLeft.innerText = "Nenhuma atividade ativa.";
    
    if (nextName) nextName.innerText = "Segunda-feira";
    if (nextMeta) nextMeta.innerHTML = `<span class="material-icons-round">schedule</span> 08:00`;
  } else {
    // Dia de semana letivo normal
    if (currentName) currentName.innerText = "Sem aula acontecendo";
    if (currentMeta) currentMeta.innerText = "Fora do horário escolar.";
    if (currentProgress) currentProgress.style.width = "0%";
    if (timeLeft) timeLeft.innerText = "Nenhhum cronômetro ativo agora.";

    if (nextName) nextName.innerText = "Português";
    if (nextMeta) {
      nextMeta.innerHTML = `
        <span><span class="material-icons-round">schedule</span> 07:30 - 08:20</span>
        <span class="meta-item-separator" style="margin: 0 4px;">|</span>
        <span><span class="material-icons-round">place</span> Sala 12</span>
      `;
    }
  }
}

// 🔐 ESCUTADOR DE AUTENTICAÇÃO DO FIREBASE (Segurança preservada)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  initDashboard(user);
});

// Interação dos botões seletores de dias (Setas da semana)
$("btnPrevDay")?.addEventListener("click", () => {
  dataAtual.setDate(dataAtual.getDate() - 1);
  initDashboard(auth.currentUser);
});

$("btnNextDay")?.addEventListener("click", () => {
  dataAtual.setDate(dataAtual.getDate() + 1);
  initDashboard(auth.currentUser);
});

// Integração opcional para o gatilho visual do Modo Foco
$("btn-foco")?.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.body.classList.add("focus-mode-active");
  } else {
    document.body.classList.remove("focus-mode-active");
  }
});