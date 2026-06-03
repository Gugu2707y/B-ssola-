document.addEventListener('DOMContentLoaded', function() {
    // 1. Banco de dados inicial de aulas (Editável)
    let gradeAulas = [
        { id: 1, n: 'Português', h: '07:30 - 08:20', l: 'Sala 12', inicio: '07:30', fim: '08:20' },
        { id: 2, n: 'Matemática', h: '08:20 - 09:10', l: 'Sala 12', inicio: '08:20', fim: '09:10' },
        { id: 3, n: 'Intervalo', h: '09:10 - 09:30', l: 'Pátio', inicio: '09:10', fim: '09:30' },
        { id: 4, n: 'História', h: '09:30 - 10:20', l: 'Sala 15', inicio: '09:30', fim: '10:20' },
        { id: 5, n: 'Geografia', h: '10:20 - 11:10', l: 'Sala 05', inicio: '10:20', fim: '11:10' }
    ];

    let dataSelecionada = new Date(); // Inicia no dia de hoje
    let mesVisualizacao = dataSelecionada.getMonth(); 
    let anoVisualizacao = 2026;
    let aulaIdParaEditar = null;

    const nomesDias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // 2. Função de Minutagem Dinâmica Real
    function calcularTempoRealAulas() {
        const agora = new Date();
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();
        
        let aulaAtual = null;
        let proximaAula = null;

        // Procura qual aula está acontecendo no minuto atual
        gradeAulas.forEach((aula, i) => {
            const [hIn, mIn] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);
            const minInicio = (hIn * 60) + mIn;
            const minFim = (hFim * 60) + mFim;

            if (horaAtualMin >= minInicio && horaAtualMin < minFim) {
                aulaAtual = aula;
                proximaAula = gradeAulas[i + 1] || null;
            }
        });

        // Se nenhuma aula bateu com o horário, pega a primeira do dia vindo por aí
        if (!aulaAtual) {
            gradeAulas.forEach((aula) => {
                const [hIn, mIn] = aula.inicio.split(':').map(Number);
                const minInicio = (hIn * 60) + mIn;
                if (minInicio > horaAtualMin && !proximaAula) {
                    proximaAula = aula;
                }
            });
        }

        // Renderiza as informações na tela
        const nowCard = document.getElementById('nowCard');
        if (aulaAtual) {
            document.getElementById('currentSubjectName').innerText = aulaAtual.n;
            document.getElementById('currentSubjectMeta').innerText = `👤 Prof. do Dia  |  📍 ${aulaAtual.l}  |  ⏰ ${aulaAtual.h}`;
            
            // Faz a conta exata de quantos minutos passaram e quantos faltam
            const [hIn, mIn] = aulaAtual.inicio.split(':').map(Number);
            const [hFim, mFim] = aulaAtual.fim.split(':').map(Number);
            const totalMins = ((hFim * 60) + mFim) - ((hIn * 60) + mIn);
            const passados = horaAtualMin - ((hIn * 60) + mIn);
            const restam = totalMins - passados;
            const pct = (passados / totalMins) * 100;

            document.getElementById('currentProgressFill').style.width = `${pct}%`;
            document.getElementById('timeLeftText').innerHTML = `⏳ Faltam exatamente <strong>${restam} minutos</strong> para acabar.`;
            nowCard.style.borderLeft = "5px solid #3b82f6";
        } else {
            document.getElementById('currentSubjectName').innerText = "Nenhuma aula agora";
            document.getElementById('currentSubjectMeta').innerText = "--";
            document.getElementById('currentProgressFill').style.width = "0%";
            document.getElementById('timeLeftText').innerText = "Fora do horário letivo das aulas.";
            nowCard.style.borderLeft = "5px solid #cbd5e1";
        }

        if (proximaAula) {
            document.getElementById('nextSubjectName').innerText = proximaAula.n;
            document.getElementById('nextSubjectMeta').innerText = `⏰ ${proximaAula.h}  |  📍 ${proximaAula.l}`;
        } else {
            document.getElementById('nextSubjectName').innerText = "Fim das aulas!";
            document.getElementById('nextSubjectMeta').innerText = "Até amanhã.";
        }
    }

    // 3. Construtor do Calendário Completo do Ano (Navegável)
    function renderizarMiniCalendarioAnual() {
        const grid = document.getElementById('calendarDaysGrid');
        if (!grid) return;
        grid.innerHTML = '';

        document.getElementById('calendarMonthYear').innerText = `${nomesMeses[mesVisualizacao]} de ${anoVisualizacao}`;

        const primeiroDiaMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
        const totalDiasNoMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();

        // Espaços em branco do início do mês
        for (let i = 0; i < primeiroDiaMes; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'datepicker-day empty';
            grid.appendChild(emptyCell);
        }

        // Desenha os dias reais
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const cell = document.createElement('div');
            cell.className = 'datepicker-day';
            cell.innerText = dia;

            if (dia === dataSelecionada.getDate() && mesVisualizacao === dataSelecionada.getMonth()) {
                cell.classList.add('selected');
            }

            cell.addEventListener('click', () => {
                dataSelecionada = new Date(anoVisualizacao, mesVisualizacao, dia);
                atualizarTelaCompleta();
            });

            grid.appendChild(cell);
        }
    }

    // Passar meses no calendário
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        mesVisualizacao--;
        if (mesVisualizacao < 0) { mesVisualizacao = 11; anoVisualizacao--; }
        renderizarMiniCalendarioAnual();
    });
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        mesVisualizacao++;
        if (mesVisualizacao > 11) { mesVisualizacao = 0; anoVisualizacao++; }
        renderizarMiniCalendarioAnual();
    });

    // 4. Construtor da Grade Horária (Timeline) com suporte a cliques para Edição
    function renderizarTimelineGrade() {
        const container = document.getElementById('timelineContainer');
        if (!container) return;
        container.innerHTML = '';

        const agora = new Date();
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();

        gradeAulas.forEach(aula => {
            const el = document.createElement('div');
            
            // Identifica se é a aula ativa agora
            const [hIn, mIn] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);
            const isActive = (horaAtualMin >= (hIn * 60) + mIn && horaAtualMin < (hFim * 60) + mFim);

            el.className = `timeline-event-item ${isActive ? 'active' : ''}`;
            el.style.cursor = document.getElementById('checkEditMode').checked ? 'pointer' : 'default';
            
            el.innerHTML = `
                <div>
                    <span style="font-weight:700; font-size:0.92rem; color:#0f172a;">${aula.n}</span><br>
                    <span style="font-size:0.8rem; color:#64748b;">🕒 ${aula.h} | 📍 ${aula.l}</span>
                </div>
                ${document.getElementById('checkEditMode').checked ? '<span class="material-symbols-outlined" style="font-size:18px; color:#f97316;">edit</span>' : ''}
            `;

            // Abre para edição ao clicar na aula caso o modo editar esteja ativo
            el.addEventListener('click', () => {
                if (document.getElementById('checkEditMode').checked) {
                    aulaIdParaEditar = aula.id;
                    document.getElementById('editInputName').value = aula.n;
                    document.getElementById('editInputRoom').value = aula.l;
                    document.getElementById('editPanel').classList.add('active');
                }
            });

            container.appendChild(el);
        });
    }

    // Ação do Botão Salvar Alteração da Matéria
    document.getElementById('btnSaveEdit')?.addEventListener('click', () => {
        const novoNome = document.getElementById('editInputName').value;
        const novaSala = document.getElementById('editInputRoom').value;

        if (novoNome && aulaIdParaEditar) {
            gradeAulas = gradeAulas.map(aula => {
                if (aula.id === aulaIdParaEditar) {
                    return { ...aula, n: novoNome, l: novaSala };
                }
                return aula;
            });
            document.getElementById('editPanel').classList.remove('active');
            atualizarTelaCompleta();
        }
    });

    // Ativa/Desativa interface de edição
    document.getElementById('checkEditMode')?.addEventListener('change', function() {
        document.getElementById('editPanel').classList.remove('active');
        renderizarTimelineGrade();
    });

    // Foco Mode Switcher
    document.getElementById('checkFocusMode')?.addEventListener('change', function(e) {
        document.body.classList.toggle('focus-mode-active', e.target.checked);
    });

    // 5. Atualizador mestre da interface
    function atualizarTelaCompleta() {
        const diaNome = nomesDias[dataSelecionada.getDay()];
        const diaNum = String(dataSelecionada.getDate()).padStart(2, '0');
        const mesNome = nomesMeses[dataSelecionada.getMonth()];
        const anoNum = dataSelecionada.getFullYear();

        document.getElementById('textFullDate').innerText = `${diaNome}, ${diaNum} de ${mesNome} de ${anoNum}`;
        
        renderizarMiniCalendarioAnual();
        renderizarTimelineGrade();
        calcularTempoRealAulas();
        
        // Atualiza a frase superior usando o motor do feriados.js
        const isoString = dataSelecionada.toISOString().split('T')[0];
        const bannerText = document.getElementById('bannerText');
        if (typeof FeriadosData !== 'undefined') {
            const status = FeriadosData.checarDataStatus(isoString);
            if (status) {
                bannerText.innerHTML = `📢 Status do Dia: <strong>${status.nome}</strong>`;
                return;
            }
        }
        bannerText.innerHTML = `Você está visualizando a rotina de: <strong>${diaNome}</strong>`;
    }

    // Inicialização e Loop contínuo a cada 30 segundos para atualizar os minutos passados
    atualizarTelaCompleta();
    setInterval(calcularTempoRealAulas, 30000);
});