import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = { /* MANTENHA SEU FIREBASE CONFIG AQUI */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const $ = (id) => document.getElementById(id);

// Estado inicial
let dataAtual = new Date(); 

// Estrutura de dados: Dias 0-6 (Dom-Sáb)
let configuracoesSemanais = JSON.parse(localStorage.getItem('configSemana')) || {
    0: { nome: "Domingo", aulas: [] },
    1: { nome: "Segunda", aulas: [{nome: "Português", hora: "08:00", sala: "12"}] },
    2: { nome: "Terça", aulas: [{nome: "Matemática", hora: "08:50", sala: "12"}] },
    3: { nome: "Quarta", aulas: [] },
    4: { nome: "Quinta", aulas: [] },
    5: { nome: "Sexta", aulas: [] },
    6: { nome: "Sábado", aulas: [] }
};

function initDashboard(user) {
    atualizarDashboard();
}

function atualizarDashboard() {
    atualizarDataUI();
    gerarSemana();
    renderizarTimeline();
    atualizarCardsPrincipais();
}

function atualizarDataUI() {
    const fullDate = $("textFullDate");
    if (!fullDate) return;
    
    // Cálculo de dias de diferença
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const alvo = new Date(dataAtual);
    alvo.setHours(0,0,0,0);
    
    const diffTime = alvo - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let avisoRelativo = "";
    if (diffDays === 0) avisoRelativo = "(Hoje)";
    else if (diffDays === 1) avisoRelativo = "(Amanhã)";
    else if (diffDays > 1) avisoRelativo = `(Daqui a ${diffDays} dias)`;
    else if (diffDays === -1) avisoRelativo = "(Ontem)";

    const dataFormatada = dataAtual.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    fullDate.innerHTML = `<span class="material-icons-round">calendar_today</span> ${dataFormatada} <small>${avisoRelativo}</small>`;
}

function gerarSemana() {
    const week = $("weekGrid");
    if (!week) return;
    week.innerHTML = "";

    // Centraliza na semana da dataAtual
    let base = new Date(dataAtual);
    base.setDate(base.getDate() - base.getDay() + 1); // Força começar na segunda

    for (let i = 0; i < 5; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const el = document.createElement("div");
        el.className = `day-tab ${d.toDateString() === dataAtual.toDateString() ? 'active' : ''}`;
        el.innerHTML = `<span class="day-name">${d.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', '')}</span><span class="day-num">${d.getDate()}</span>`;
        el.onclick = () => { dataAtual = d; atualizarDashboard(); };
        week.appendChild(el);
    }
}

function renderizarTimeline() {
    const timeline = $("timelineList");
    if (!timeline) return;
    timeline.innerHTML = "";
    
    const diaIndex = dataAtual.getDay();
    const rotina = configuracoesSemanais[diaIndex]?.aulas || [];

    if (rotina.length === 0) {
        timeline.innerHTML = "<p>Nenhuma aula programada.</p>";
        return;
    }

    rotina.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${item.nome}</strong><br><small>${item.hora} - Sala ${item.sala}</small>`;
        timeline.appendChild(div);
    });
}

// 🛠️ FUNÇÃO PARA ADICIONAR/ALTERAR AULAS (Use no seu Modal)
function adicionarAula(diaIndex, novaAula) {
    configuracoesSemanais[diaIndex].aulas.push(novaAula);
    localStorage.setItem('configSemana', JSON.stringify(configuracoesSemanais));
    atualizarDashboard();
}

function atualizarCardsPrincipais() {
    const dia = dataAtual.getDay();
    // Exemplo de lógica de férias/feriado (Pode ser expandida)
    if (dia === 0 || dia === 6) {
        $("currentSubjectName").innerText = "Fim de Semana / Férias";
    } else {
        $("currentSubjectName").innerText = "Rotina Escolar Ativa";
    }
}

// Navegação de dias
$("btnPrevDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() - 1); atualizarDashboard(); });
$("btnNextDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() + 1); atualizarDashboard(); });

onAuthStateChanged(auth, (user) => {
    if (user) initDashboard(user);
    else window.location.href = "index.html";
});