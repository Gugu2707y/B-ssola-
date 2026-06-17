document.addEventListener("DOMContentLoaded", function() {

    // ==========================================================================
    // 1. CONTROLO DE SESSÃO E LOGIN DINÂMICO
    // ==========================================================================
    const emailLogado = localStorage.getItem("userEmail") || "Usuário";
    
    const campoName = document.getElementById("welcomeUser");
    if (campoName) {
        campoName.innerText = emailLogado;
    }

    // ==========================================================================
    // 2. CONFIGURAÇÕES INICIAIS DA GRADE (Horários Padrão)
    // ==========================================================================
    const gradePadrao = [
        { id: 1, dia: 1, inicio: "07:30", fim: "08:20", materia: "Português", sala: "Sala 12" },
        { id: 2, dia: 1, inicio: "08:20", fim: "09:10", materia: "Matemática", sala: "Sala 12" },
        { id: 3, dia: 1, inicio: "09:10", fim: "10:00", materia: "História", sala: "Sala 12" },
        { id: 4, dia: 2, inicio: "07:30", fim: "08:20", materia: "Matemática", sala: "Sala 12" },
        { id: 5, dia: 2, inicio: "08:20", fim: "09:10", materia: "Física", sala: "Sala 10" },
        { id: 6, dia: 3, inicio: "07:30", fim: "08:20", materia: "Química", sala: "Laboratório" },
        { id: 7, dia: 3, inicio: "08:20", fim: "09:10", materia: "Geografia", sala: "Sala 08" }
    ];

    // Relógio real do sistema baseado em 2026
    let hojeReal = new Date();

    // Data de trabalho (Focada/Selecionada no dia corrente)
    let dataSelecionada = new Date(hojeReal.getFullYear(), hojeReal.getMonth(), hojeReal.getDate());
    let anoVisualizacao = dataSelecionada.getFullYear();
    let mesVisualizacao = dataSelecionada.getMonth();

    const nomeDias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const nomeMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let indexEdicaoSelecionado = null;

    // ==========================================================================
    // 3. DEPARTAMENTO DE ARMAZENAMENTO LOCAL (LocalStorage)
    // ==========================================================================
    function obterGradeDoSeletor(diaString) {
        const dadosSalvos = localStorage.getItem("grade_" + diaString);
        if (dadosSalvos) {
            return JSON.parse(dadosSalvos);
        }
        return gradePadrao.filter(p => p.dia === parseInt(diaString));
    }

    function salvarGrade(diaString, novaGrade) {
        localStorage.setItem("grade_" + diaString, JSON.stringify(novaGrade));
    }

    // ==========================================================================
    // 4. MOTOR DE CONTROLE DO BANNER DE STATUS
    // ==========================================================================
    function gerenteBannerTemporal(isoString) {
        const banner = document.getElementById("dashboardBanner");
        const bannerText = document.getElementById("bannerText");
        const icone = document.getElementById("bannerIcon");

        if (!banner || !bannerText || !icone) return;

        const dAtual = new Date(hojeReal.getFullYear(), hojeReal.getMonth(), hojeReal.getDate());
        const dSelecionada = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), dataSelecionada.getDate());

        const diferencaTempo = dSelecionada.getTime() - dAtual.getTime();
        const diferencaDias = Math.round(diferencaTempo / (1000 * 60 * 60 * 24));

        // Verifica Feriados ou Eventos Especiais primeiro (Opcional se implementado externamente)
        if (typeof FeriadosData !== 'undefined') {
            const statusPeriodo = FeriadosData.checarStatusData(isoString);
            if (statusPeriodo) {
                banner.style.background = "#fef3c7";
                banner.style.borderColor = "#f59e0b";
                banner.style.color = "#78350f";
                icone.innerText = "celebration";
                bannerText.innerHTML = `🎉 Cronograma de Férias/Feriado: <strong>${statusPeriodo.nome}</strong>`;
                return;
            }
        }

        // Lógica de contagem de dias com base nas datas
        if (diferencaDias > 0) {
            banner.style.background = "#e0f2fe";
            banner.style.borderColor = "#bae6fd";
            banner.style.color = "#0369a1";
            icone.innerText = "schedule";
            bannerText.innerHTML = `📅 Planeamento: estás a visualizar o cronograma daqui a <strong>${diferencaDias} dia(s)</strong>. Clique para regressar ao dia atual.`;
        } else if (diferencaDias < 0) {
            banner.style.background = "#f1f5f9";
            banner.style.borderColor = "#e2e8f0";
            banner.style.color = "#475569";
            icone.innerText = "history";
            bannerText.innerHTML = `⏱️ Histórico: o cronograma selecionado já passou há <strong>${Math.abs(diferencaDias)} dia(s)</strong>.`;
        } else {
            banner.style.background = "#ecfdf5";
            banner.style.borderColor = "#a7f3d0";
            banner.style.color = "#047857";
            icone.innerText = "today";
            bannerText.innerHTML = `✨ Você está visualizando a rotina de hoje em tempo real.`;
        }
    }

    // ==========================================================================
    // 5. MOTOR DO CRONÓMETRO E PROGRESSO REAL
    // ==========================================================================
    function calcularTempoEulas() {
        const agora = new Date();
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();

        const isoDataAtual = dataSelecionada.toLocaleDateString('pt-BR').split('/').reverse().join('-');
        const gradeDoDia = obterGradeDoSeletor(dataSelecionada.getDay());

        let aulaAtual = null;
        let proximaAula = null;

        const diaAtualStr = hojeReal.toLocaleDateString('pt-BR').split('/').reverse().join('-');

        if (isoDataAtual !== diaAtualStr) {
            document.getElementById("currentSubjectName").innerText = "Navegando no Tempo";
            document.getElementById("timeHint").innerText = "Vá para 'Hoje' para acompanhar a contagem em tempo real.";
            document.getElementById("currentProgressFill").style.width = "0%";
            document.getElementById("nextSubjectName").innerText = "Barra de progresso desativada para dias passados/futuros.";
            document.getElementById("nextSubjectMeta").innerText = "-/-";
            return;
        }

        gradeDoDia.forEach((aula) => {
            const [hIni, mIni] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);

            const inicioMin = (hIni * 60) + mIni;
            const fimMin = (hFim * 60) + mFim;

            if (horaAtualMin >= inicioMin && horaAtualMin < fimMin) {
                aulaAtual = aula;
            } else if (inicioMin > horaAtualMin && (!proximaAula || inicioMin < proximaAula._inicioMin)) {
                aula._inicioMin = inicioMin;
                proximaAula = aula;
            }
        });

        if (aulaAtual) {
            document.getElementById("currentSubjectName").innerText = aulaAtual.materia;
            document.getElementById("currentSubjectMeta").innerText = `📍 ${aulaAtual.sala} | ⏱️ ${aulaAtual.inicio} - ${aulaAtual.fim}`;

            const [hIni, mIni] = aulaAtual.inicio.split(':').map(Number);
            const [hFim, mFim] = aulaAtual.fim.split(':').map(Number);
            const inicioMin = (hIni * 60) + mIni;
            const fimMin = (hFim * 60) + mFim;

            const tempoTotal = fimMin - inicioMin;
            const tempoPassado = horaAtualMin - inicioMin;
            const pct = Math.min(100, Math.max(0, (tempoPassado / tempoTotal) * 100));

            document.getElementById("currentProgressFill").style.width = pct + "%";
            document.getElementById("timeHint").innerHTML = `⏳ Faltam <strong>${fimMin - horaAtualMin} min</strong> para terminar esta atividade.`;
        } else {
            document.getElementById("currentSubjectName").innerText = "Sem aula acontecendo";
            document.getElementById("currentSubjectMeta").innerText = "-/-";
            document.getElementById("currentProgressFill").style.width = "0%";
            document.getElementById("timeHint").innerText = "Nenhum cronograma ativo agora.";
        }

        if (proximaAula) {
            document.getElementById("nextSubjectName").innerText = proximaAula.materia;
            document.getElementById("nextSubjectMeta").innerText = `📍 ${proximaAula.sala} | ⏱️ Próxima às ${proximaAula.inicio}`;
        } else {
            document.getElementById("nextSubjectName").innerText = "Fim do expediente";
            document.getElementById("nextSubjectMeta").innerText = "Sem mais matérias para hoje.";
        }

        // Rotação da Bússola
        const ponteiro = document.getElementById("compassPointer");
        if (ponteiro) {
            if (aulaAtual) {
                const anguloFoguete = (horaAtualMin % 60) * 6;
                ponteiro.style.transform = `rotate(${anguloFoguete}deg)`;
            } else {
                const anguloRelogio = (new Date().getSeconds()) * 6;
                ponteiro.style.transform = `rotate(${anguloRelogio}deg)`;
            }
        }
    }

    // ==========================================================================
    // 6. RENDERIZADORES DE INTERFACE (Grades e Semanas)
    // ==========================================================================
    function construirCalendarioSemanal() {
        const container = document.getElementById("daysContainer");
        if (!container) return;
        container.innerHTML = "";

        let dataBase = new Date(dataSelecionada);
        let diaDaSemana = dataBase.getDay();
        let diferenca = dataBase.getDate() - diaDaSemana + (diaDaSemana === 0 ? -6 : 1); // Alinha na Segunda-feira
        dataBase.setDate(diferenca);

        for (let i = 0; i < 5; i++) {
            let diaLoop = new Date(dataBase);
            diaLoop.setDate(dataBase.getDate() + i);

            const card = document.createElement("div");
            const eAtivo = diaLoop.toDateString() === dataSelecionada.toDateString() ? " active" : "";
            card.className = "week-day-card" + eAtivo;

            card.innerHTML = `
                <span>${nomeDias[diaLoop.getDay()]}</span>
                <h3>${String(diaLoop.getDate()).padStart(2, '0')}</h3>
            `;

            card.addEventListener("click", () => {
                dataSelecionada = diaLoop;
                atualizarTelaCompleta();
            });

            container.appendChild(card);
        }
    }

    function renderizarMiniCalendario() {
        const grid = document.getElementById("calendarDaysGrid");
        if (!grid) return;
        grid.innerHTML = "";

        document.getElementById("currentMonthYear").innerText = `${nomeMeses[mesVisualizacao]} de ${anoVisualizacao}`;

        const primeiroDiaMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
        const totalDiasMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();

        // Preenche dias vazios da semana anterior
        for (let i = 0; i < (primeiroDiaMes === 0 ? 6 : primeiroDiaMes - 1); i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "datepicker-day empty";
            grid.appendChild(emptyCell);
        }

        // Preenche os dias do mês
        for (let dia = 1; dia <= totalDiasMes; dia++) {
            const cell = document.createElement("div");
            cell.className = "datepicker-day";
            cell.innerText = dia;

            const dataCelular = new Date(anoVisualizacao, mesVisualizacao, dia);
            if (dataCelular.toDateString() === dataSelecionada.toDateString()) {
                cell.classList.add("selected");
            }

            cell.addEventListener("click", () => {
                dataSelecionada = dataCelular;
                atualizarTelaCompleta();
            });

            grid.appendChild(cell);
        }
    }

    function renderizarTimelineGrade() {
        const container = document.getElementById("timelineContainer");
        if (!container) return;
        container.innerHTML = "";

        const numDia = dataSelecionada.getDay();
        const gradeDoDia = obterGradeDoSeletor(numDia);

        const modoEdicaoAtivo = document.getElementById("editSwitch").checked;

        gradeDoDia.sort((a, b) => a.inicio.localeCompare(b.inicio));

        gradeDoDia.forEach((aula, index) => {
            const el = document.createElement("div");
            el.className = "timeline-event-item";
            
            if (modoEdicaoAtivo) {
                el.style.border = "1px dashed #f59e0b";
            }

            el.innerHTML = `
                <div>
                    <span style="font-weight: 700; font-size: 0.95rem;">${aula.materia}</span>
                    <p style="font-size: 0.8rem; color: #64748b;">📍 ${aula.sala} | ⏱️ ${aula.inicio} - ${aula.fim}</p>
                </div>
                ${modoEdicaoAtivo ? '<span class="material-symbols-outlined" style="color:#f59e0b; cursor:pointer;">edit</span>' : ''}
            `;

            el.addEventListener("click", () => {
                if (modoEdicaoAtivo) {
                    indexEdicaoSelecionado = index;
                    document.getElementById("editInputName").value = aula.materia;
                    document.getElementById("editInputRoom").value = aula.sala;
                    document.getElementById("editInputStart").value = aula.inicio;
                    document.getElementById("editInputEnd").value = aula.fim;
                    document.getElementById("editPanel").classList.add("active");
                }
            });

            container.appendChild(el);
        });
    }

    // ==========================================================================
    // 7. GESTÃO DE EVENTOS E NAVEGAÇÃO
    // ==========================================================================
    document.getElementById("btnSaveSlot").addEventListener("click", () => {
        const numDia = dataSelecionada.getDay();
        let aulasDoDia = obterGradeDoSeletor(numDia);

        const m = document.getElementById("editInputName").value;
        const s = document.getElementById("editInputRoom").value;
        const start = document.getElementById("editInputStart").value;
        const end = document.getElementById("editInputEnd").value;

        if (indexEdicaoSelecionado !== null) {
            aulasDoDia[indexEdicaoSelecionado] = {
                ...aulasDoDia[indexEdicaoSelecionado],
                materia: m,
                sala: s,
                inicio: start,
                fim: end
            };

            salvarGrade(numDia, aulasDoDia);
            document.getElementById("editPanel").classList.remove("active");
            atualizarTelaCompleta();
        }
    });

    // Controlos das Setas Grandes (Esquerda / Direita)
    document.getElementById("prevDay").addEventListener("click", () => {
        dataSelecionada.setDate(dataSelecionada.getDate() - 1);
        mesVisualizacao = dataSelecionada.getMonth();
        anoVisualizacao = dataSelecionada.getFullYear();
        atualizarTelaCompleta();
    });

    document.getElementById("nextDay").addEventListener("click", () => {
        dataSelecionada.setDate(dataSelecionada.getDate() + 1);
        mesVisualizacao = dataSelecionada.getMonth();
        anoVisualizacao = dataSelecionada.getFullYear();
        atualizarTelaCompleta();
    });

    // Ativação do Modo Edição
    document.getElementById("editSwitch").addEventListener("change", function() {
        document.getElementById("editPanel").classList.remove("active");
        renderizarTimelineGrade();
    });

    // Ativação do Modo Foco
    document.getElementById("focusModeSwitch").addEventListener("change", function(e) {
        document.body.classList.toggle("focus-mode-active", e.target.checked);
    });

    // Navegação do Mini Calendário (Meses)
    document.getElementById("prevMonth").addEventListener("click", () => { mesVisualizacao--; if(mesVisualizacao < 0){ mesVisualizacao=11; anoVisualizacao--; } renderizarMiniCalendario(); });
    document.getElementById("nextMonth").addEventListener("click", () => { mesVisualizacao++; if(mesVisualizacao > 11){ mesVisualizacao=0; anoVisualizacao++; } renderizarMiniCalendario(); });

    // Voltar para hoje clicando no Banner
    document.getElementById("dashboardBanner").addEventListener("click", () => {
        dataSelecionada = new Date(hojeReal.getFullYear(), hojeReal.getMonth(), hojeReal.getDate());
        mesVisualizacao = dataSelecionada.getMonth();
        anoVisualizacao = dataSelecionada.getFullYear();
        atualizarTelaCompleta();
    });

    // ==========================================================================
    // 8. FUNÇÃO MATRIZ DE ATUALIZAÇÃO
    // ==========================================================================
    function atualizarTelaCompleta() {
        const isoString = dataSelecionada.toLocaleDateString('pt-BR').split('/').reverse().join('-');
        
        const txtDate = document.getElementById("welcomeDate");
        if (txtDate) {
            txtDate.innerHTML = `${nomeDias[dataSelecionada.getDay()]}, ${String(dataSelecionada.getDate()).padStart(2, '0')} de ${nomeMeses[dataSelecionada.getMonth()]} de ${dataSelecionada.getFullYear()}`;
        }

        construirCalendarioSemanal();
        renderizarMiniCalendario();
        renderizarTimelineGrade();
        calcularTempoEulas();
        gerenteBannerTemporal(isoString);
    }

    // Inicialização automática
    atualizarTelaCompleta();
    setInterval(calcularTempoEulas, 10000); // Atualiza o motor a cada 10 segundos
});