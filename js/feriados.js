const FeriadosData = {
  "01-01": { tipo: "feriado", nome: "Ano Novo" },
  "04-21": { tipo: "feriado", nome: "Tiradentes" },
  "05-01": { tipo: "feriado", nome: "Dia do Trabalhador" },
  "09-07": { tipo: "feriado", nome: "Independência do Brasil" },
  "10-12": { tipo: "feriado", nome: "Nossa Senhora Aparecida" },
  "11-02": { tipo: "feriado", nome: "Finados" },
  "11-15": { tipo: "feriado", nome: "Proclamação da República" },
  "11-20": { tipo: "feriado", nome: "Consciência Negra" },
  "12-25": { tipo: "feriado", nome: "Natal" },
  "02-17": { tipo: "feriado", nome: "Carnaval" },
  "04-03": { tipo: "feriado", nome: "Sexta-feira Santa" },
  "06-04": { tipo: "feriado", nome: "Corpus Christi" },

  ferias: [
    { inicio: "2026-01-01", fim: "2026-02-02", nome: "Férias de Verão" },
    { inicio: "2026-07-01", fim: "2026-07-31", nome: "Recesso de Julho" },
    { inicio: "2026-12-20", fim: "2026-12-31", nome: "Recesso de Fim de Ano" }
  ],

  verificarDia(data) {
    const md = `${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`;
    if (this[md]) return this[md];
    const t = data.getTime();
    for (const p of this.ferias) {
      const i = new Date(p.inicio + 'T00:00:00').getTime();
      const f = new Date(p.fim + 'T00:00:00').getTime();
      if (t >= i && t <= f) return { tipo: 'ferias', nome: p.nome };
    }
    return null;
  }
};
