// ... (mantenha seu firebaseConfig e inicializações acima)

// Helper prático
const $ = (id) => document.getElementById(id);

let dataAtual = new Date(); // Inicia com a data real

// ⚙️ ESTRUTURA DE DADOS PERSISTENTE
// Salvamos no localStorage por índice de dia (1=Seg, 2=Ter, etc)
let configSemana = JSON.parse(localStorage.getItem('configEscolar')) || {
    1: { nome: "Segunda", aulas: [{nome: "Português", hora: "08:00 - 08:50", sala: "12"}] },
    2: { nome: "Terça", aulas: [{nome: "Matemática", hora: "08:50 - 09:40", sala: "12"}] },
    3: { nome: "Quarta", aulas: [] },
    4: { nome: "Quinta", aulas: [] },
    5: { nome: "Sexta", aulas: [] }
};

function salvarConfiguracao(diaIndex, novaListaAulas) {
    configSemana[diaIndex].aulas = novaListaAulas;
    localStorage.setItem('configEscolar', JSON.stringify(configSemana));
}

function initDashboard(user) {
    const welcome = $("welcomeUser");
    if (welcome) welcome.innerText = user.email.split("@")[0];

    atualizarDataUI();
    gerarSemana();
    atualizarBanner();
    gerarTimeline();
    atualizarCardsPrincipais();
}

function atualizarDataUI() {
    const fullDate = $("textFullDate");
    if (!fullDate) return;
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    fullDate.innerHTML = `<span class="material-icons-round">calendar_today</span> ${dataFormatada}`;
}

// 📆 GERADOR DA GRADE DA SEMANA (Calendário Semanal)
function gerarSemana() {
    const week = $("weekGrid");
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
        el.className = "day-tab";
        if (d.toDateString() === dataAtual.toDateString()) el.classList.add("active");

        el.innerHTML = `
            <span class="day-name">${d.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', '')}</span>
            <span class="day-num">${d.getDate()}</span>
        `;

        el.onclick = () => {
            dataAtual = d;
            initDashboard(auth.currentUser);
        };
        week.appendChild(el);
    }
}

// 📋 RENDERIZADOR DA GRADE HORÁRIA (Coluna Direita)
function gerarTimeline() {
    const timeline = $("timelineList");
    if (!timeline) return;
    timeline.innerHTML = "";

    const diaIndex = dataAtual.getDay();
    // Pega a configuração específica para este dia da semana (1-5)
    const rotinaDoDia = configSemana[diaIndex]?.aulas || [];

    rotinaDoDia.forEach(item => {
        const div = document.createElement("div");
        div.style.marginBottom = "16px";
        div.innerHTML = `
            <strong style="display: block; font-size: 0.95rem; color: #1e293b;">${item.nome}</strong>
            <div style="font-size: 0.8rem; color: #64748b;">${item.hora} • Sala ${item.sala}</div>
        `;
        timeline.appendChild(div);
    });
}

// ... (Mantenha as funções atualizarCardsPrincipais, EventListeners e Firebase)