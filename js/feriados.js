'use strict';

window.Feriados = (function() {
  const CACHE_KEY = 'bssola_feriados_';

  async function buscar(ano) {
    const key = CACHE_KEY + ano;
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
      if (!res.ok) return [];
      const data = await res.json();
      sessionStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch {
      return [];
    }
  }

  function checar(data, lista) {
    const str = formatarData(data);
    return lista.find(h => h.date === str) || null;
  }

  function formatarData(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return { buscar, checar, formatarData };
})();
