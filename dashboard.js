document.addEventListener('DOMContentLoaded', function() {
    // 1. Define usuário fictício ou lido da memória
    const labelUser = document.getElementById('welcomeUserName');
    if (labelUser) labelUser.innerText = "Olá, gugu2707y! Bem-vindo(a) de volta";

    // Data de referência padrão do mockup (02 de Junho de 2026)
    let dataSelecionada = new Date('2026-06-02T00:00:00');
    const nomesDias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    // 2. Controladores da Barra Lateral de Opções (Drawer)
    const drawer = document.getElementById('settingsDrawer');
    document.getElementById('btnOpenDrawer')?.addEventListener('click', () => drawer.classList.add('open'));
    document.getElementById('btnCloseDrawer')?.addEventListener('click', () => drawer.classList.remove('open'));

    // 3. Mudança Dinâmica dos Modos (Foco e Editar)
    document.getElementById('checkFocusMode')?.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.body.classList.add('focus-mode-active');
        } else {
            document.body.classList.remove('focus-mode-active');
        }
    });

    document.getElementById('checkEditMode')?.addEventListener('change', function(e) {
        if (e.target.checked) {
            alert('Modo Editar ativado! Você pode arrastar as aulas ou reconfigurar horários.');
        }
    });

    // Logout simples
    document.getElementById('btnActionLogout')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // 4. Função que atualiza o Banner de Alerta se for Feriado, Férias ou Aula Normal
    function atualizarBannerDia(isoString) {
        const banner = document.getElementById('dashboardBanner');
        const icon = document.getElementById('bannerIcon');
        const txt = document.getElementById('bannerText');
        
        // Pergunta para o motor de feriados.js o que esse dia é:
        const statusDia = FeriadosData.checarDataStatus(isoString);

        if (statusDia) {
            if (statusDia.tipo === "feriado") {
                banner.style.background = "#fef2f2";
                banner.style.borderColor = "#fca5a5";
                banner.style.color = "#b91c1c";
                icon.textContent = "celebration";
                txt.innerHTML = `🎉 <strong>Feriado Nacional:</strong> ${statusDia.nome}. Aproveite para descansar!`;
            } else if (statusDia.tipo === "ferias") {
                banner.style.background = "#f0fdf4";
                banner.style.borderColor = "#bbf7d0";
                banner.style.color = "#166534";
                icon.textContent = "wb_sunny";
                txt.innerHTML = `🏖️ <strong>Período de Férias:</strong> ${statusDia.nome}. Sem atividades escolares hoje.`;
            }
        } else {
            // Volta para o estado padrão normal de aula do mockup
            banner.style.background = "#e0f2fe";
            banner.style.borderColor = "#bae6fd";
            banner.style.color = "#0369a1";
            icon.textContent = "location_on";
            txt.innerHTML = `Você está agora em: <strong>Sala 12 - Matemática</strong>`;
        }
    }

    // 5. Construtor dos Cards Semanais Interativos (Segunda a Sexta)
    function construirCalendarioSemanal() {
        const container = document.getElementById('weekContainer');
        if (!container) return;
        container.innerHTML = '';

        // Calcula a segunda-feira da semana da dataSelecionada
        let base = new Date(dataSelecionada);
        let indexSemana = base.getDay();
        let diferenca = indexSemana === 0 ? -6 : 1 - indexSemana; 
        base.setDate(base.getDate() + diferenca);

        // Renderiza de segunda (0) até sexta (4)
        for (let i = 0; i < 5; i++) {
            let diaLoop = new Date(base);
            diaLoop.setDate(base.getDate() + i);

            const card = document.createElement('div');
            // Formata no padrão YYYY-MM-DD para consultar o feriados.js
            const isoDataStr = diaLoop.toISOString().split('T')[0];
            const infoEspecial = FeriadosData.checarDataStatus(isoDataStr);

            card.className = `week-day-card ${diaLoop.getDate() === dataSelecionada.getDate() ? 'active' : ''}`;
            
            let badgeHtml = '';
            if (infoEspecial) {
                badgeHtml = `<br><span style="font-size:0.65rem; background:#fee2e2; color:#ef4444; padding:1px 4px; border-radius:4px; font-weight:700;">AVISO</span>`;
            }

            card.innerHTML = `
                <small>${nomesDias[diaLoop.getDay()]}</small>
                <h3>${String(diaLoop.getDate()).padStart(2, '0')}</h3>
                ${badgeHtml}
            `;

            // Clique no card muda o dia selecionado e atualiza a tela
            card.addEventListener('click', () => {
                dataSelecionada = diaLoop;
                document.getElementById('textFullDate').innerText = diaLoop.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                construirCalendarioSemanal();
                atualizarBannerDia(isoDataStr);
            });

            container.appendChild(card);
        }
    }

    // 6. Construtor estático da Lista do Dia (Timeline Direita)
    const containerTimeline = document.getElementById('timelineContainer');
    if (containerTimeline) {
        const gradeAulas = [
            { n: 'Português', h: '08:00 - 08:50', l: 'Sala 12', act: false },
            { n: 'História', h: '08:50 - 09:40', l: 'Sala 15', act: false },
            { n: 'Intervalo', h: '09:40 - 10:00', l: 'Pátio', act: false },
            { n: 'Matemática', h: '10:00 - 10:50', l: 'Sala 12', act: true },
            { n: 'Intervalo', h: '10:50 - 11:10', l: 'Pátio', act: false },
            { n: 'Ciências', h: '11:10 - 12:00', l: 'Laboratório', act: false }
        ];

        gradeAulas.forEach(aula => {
            const el = document.createElement('div');
            el.className = `timeline-event-item ${aula.act ? 'active' : ''}`;
            el.innerHTML = `
                <span style="font-weight:700; font-size:0.92rem; color:#0f172a;">${aula.n}</span>
                <span style="font-size:0.8rem; color:#64748b; display:flex; align-items:center; gap:4px;">🕒 ${aula.h} | 📍 ${aula.l}</span>
            `;
            containerTimeline.appendChild(el);
        });
    }

    // Inicialização automática ao carregar a página
    construirCalendarioSemanal();
    atualizarBannerDia('2026-06-02');
});

// Muda tamanho das fontes do Drawer
function changeFontSize(tamanho) {
    document.body.style.fontSize = tamanho;
}