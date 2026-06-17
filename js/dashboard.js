// dashboard.js
const $ = (id) => document.getElementById(id);
let dataAtual = new Date();

// Carrega ou inicializa a grade
let grade = JSON.parse(localStorage.getItem('minhaGradeCompleta')) || {
    1: { nome: "Segunda", aulas: [] },
    2: { nome: "Terça", aulas: [] },
    3: { nome: "Quarta", aulas: [] },
    4: { nome: "Quinta", aulas: [] },
    5: { nome: "Sexta", aulas: [] }
};

function salvarGrade() {
    localStorage.setItem('minhaGradeCompleta', JSON.stringify(grade));
}

// Função Principal de Atualização
function atualizarTudo() {
    const diaIndex = dataAtual.getDay();
    
    // 1. Atualiza Data e Texto Relativo
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const diff = Math.round((dataAtual - hoje) / (1000 * 60 * 60 * 24));
    let textoRelativo = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : `Daqui a ${diff} dias`;
    
    $("textFullDate").innerText = `${dataAtual.toLocaleDateString("pt-BR")} (${textoRelativo})`;

    // 2. Renderiza Grade do Dia (Persistente)
    const container = $("timelineList");
    container.innerHTML = "";
    
    const aulas = grade[diaIndex]?.aulas || [];
    if(aulas.length === 0) container.innerHTML = "<p>Nenhuma aula configurada para este dia.</p>";
    
    aulas.forEach((aula, idx) => {
        const div = document.createElement("div");
        div.className = "aula-item";
        div.innerHTML = `<strong>${aula.materia}</strong> <span>${aula.hora}</span> 
                         <button onclick="removerAula(${diaIndex}, ${idx})">X</button>`;
        container.appendChild(div);
    });
}

// 3. Funções de Controle para o Modal
window.adicionarAula = (materia, hora) => {
    const dia = dataAtual.getDay();
    if(!grade[dia]) grade[dia] = { aulas: [] };
    grade[dia].aulas.push({ materia, hora });
    salvarGrade();
    atualizarTudo();
};

window.removerAula = (dia, idx) => {
    grade[dia].aulas.splice(idx, 1);
    salvarGrade();
    atualizarTudo();
};

// Eventos de Navegação
$("btnNextDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() + 1); atualizarTudo(); });
$("btnPrevDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() - 1); atualizarTudo(); });

atualizarTudo();// dashboard.js
const $ = (id) => document.getElementById(id);
let dataAtual = new Date();

// Carrega ou inicializa a grade
let grade = JSON.parse(localStorage.getItem('minhaGradeCompleta')) || {
    1: { nome: "Segunda", aulas: [] },
    2: { nome: "Terça", aulas: [] },
    3: { nome: "Quarta", aulas: [] },
    4: { nome: "Quinta", aulas: [] },
    5: { nome: "Sexta", aulas: [] }
};

function salvarGrade() {
    localStorage.setItem('minhaGradeCompleta', JSON.stringify(grade));
}

// Função Principal de Atualização
function atualizarTudo() {
    const diaIndex = dataAtual.getDay();
    
    // 1. Atualiza Data e Texto Relativo
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const diff = Math.round((dataAtual - hoje) / (1000 * 60 * 60 * 24));
    let textoRelativo = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : `Daqui a ${diff} dias`;
    
    $("textFullDate").innerText = `${dataAtual.toLocaleDateString("pt-BR")} (${textoRelativo})`;

    // 2. Renderiza Grade do Dia (Persistente)
    const container = $("timelineList");
    container.innerHTML = "";
    
    const aulas = grade[diaIndex]?.aulas || [];
    if(aulas.length === 0) container.innerHTML = "<p>Nenhuma aula configurada para este dia.</p>";
    
    aulas.forEach((aula, idx) => {
        const div = document.createElement("div");
        div.className = "aula-item";
        div.innerHTML = `<strong>${aula.materia}</strong> <span>${aula.hora}</span> 
                         <button onclick="removerAula(${diaIndex}, ${idx})">X</button>`;
        container.appendChild(div);
    });
}

// 3. Funções de Controle para o Modal
window.adicionarAula = (materia, hora) => {
    const dia = dataAtual.getDay();
    if(!grade[dia]) grade[dia] = { aulas: [] };
    grade[dia].aulas.push({ materia, hora });
    salvarGrade();
    atualizarTudo();
};

window.removerAula = (dia, idx) => {
    grade[dia].aulas.splice(idx, 1);
    salvarGrade();
    atualizarTudo();
};

// Eventos de Navegação
$("btnNextDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() + 1); atualizarTudo(); });
$("btnPrevDay")?.addEventListener("click", () => { dataAtual.setDate(dataAtual.getDate() - 1); atualizarTudo(); });

atualizarTudo();