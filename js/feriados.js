const FeriadosData = {
    // Feriados Fixos Nacionais (2026)
    "01-01": { tipo: "feriado", nome: "Ano Novo / Confraternização Universal" },
    "04-21": { tipo: "feriado", nome: "Tiradentes" },
    "05-01": { tipo: "feriado", nome: "Dia do Trabalhador" },
    "09-07": { tipo: "feriado", nome: "Independência do Brasil" },
    "10-12": { tipo: "feriado", nome: "Nossa Senhora Aparecida / Dia das Crianças" },
    "11-02": { tipo: "feriado", nome: "Finados" },
    "11-15": { tipo: "feriado", nome: "Proclamação da República" },
    "11-20": { tipo: "feriado", nome: "Dia da Consciência Negra" },
    "12-25": { tipo: "feriado", nome: "Natal" },

    // Feriados Móveis Estimados para 2026
    "02-17": { tipo: "feriado", nome: "Carnaval" },
    "04-03": { tipo: "feriado", nome: "Sexta-feira Santa" },
    "06-04": { tipo: "feriado", nome: "Corpus Christi" },

    // Períodos de Férias Escolares Estruturadas (2026)
    "ferias": [
        { inicio: "2026-01-01", fim: "2026-02-02", nome: "Férias de Verão" },
        { inicio: "2026-07-01", fim: "2026-07-31", nome: "Recesso Escolar de Julho" },
        { inicio: "2026-12-20", fim: "2026-12-31", nome: "Recesso de Fim de Ano" }
    ],

    // Função Interna para checar a situação do dia selecionado
    verificarDia: function(dataIsoString) {
        const data = new Date(dataIsoString + 'T00:00:00');
        const mesDia = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
        
        // 1. Verifica se cai em feriado fixo ou móvel mapeado
        if (this[mesDia]) {
            return this[mesDia];
        }
        
        // 2. Verifica se a data está compreendida nos intervalos de férias escolares
        const tempoData = data.getTime();
        for (let periodo of this.ferias) {
            const dInicio = new Date(periodo.inicio + 'T00:00:00').getTime();
            const dFim = new Date(periodo.fim + 'T00:00:00').getTime();
            if (tempoData >= dInicio && tempoData <= dFim) {
                return { tipo: "ferias", nome: periodo.name || periodo.nome };
            }
        }
        
        return null; // Dia letivo padrão
    }
};