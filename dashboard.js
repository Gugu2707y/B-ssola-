document.addEventListener('DOMContentLoaded', function() {
    // 1. Definição da Grade Padrão (usada apenas se o dia nunca tiver sido editado)
    const gradePadrao = [
        { h: '07:30 - 08:20', n: 'Português', l: 'Sala 12', inicio: '07:30', fim: '08:20' },
        { h: '08:20 - 09:10', n: 'Matemática', l: 'Sala 12', inicio: '08:20', fim: '09:10' },
        { h: '09:10 - 09:30', n: 'Intervalo', l: 'Pátio', inicio: '09:10', fim: '09:30' },
        { h: '09:30 - 10:20', n: 'História', l: 'Sala 15', inicio: '09:30', fim: '10:20' },
        { h: '10:20 - 11:10', n: 'Geografia', l: 'Sala 05', inicio: '10:20', fim: '11:10' }
    ];

    // Controle de Datas (Baseado no ano de 2026)
    let dataSelecionada = new Date(2026, 5, 2); // Começa em 02 de Junho de 2026
    let mesVisualizacao = dataSelecionada.getMonth();
    let anoVisualizacao = 2026;
    let indiceAulaSendoEditada = null;

    const nomesDias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // 2. BANCO DE DADOS PERSISTENTE (Salva e busca as personalizações de cada dia)
    function obterGradeDoDia(dataIso) {
        const dadosSalvos = localStorage.getItem(`grade-${dataIso}`);
        if (dadosSalvos) {
            return JSON.parse(dadosSalvos);
        }
        // Se não houver personalização, retorna uma cópia limpa do padrão
        return JSON.parse(JSON.stringify(gradePadrao));
    }

    function salvarGradeDoDia(dataIso, novaGrade) {
        localStorage.setItem(`grade-${dataIso}`, JSON.stringify(novaGrade));
    }

    // 3. MOTOR DE MINUTAGEM EM TEMPO REAL
    function calcularTempoRealAulas() {
        const agora = new Date();
        
        // ATENÇÃO: Para testes locais, se o seu PC não estiver em 2026, 
        // o script simula o horário mas respeita as aulas cadastradas.
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();
        
        const isoDataAtual = dataSelecionada.toISOString().split('T')[0];
        const aulasDoDia = obterGradeDoDia(isoDataAtual);
        
        let aulaAtual = null;
        let proximaAula = null;

        // Verifica se é fim de semana, feriado ou férias primeiro
        const statusEspecial = typeof FeriadosData !== 'undefined' ? FeriadosData.checarDataStatus(isoDataAtual) : null;
        const ehFimDeSemana = (dataSelecionada.getDay() === 0 || dataSelecionada.getDay() === 6);

        if (statusEspecial || ehFimDeSemana) {
            configurarPainelForaDeAula("Sem atividades letivas para este dia.");
            return;
        }

        // Descobre qual aula está acontecendo agora
        aulasDoDia.forEach((aula, i) => {
            const [hIn, mIn] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);
            const minInicio = (hIn * 60) + mIn;
            const minFim = (hFim * 60) + mFim;

            if (horaAtualMin >= minInicio && horaAtualMin < minFim) {
                aulaAtual = aula;
                proximaAula = aulasDoDia[i + 1] || null;
            }
        });

        // Caso nenhuma esteja ativa no minuto exato, procura a próxima da lista
        if (!aulaAtual) {
            for (let aula of aulasDoDia) {
                const [hIn, mIn] = aula.inicio.split(':').map(Number);
                if ((hIn * 60) + mIn > horaAtualMin) {
                    proximaAula = aula;
                    break;
                }
            }
        }

        // Renderização visual do progresso dos minutos passados
        const nowCard = document.getElementById('nowCard');
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
            document.getElementById('timeLeftText').innerHTML = `⏳ Aula em andamento: Faltam <strong>${restam} minutos</strong> para acabar.`;
            if (nowCard) nowCard.style.borderLeft = "5px solid #3b82f6";
        } else {
            configurarPainelForaDeAula("Fora do horário das aulas ou intervalo concluído.");
        }

        // Atualiza painel da próxima atividade
        if (proximaAula) {
            document.getElementById('nextSubjectName').innerText = proximaAula.n;
            document.getElementById('nextSubjectMeta').innerText = `⏰ ${proximaAula.h}  |  📍 ${proximaAula.l}`;
        } else {
            document.getElementById('nextSubjectName').innerText = "Fim do Período";
            document.getElementById('nextSubjectMeta').innerText = "Não há mais matérias agendadas para hoje.";
        }
    }

    function configurarPainelForaDeAula(mensagem) {
        document.getElementById('currentSubjectName').innerText = "Nenhuma aula agora";
        document.getElementById('currentSubjectMeta').innerText = "--";
        document.getElementById('currentProgressFill').style.width = "0%";
        document.getElementById('timeLeftText').innerText = mensagem;
        const nowCard = document.getElementById('nowCard');
        if (nowCard) nowCard.style.borderLeft = "5px solid #cbd5e1";
    }

    // 4. CONSTRUTOR DO CALENDÁRIO COMPLETO DO ANO (Navegação ilimitada)
    function renderizarMiniCalendarioAnual() {
        const grid = document.getElementById('calendarDaysGrid');
        if (!grid) return;
        grid.innerHTML = '';

        document.getElementById('calendarMonthYear').innerText = `${nomesMeses[mesVisualizacao]} de ${anoVisualizacao}`;

        const primeiroDiaMes = new Date(anoVisualizacao, mesVisualizacao, 1).getDay();
        const totalDiasNoMes = new Date(anoVisualizacao, mesVisualizacao + 1, 0).getDate();

        // Preenche dias vazios antes do início do mês
        for (let i = 0; i < primeiroDiaMes; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'datepicker-day empty';
            grid.appendChild(emptyCell);
        }

        // Preenche os dias numéricos reais
        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const cell = document.createElement('div');
            cell.className = 'datepicker-day';
            cell.innerText = dia;

            // Destaca se for o dia atualmente aberto na tela
            if (dia === dataSelecionada.getDate() && mesVisualizacao === dataSelecionada.getMonth() && anoVisualizacao === dataSelecionada.getFullYear()) {
                cell.classList.add('selected');
            }

            // Alerta visual discreto diretamente no calendário caso o dia possua alteração ou feriado
            const dataLoopStr = `${anoVisualizacao}-${String(mesVisualizacao + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            if (localStorage.getItem(`grade-${dataLoopStr}`)) {
                cell.style.boxShadow = "inset 0 -3px 0 0 #f97316"; // Sublinhado laranja para dias editados
            }

            cell.addEventListener('click', () => {
                dataSelecionada = new Date(anoVisualizacao, mesVisualizacao, dia);
                atualizarTelaCompleta();
            });

            grid.appendChild(cell);
        }
    }

    // Botões de passar os meses do ano
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

    // 5. RENDERIZAÇÃO DA GRADE HORÁRIA E RECURSO DE EDIÇÃO PERSONALIZADA
    function renderizarTimelineGrade() {
        const container = document.getElementById('timelineContainer');
        if (!container) return;
        container.innerHTML = '';

        const isoDataStr = dataSelecionada.toISOString().split('T')[0];
        const aulasDoDia = obterGradeDoDia(isoDataStr);

        const agora = new Date();
        const horaAtualMin = (agora.getHours() * 60) + agora.getMinutes();
        const modoEditarAtivo = document.getElementById('checkEditMode').checked;

        aulasDoDia.forEach((aula, indice) => {
            const el = document.createElement('div');
            
            // Verifica sincronismo com a hora atual
            const [hIn, mIn] = aula.inicio.split(':').map(Number);
            const [hFim, mFim] = aula.fim.split(':').map(Number);
            const isActive = (horaAtualMin >= (hIn * 60) + mIn && horaAtualMin < (hFim * 60) + mFim);

            el.className = `timeline-event-item ${isActive ? 'active' : ''}`;
            el.style.border = modoEditarAtivo ? "2px dashed #f97316" : "1px solid #e2e8f0";
            el.style.cursor = modoEditarAtivo ? 'pointer' : 'default';
            
            el.innerHTML = `
                <div>
                    <span style="font-weight:700; font-size:0.95rem; color:#0f172a;">${aula.n}</span><br>
                    <span style="font-size:0.82rem; color:#64748b;">🕒 ${aula.h} | 📍 ${aula.l}</span>
                </div>
                ${modoEditarAtivo ? '<span class="material-symbols-outlined" style="font-size:18px; color:#f97316;">edit_note</span>' : ''}
            `;

            // Clique abre o painel para personalizar ESTA aula DESTE dia específico
            el.addEventListener('click', () => {
                if (modoEditarAtivo) {
                    indiceAulaSendoEditada = indice;
                    document.getElementById('editInputName').value = aula.n;
                    document.getElementById('editInputRoom').value = aula.l;
                    document.getElementById('editPanel').classList.add('active');
                    // Rola a página suavemente até o painel de edição
                    document.getElementById('editPanel').scrollIntoView({ behavior: 'smooth' });
                }
            });

            container.appendChild(el);
        });
    }

    // Ação do Botão: Gravar Alteração Personalizada
    document.getElementById('btnSaveEdit')?.addEventListener('click', () => {
        const isoDataStr = dataSelecionada.toISOString().split('T')[0];
        let aulasDoDia = obterGradeDoDia(isoDataStr);

        const novoNome = document.getElementById('editInputName').value.trim();
        const novaSala = document.getElementById('editInputRoom').value.trim();

        if (novoNome && indiceAulaSendoEditada !== null) {
            // Aplica os novos valores apenas no índice selecionado
            aulasDoDia[indiceAulaSendoEditada].n = novoNome;
            aulasDoDia[indiceAulaSendoEditada].l = novaSala;

            // Grava permanentemente na memória do navegador vinculada a esse dia do ano
            salvarGradeDoDia(isoDataStr, aulasDoDia);
            
            // Oculta o painel e atualiza os displays
            document.getElementById('editPanel').classList.remove('active');
            indiceAulaSendoEditada = null;
            atualizarTelaCompleta();
        }
    });

    // Monitor do switch de Edição
    document.getElementById('checkEditMode')?.addEventListener('change', function() {
        document.getElementById('editPanel').classList.remove('active');
        renderizarTimelineGrade();
    });

    // Monitor do Modo Foco
    document.getElementById('checkFocusMode')?.addEventListener('change', function(e) {
        document.body.classList.toggle('focus-mode-active', e.target.checked);
    });

    // 6. MASTER REFRESH (Aplica regras de Feriados, Férias e Dias Normais)
    function atualizarTelaCompleta() {
        const diaNome = nomesDias[dataSelecionada.getDay()];
        const diaNum = String(dataSelecionada.getDate()).padStart(2, '0');
        const mesNome = nomesMeses[dataSelecionada.getMonth()];
        const anoNum = dataSelecionada.getFullYear();

        // 1. Atualiza cabeçalho de texto completo
        document.getElementById('textFullDate').innerText = `${diaNome}, ${diaNum} de ${mesNome} de ${anoNum}`;
        
        // 2. Processamento inteligente do Banner Superior (Feriados / Férias / Letivo)
        const isoString = dataSelecionada.toISOString().split('T')[0];
        const banner = document.getElementById('dashboardBanner');
        const bannerText = document.getElementById('bannerText');
        
        let diaEspecial = false;

        if (typeof FeriadosData !== 'undefined') {
            const status = FeriadosData.checarDataStatus(isoString);
            if (status) {
                diaEspecial = true;
                if (status.tipo === "feriado") {
                    banner.style.background = "#fef2f2";
                    banner.style.borderColor = "#fca5a5";
                    banner.style.color = "#b91c1c";
                    bannerText.innerHTML = `🎉 <strong>Feriado Oficial:</strong> ${status.nome}. Não há aulas programadas!`;
                } else if (status.tipo === "ferias") {
                    banner.style.background = "#f0fdf4";
                    banner.style.borderColor = "#bbf7d0";
                    banner.style.color = "#166534";
                    bannerText.innerHTML = `🏖️ <strong>Período de Férias/Recesso:</strong> ${status.nome}. Aproveite as férias!`;
                }
            }
        }

        // Se for um final de semana comum e não caiu em feriado
        if (!diaEspecial && (dataSelecionada.getDay() === 0 || dataSelecionada.getDay() === 6)) {
            banner.style.background = "#f8fafc";
            banner.style.borderColor = "#cbd5e1";
            banner.style.color = "#475569";
            bannerText.innerHTML = `😴 <strong>Fim de Semana (${diaNome}):</strong> Período livre para descanso e revisões.`;
        } else if (!diaEspecial) {
            // Dia Letivo Normal
            banner.style.background = "#e0f2fe";
            banner.style.borderColor = "#bae6fd";
            banner.style.color = "#0369a1";
            bannerText.innerHTML = `Você está visualizando a rotina de: <strong>${diaNome}</strong>`;
        }

        // 3. Atualiza os componentes secundários
        renderizarMiniCalendarioAnual();
        renderizarTimelineGrade();
        calcularTempoRealAulas();
    }

    // Executa imediatamente na abertura da página
    atualizarTelaCompleta();
    
    // Roda o conferidor de minutos a cada 10 segundos para exatidão perfeita
    setInterval(calcularTempoRealAulas, 10000);
});