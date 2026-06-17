// dashboard.js - Código estruturado para persistência e edição
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// ... (Mantenha sua configuração Firebase aqui)

const $ = (id) => document.getElementById(id);
let dataAtual = new Date();

// Estrutura de dados persistente: 1=Segunda, 2=Terça... 5=Sexta
let gradeSemanal = JSON.parse(localStorage.getItem('minhaGradeEscolar')) || {
    1: [{ nome: "Português", hora: "08:00 - 08:50", sala: "12" }],
    2: [{ nome: "Matemática", hora: "10:00 - 10:50", sala: "12" }],
    3: [], 4: [], 5: []
};

function initDashboard(user) {
    atualizarUI();
}

function atualizarUI() {
    renderizarCalendario();
    renderizarListaAulas();
    atualizarStatusDia();
}

// 📅 Renderiza os dias da semana (1-5)
function renderizarCalendario() {
    const container = $("weekGrid"); // Certifique-se de ter este ID no seu HTML
    if (!container) return;
    container.innerHTML = "";
    
    // Logica para gerar 5 dias fixos ou semana corrente
    for(let i = 1; i <= 5; i++) {
        const div = document.createElement("div");
        div.className = `day-tab ${dataAtual.getDay() === i ? 'active' : ''}`;
        div.innerHTML = `<span>Dia ${i}</span>`;
        div.onclick = () => { 
            // Atualiza data e recarrega
            dataAtual.setDate(dataAtual.getDate() + (i - dataAtual.getDay()));
            atualizarUI();
        };
        container.appendChild(div);
    }
}

// 📋 Renderiza as aulas do dia selecionado
function renderizarListaAulas() {
    const lista = $("timelineList");
    if (!lista) return;
    const diaIndex = dataAtual.getDay();
    const aulasDoDia = gradeSemanal[diaIndex] || [];

    lista.innerHTML = aulasDoDia.map((aula, index) => `
        <div class="info-block-card">
            <strong>${aula.nome}</strong>
            <p>${aula.hora} | Sala ${aula.sala}</p>
            <button onclick="removerAula(${diaIndex}, ${index})">Remover</button>
        </div>
    `).join('');
}

// ✏️ FUNÇÕES DE EDIÇÃO (Chame estas funções no seu Modal de Configuração)
window.adicionarAula = (diaIndex, novaAula) => {
    gradeSemanal[diaIndex].push(novaAula);
    localStorage.setItem('minhaGradeEscolar', JSON.stringify(gradeSemanal));
    renderizarListaAulas();
};

window.removerAula = (diaIndex, index) => {
    gradeSemanal[diaIndex].splice(index, 1);
    localStorage.setItem('minhaGradeEscolar', JSON.stringify(gradeSemanal));
    renderizarListaAulas();
};

function atualizarStatusDia() {
    const status = $("statusText");
    if (!status) return;
    
    // Logica de feriado/ferias (exemplo simples)
    const feriados = ["2026-06-04"]; // Exemplo Corpus Christi
    const dataStr = dataAtual.toISOString().split('T')[0];
    
    if (feriados.includes(dataStr)) {
        status.innerText = "Feriado: Aproveite o descanso!";
    } else {
        status.innerText = `Rotina de ${dataAtual.toLocaleDateString()}`;
    }
}

// ... (Restante da lógica de autenticação)