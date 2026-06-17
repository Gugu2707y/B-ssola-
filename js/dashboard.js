// dashboard.js - Lógica Principal
const $ = (id) => document.getElementById(id);
let dataExibida = new Date(); 

// Dados simulados (No futuro, você pode carregar do localStorage ou API)
let grade = {
    1: { nome: "Segunda", aulas: [{materia: "Português", hora: "08:00"}, {materia: "Matemática", hora: "10:00"}] },
    2: { nome: "Terça", aulas: [{materia: "Matemática", hora: "10:00"}] },
    4: { nome: "Quinta", aulas: [] } // Feriado configurado
};

function renderizarDashboard() {
    const diaIndex = dataExibida.getDay(); // 1 a 5
    const dataIso = dataExibida.toISOString().split('T')[0];

    // 1. Verificar Feriados
    const statusFeriado = FeriadosData.verificarDia(dataIso);
    
    if (statusFeriado) {
        // Exibe o template de Feriado (oculta o resto)
        document.getElementById("main-content").innerHTML = `
            <div class="holiday-card">
                <div class="holiday-title">Feriado</div>
                <div class="holiday-name">${statusFeriado.nome}</div>
            </div>`;
    } else {
        // Renderiza a grade normal
        renderizarAulas(diaIndex);
    }
    
    // 2. Atualizar o Header (Nome do usuário e data)
    $("textFullDate").innerText = dataExibida.toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' });
}

function renderizarAulas(dia) {
    const container = $("timelineList");
    container.innerHTML = "";
    
    const aulas = grade[dia]?.aulas || [];
    aulas.forEach(aula => {
        container.innerHTML += `
            <div class="activity-item">
                <div><strong>${aula.materia}</strong><br><small>${aula.hora}</small></div>
            </div>`;
    });
}

// Navegação de Dias
document.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // Atualiza dataExibida baseado no clique e chama renderizarDashboard()
    });
});