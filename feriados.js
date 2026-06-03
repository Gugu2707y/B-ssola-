const FeriadosData = {
    // Calendário Mapeado de Feriados Oficiais (Base 2026)
    "01-01": { tipo: "feriado", nome: "Ano Novo / Confraternização Universal" },
    "02-17": { tipo: "feriado", nome: "Terça-feira de Carnaval" },
    "04-03": { tipo: "feriado", nome: "Sexta-feira Santa" },
    "04-21": { tipo: "feriado", nome: "Tiradentes" },
    "05-01": { tipo: "feriado", nome: "Dia do Trabalhador" },
    "06-04": { tipo: "feriado", nome: "Corpus Christi" },
    "09-07": { tipo: "feriado", nome: "Independência do Brasil" },
    "10-12": { tipo: "feriado", nome: "Nossa Senhora Aparecida / Dia das Crianças" },
    "11-02": { tipo: "feriado", nome: "Finados" },
    "11-15": { tipo: "feriado", nome: "Proclamação da República" },
    "11-20": { tipo: "feriado", nome: "Dia da Consciência Negra" },
    "12-25": { tipo: "feriado", nome: "Natal" },

    // Intervalos de Férias/Recesso Escolar Estruturados
    "periodosFerias": [
        { de: "2026-01-01", ate: "2026-02-02", desc: "Férias de Verão" },
        { de: "2026-07-01", ate: "2026-07-31", desc: "Recesso Escolar de Julho" },
        { de: "2026-12-20", ate: "2026-12-31", desc: "Recesso de Fim de Ano" }
    ],

    // Método analisador de datas
    checarDataStatus: function(dataIso) {
        // Separa mês e dia para feriados recorrentes
        const partes = dataIso.split("-");
        const refMesDia = `${partes[1]}-${partes[2]}`;

        if (this[refMesDia]) {
            return this[refMesDia];
        }

        // Checagem por range de férias escolares
        const tempoAlvo = new Date(dataIso + 'T00:00:00').getTime();
        for (let bloco of this.periodosFerias) {
            const inicio = new Date(bloco.de + 'T00:00:00').getTime();
            const fim = new Date(bloco.ate + 'T00:00:00').getTime();
            
            if (tempoAlvo >= inicio && tempoAlvo <= fim) {
                return { tipo: "ferias", nome: bloco.desc };
            }
        }
        return null; // Letivo comum
    }
};