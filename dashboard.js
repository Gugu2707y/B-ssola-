document.addEventListener('DOMContentLoaded', function() {
    // 1. Grade padrão de referência
    const gradePadrao = [
        { h: '07:30 - 08:20', n: 'Português', l: 'Sala 12', inicio: '07:30', fim: '08:20' },
        { h: '08:20 - 09:10', n: 'Matemática', l: 'Sala 12', inicio: '08:20', fim: '09:10' },
        { h: '09:10 - 09:30', n: 'Intervalo', l: 'Pátio', inicio: '09:10', fim: '09:30' },
        { h: '09:30 - 10:20', n: 'História', l: 'Sala 15', inicio: '09:30', fim: '10:20' },
        { h: '10:20 - 11:10', n: 'Geografia', l: 'Sala 05', inicio: '10:20', fim: '11:10' }
    ];

    // O hoje real do sistema
    const hojeReal = new Date();
    
    // Data de trabalho (Sincronizada no dia selecionado)
    let dataSelecionada = new Date(hojeReal.getFullYear(), hojeReal.getMonth(), hojeReal.getDate());
    let mesVisualizacao = dataSelecionada.getMonth();
    let anoVisualizacao = dataSelecionada.getFullYear();
    let indiceAulaSendoEditada = null;

    const nomesDias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // 2. SISTEMA DE BANCO DE DADOS LOCAL STORAGE (Por data do ano)
    function obterGradeDoDia(dataIso) {
        const dadosSalvos = localStorage.getItem(`grade-${dataIso}`);
        if (dadosSalvos) return JSON.parse(dadosSalvos);
        return JSON.parse(JSON.stringify(gradePadrao));
    }

    function salvarGradeDoDia(dataIso, novaGrade) {
        localStorage.setItem(`grade-${dataIso}`, JSON.stringify(novaGrade));
    }

    // 3. MOTOR DE CONTROLE DO BANNER POR DISTÂNCIA DE DIAS (Seta Direita / Seta Esquerda)
    function gerenciarBannerTemporal(isoString) {
        const banner = document.getElementById('dashboardBanner');
        const bannerText = document.getElementById('bannerText');
        const icon = document.getElementById('bannerIcon');

        // Normaliza as datas para calcular a diferença exata desconsiderando horas/minutos
        const dAtual = new Date(hojeReal.getFullYear(), hojeReal.getMonth(), hojeReal.getDate());
        const dSelecionada = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), dataSelecionada.getDate());
        
        const diferencaTempo = dSelecionada.getTime() - dAtual.getTime();
        const diferencaDias = Math.round(diferencaTempo / (1000 * 60 * 60 * 24));

        // Verifica feriados primeiro
        if (typeof FeriadosData !== 'undefined') {
            const statusFeriado = FeriadosData.checarDataStatus(isoString);
            if (statusFeriado) {
                banner.style.background = "#fef2f2";
                banner.style.borderColor = "#fca5a5";
                banner.style.color = "#b91c1c";
                icon.textContent = "celebration";
                bannerText.innerHTML = `🎉 <strong>Feriado:</strong> ${statusFeriado.nome}.`;
                return;
            }
        }

        // Lógica de contagem de dias com base nas setas
        if (diferencaDias > 0) {
            // Seta para a direita: Futuro
            banner.style.background = "#fff7ed";
            banner.style.borderColor = "#ffedd5";
            banner.style.color = "#c2410c";
            icon.textContent = "schedule";
            bannerText.innerHTML = `🔮 Planejamento: <strong>Daqui a ${diferencaDias} dia(s)</strong> você terá estas aulas.`;
        } else if (diferencaDias < 0) {
            // Seta para a esquerda: Passado
            banner.style.background = "#f1f5f9";
            banner.style.borderColor = "#e2e8f0";
            banner.style.color = "#475569";
            icon.textContent = "history";
            bannerText.innerHTML = `📜 Histórico: <strong>Já se passou/passaram ${Math.abs(diferencaDias)} dia(s)</strong> desde esta data.`;
        } else {
            // Hoje
            banner.style.background = "#e0f2fe";
            banner.style.borderColor = "#bae6fd";
            banner.style.color = "#0369a1";
            icon.textContent = "today";
            bannerText.innerHTML = `📌 Você está visualizando a rotina de <strong>Hoje</strong>.`;
        }
    }

    // 4. ATUALIZADOR DO CARD DO MOMENTO (Minutagem Real)
    function calcularTempoRealAulas() {
        const agora = new Date();
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();
        
        const isoDataAtual = dataSelecionada.toISOString().split('T')[0];
        const aulasDoDia = obterGradeDoDia(isoDataAtual);
        
        let aulaAtual = null;
        let proximaAula = null;

        // Só exibe a barra azul se o dia visualizado na tela for o dia de hoje real
        const dAtualStr = hojeReal.toISOString().split('T')[0];
        if (isoDataAtual !== dAtualStr) {
            document.getElementById('currentSubjectName').innerText = "Navegando no tempo";
            document.getElementById('currentSubjectMeta').innerText = "Vá para 'Hoje' para acompanhar a minutagem em tempo real.";
            document.getElementById('currentProgressFill').style.width = "0%";
            document.getElementById('timeLeftText').innerText = "Barra de progresso desativada para dias passados/futuros.";
            document.getElementById('nextSubjectName').innerText = "--";
            document.getElementById('nextSubjectMeta').innerText = "--";
            return;
        }

        aulasDoDia.forEach((aula, i) => {
            const [hIn, mIn] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);
            const minInicio = (hIn * 60) + mIn;
            const minFim = (hFim * 60) + mFim;

            if (horaAtualMin >= minInicio && horaAtualMin < minFim) {
                aulaAtual = aula;
                proximaAula = grid = aulasDoDia[i + 1] || null;
            }
        });

        if (!aulaAtual) {
            for (let aula of aulasDoDia) {
                const [hIn, mIn] = aula.inicio.split(':').map(Number);
                if ((hIn * 60) + mIn > horaAtualMin) { proximaAula = aula; break; }
            }
        }

        if (aulaAtual) {
            document.getElementById('currentSubjectName').innerText = aulaAtual.n;
            document.getElementById('currentSubjectMeta').innerText = `📍 ${aulaAtual.l}  |  ⏰ ${aulaAtual.h}`;
            
            const [hIn, mIn] = aulaAtual.inicio.split(':').map(Number);
            const [hFim, mFim] = aulaAtual.fim.split(':').map(Number);
            const totalMins = ((hFim * 60) + mFim) - ((hIn * 60) + mIn);
            const passados = horaAtualMin - ((hIn * 60) + mIn);
            const restam = totalMins - passados;
            const pct = Math.max(0, Math.min(100, (passados / totalMins) * 100));

            document.getElementById('currentProgressFill').style.width = `${pct}%`;
            document.getElementById('timeLeftText').innerHTML = `⏳ Aula acontecendo: restam <strong>${restam} minutos</strong>.`;
        } else {
            document.getElementById('currentSubjectName').innerText = "Sem aula acontecendo";
            document.getElementById('currentSubjectMeta').innerText = "Fora do horário escolar.";
            document.getElementById('currentProgressFill').style.width = "0%";
            document.getElementById('timeLeftText').innerText = "Nenhum cronômetro ativo agora.";
        }

        if (proximaAula) {
            document.getElementById('nextSubjectName').innerText = proximaAula.n;
            document.getElementById('nextSubjectMeta').innerText = `⏰ ${proximaAula.h}  |  📍 ${proximaAula.l}`;
        } else {
            document.getElementById('nextSubjectName').innerText = "Fim do expediente";
            document.getElementById('nextSubjectMeta').innerText = "Sem mais matérias hoje.";
        }
    }

    // 5. SELETOR DE DIAS E INTERFACE DE RENDERS
    function construirCalendarioSemanal() {
        const container = document.getElementById('weekContainer');
        if (!container) return;
        container.innerHTML = '';

        let base = new Date(dataSelecionada);
        let diaDaSemana = base.getDay();
        let diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
        base.setDate(base.getDate() + diferenca); // Alinha na segunda-feira

        for (let i = 0; i < 5; i++) {
            let diaLoop = new Date(base);
            diaLoop.setDate(base.getDate() + i);

            const card = document.createElement('div');
            card.className = `week-day-card ${diaLoop.getDate() === dataSelecionada.getDate() && diaLoop.getMonth() === dataSelecionada.getMonth() ? 'active' : ''}`;
            
            card.innerHTML = `
                <small>${nomesDias[diaLoop.getDay()].split('-')[0]}</small>
                <h3>${String(diaLoop.getDate()).padStart(2, '0')}</h3>
            `;

            card.addEventListener('click', () => {
                dataSelecionada = diaLoop;
                atualizarTelaCompleta();
            });
            container.appendChild(card);
        }
    }

    function renderizarMiniCalendarioAnual() {
        const grid = document.getElementById('calendarDaysGrid');
        if (!grid) return; grid.innerHTML = '';

        document.getElementById('calendarMonthYear').innerText = `${nomesMeses[mesVisualizacao]} de ${anoVisualizacao}`;
        const primeiroDiaMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
        const totalDiasNoMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();

        for (let i = 0; i < primeiroDiaMes; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'datepicker-day empty';
            grid.appendChild(emptyCell);
        }

        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const cell = document.createElement('div');
            cell.className = 'datepicker-day';
            cell.innerText = dia;

            if (dia === dataSelecionada.getDate() && mesVisualizacao === dataSelecionada.getMonth() && anoVisualizacao === dataSelecionada.getFullYear()) {
                cell.classList.add('selected');
            }
            cell.addEventListener('click', () => {
                dataSelecionada = new Date(anoVisualizacao, mesVisualizacao, dia);
                atualizarTelaCompleta();
            });
            grid.appendChild(cell);
        }
    }

    function renderizarTimelineGrade() {
        const container = document.getElementById('timelineContainer');
        if (!container) return; container.innerHTML = '';

        const isoDataStr = dataSelecionada.toISOString().split('T')[0];
        const aulasDoDia = obterGradeDoDia(isoDataStr);
        const modoEditarAtivo = document.getElementById('checkEditMode').checked;

        aulasDoDia.forEach((aula, indice) => {
            const el = document.createElement('div');
            el.className = 'timeline-event-item';
            if (modoEditarAtivo) el.style.border = "2px dashed #f97316";

            el.innerHTML = `
                <div>
                    <span style="font-weight:700; font-size:0.95rem;">${aula.n}</span><br>
                    <span style="font-size:0.82rem; color:#64748b;">🕒 ${aula.h} | 📍 ${aula.l}</span>
                </div>
                ${modoEditarAtivo ? '<span class="material-symbols-outlined" style="color:#f97316;">edit</span>' : ''}
            `;

            el.addEventListener('click', () => {
                if (modoEditarAtivo) {
                    indiceAulaSendoEditada = indice;
                    document.getElementById('editInputName').value = aula.n;
                    document.getElementById('editInputRoom').value = aula.l;
                    document.getElementById('editInputStart').value = aula.inicio;
                    document.getElementById('editInputEnd').value = aula.fim;
                    document.getElementById('editPanel').classList.add('active');
                }
            });
            container.appendChild(el);
        });
    }

    // 6. EVENTOS DE SALVAMENTO E NAVEGAÇÃO POR SETAS
    document.getElementById('btnSaveEdit')?.addEventListener('click', () => {
        const isoDataStr = dataSelecionada.toISOString().split('T')[0];
        let aulasDoDia = obterGradeDoDia(isoDataStr);

        const n = document.getElementById('editInputName').value;
        const l = document.getElementById('editInputRoom').value;
        const start = document.getElementById('editInputStart').value;
        const end = document.getElementById('editInputEnd').value;

        if (n && indiceAulaSendoEditada !== null) {
            aulasDoDia[indiceAulaSendoEditada] = { h: `${start} - ${end}`, n: n, l: l, inicio: start, fim: end };
            salvarGradeDoDia(isoDataStr, aulasDoDia);
            document.getElementById('editPanel').classList.remove('active');
            atualizarTelaCompleta();
        }
    });

    // Controles das Setas Grandes (Esquerda / Direita)
    document.getElementById('btnPrevDay')?.addEventListener('click', () => {
        dataSelecionada.setDate(dataSelecionada.getDate() - 1);
        mesVisualizacao = dataSelecionada.getMonth();
        anoVisualizacao = dataSelecionada.getFullYear();
        atualizarTelaCompleta();
    });

    document.getElementById('btnNextDay')?.addEventListener('click', () => {
        dataSelecionada.setDate(dataSelecionada.getDate() + 1);
        mesVisualizacao = dataSelecionada.getMonth();
        anoVisualizacao = dataSelecionada.getFullYear();
        atualizarTelaCompleta();
    });

    document.getElementById('checkEditMode')?.addEventListener('change', function() {
        document.getElementById('editPanel').classList.remove('active');
        renderizarTimelineGrade();
    });

    document.getElementById('checkFocusMode')?.addEventListener('change', function(e) {
        document.body.classList.toggle('focus-mode-active', e.target.checked);
    });

    document.getElementById('prevMonth')?.addEventListener('click', () => { mesVisualizacao--; renderizarMiniCalendarioAnual(); });
    document.getElementById('nextMonth')?.addEventListener('click', () => { mesVisualizacao++; renderizarMiniCalendarioAnual(); });

    function atualizarTelaCompleta() {
        const isoString = dataSelecionada.toISOString().split('T')[0];
        document.getElementById('textFullDate').innerText = `${nomesDias[dataSelecionada.getDay()]}, ${String(dataSelecionada.getDate()).padStart(2, '0')} de ${nomesMeses[dataSelecionada.getMonth()]} de ${dataSelecionada.getFullYear()}`;
        
        construirCalendarioSemanal();
        renderizarMiniCalendarioAnual();
        renderizarTimelineGrade();
        calcularTempoRealAulas();
        gerenciarBannerTemporal(isoString);
    }

    atualizarTelaCompleta();
    setInterval(calcularTempoRealAulas, 15000);
});