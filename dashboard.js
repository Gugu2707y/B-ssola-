document.addEventListener('DOMContentLoaded', function() {
    // 1. Carrega Nome de Usuário Logado
    const user = localStorage.getItem('usuarioLogado') || 'gg';
    const welcomeText = document.getElementById('welcomeUser');
    if(welcomeText) welcomeText.innerText = `Olá, ${user}! Bem-vindo(a) de volta`;

    // Data de referência fixada no dia exibido no mockup: 02 de Junho de 2026
    let dataAtual = new Date('2026-06-02T00:00:00');

    // 2. Renderização Inteligente dos Cards Semanais
    const weekGrid = document.getElementById('weekGrid');
    const diasSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    
    function gerarSemana() {
        if(!weekGrid) return;
        weekGrid.innerHTML = '';
        
        // Gera a exibição de Segunda a Sexta da semana atual
        let diaBase = new Date(dataAtual);
        let diaSemanaIndex = diaBase.getDay();
        let diferencaAteSegunda = diaSemanaIndex === 0 ? -6 : 1 - diaSemanaIndex;
        diaBase.setDate(diaBase.getDate() + diferencaAteSegunda);

        for (let i = 0; i < 5; i++) {
            let itemData = new Date(diaBase);
            itemData.setDate(diaBase.getDate() + i);
            
            const card = document.createElement('div');
            card.className = `day-card ${itemData.getDate() === dataAtual.getDate() ? 'active' : ''}`;
            
            const isoDataStr = itemData.toISOString().split('T')[0];
            const infoDia = FeriadosData.verificarDia(isoDataStr);
            
            let statusBadge = '';
            if (infoDia) {
                statusBadge = `<br><span style="font-size:0.7rem; padding:2px 4px; border-radius:4px; background:#fef2f2; color:#ef4444;">${infoDia.tipo === 'feriado' ? 'Feriado' : 'Férias'}</span>`;
            }

            card.innerHTML = `
                <small>${diasSemana[itemData.getDay()]}</small>
                <h3 style="margin-top:5px;">${itemData.getDate()}</h3>
                ${statusBadge}
            `;
            
            card.addEventListener('click', () => {
                dataAtual = itemData;
                document.getElementById('currentFullDate').innerText = itemData.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                gerarSemana();
                atualizarBannerStatus(isoDataStr);
            });

            weekGrid.appendChild(card);
        }
    }

    function atualizarBannerStatus(isoDataStr) {
        const banner = document.getElementById('statusBanner');
        const infoDia = FeriadosData.verificarDia(isoDataStr);

        if (infoDia) {
            if (infoDia.tipo === 'feriado') {
                banner.style.background = '#fef2f2';
                banner.style.borderColor = '#fca5a5';
                banner.style.color = '#991b1b';
                banner.innerHTML = `🎉 <strong>Feriado Nacional:</strong> ${infoDia.nome}. Aproveite o seu dia de descanso!`;
            } else if (infoDia.tipo === 'ferias') {
                banner.style.background = '#f0fdf4';
                banner.style.borderColor = '#bbf7d0';
                banner.style.color = '#166534';
                banner.innerHTML = `🏖️ <strong>Período de Férias:</strong> ${infoDia.nome}. Sem atividades letivas programadas.`;
            }
        } else {
            // Estado regular de dia de aula
            banner.style.background = '#e0f2fe';
            banner.style.borderColor = '#bae6fd';
            banner.style.color = '#0369a1';
            banner.innerHTML = `📍 Você está agora em: <strong>Sala 12 - Matemática</strong>`;
        }
    }

    // 3. Renderização Estática das Atividades Diárias da Timeline
    const timelineList = document.getElementById('timelineList');
    if (timelineList) {
        const rotinaExemplo = [
            { nome: 'Português', hora: '08:00 - 08:50', local: 'Sala 12', ativo: false },
            { nome: 'História', hora: '08:50 - 09:40', local: 'Sala 15', ativo: false },
            { nome: 'Intervalo', hora: '09:40 - 10:00', local: 'Pátio', ativo: false },
            { nome: 'Matemática', hora: '10:00 - 10:50', local: 'Sala 12', ativo: true },
            { nome: 'Intervalo', hora: '10:50 - 11:10', local: 'Pátio', ativo: false },
            { nome: 'Ciências', hora: '11:10 - 12:00', local: 'Laboratório', ativo: false }
        ];

        rotinaExemplo.forEach(atv => {
            const item = document.createElement('div');
            item.style.padding = '10px 15px';
            item.style.borderRadius = '10px';
            item.style.border = atv.ativo ? '2px solid var(--primary-color)' : '1px solid #e2e8f0';
            item.style.background = atv.ativo ? '#eff6ff' : 'white';
            item.innerHTML = `
                <strong>${atv.nome}</strong> ${atv.ativo ? '<span style="background:var(--primary-color); color:white; font-size:0.65rem; padding:1px 5px; border-radius:10px; float:right;">Agora</span>' : ''}
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:3px;">🕒 ${atv.hora}  |  📍 ${atv.local}</div>
            `;
            timelineList.appendChild(item);
        });
    }

    // 4. Mecanismo de Configuração do Painel Lateral (Temas e Fontes)
    const sidebar = document.getElementById('settingsSidebar');
    document.getElementById('openSettingsBtn')?.addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeSettingsBtn')?.addEventListener('click', () => sidebar.classList.remove('open'));

    document.querySelectorAll('.circle-opt').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.circle-opt').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Remove classes antigas e aplica o novo tema
            document.body.classList.remove('theme-azul', 'theme-verde', 'theme-roxo', 'theme-laranja');
            document.body.classList.add(`theme-${this.dataset.theme}`);
        });
    });

    document.querySelectorAll('.size-btn[data-size]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn[data-size]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.body.classList.remove('font-pequeno', 'font-medio', 'font-grande');
            document.body.classList.add(`font-${this.dataset.size}`);
        });
    });

    // 5. Botão Sair
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });

    // Inicialização da View
    gerarSemana();
    atualizarBannerStatus('2026-06-02');
});