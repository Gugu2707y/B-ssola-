const $ = id => document.getElementById(id);
const DIAS = ['DOM','SEG','TER','QUA','QUI','SEX','SAB'];
const DIAS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

let dataAtual = new Date();
let diaEditor = dataAtual.getDay() >= 1 && dataAtual.getDay() <= 5 ? dataAtual.getDay() : 1;

let grade = JSON.parse(localStorage.getItem('minhaGradeCompleta')) || {
  1:{nome:'Segunda',aulas:exemplo()},
  2:{nome:'Terça',aulas:[]},
  3:{nome:'Quarta',aulas:[]},
  4:{nome:'Quinta',aulas:[]},
  5:{nome:'Sexta',aulas:exemplo()}
};
function exemplo(){return [
  {materia:'Português',prof:'Ana',sala:'Sala 12',ini:'08:00',fim:'08:50'},
  {materia:'História',prof:'Carlos',sala:'Sala 15',ini:'08:50',fim:'09:40'},
  {materia:'Intervalo',sala:'Pátio',ini:'09:40',fim:'10:00'},
  {materia:'Matemática',prof:'Maria',sala:'Sala 12',ini:'10:00',fim:'10:50'},
  {materia:'Intervalo',sala:'Pátio',ini:'10:50',fim:'11:10'},
  {materia:'Ciências',prof:'João',sala:'Laboratório',ini:'11:10',fim:'12:00'}
];}
function salvar(){localStorage.setItem('minhaGradeCompleta',JSON.stringify(grade));}
function toMin(h){const [a,b]=h.split(':').map(Number);return a*60+b;}

function render(){
  // Data
  const d = dataAtual;
  $('textFullDate').innerText = `${DIAS_FULL[d.getDay()].toLowerCase()}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

  // Semana
  const wg = $('weekGrid'); wg.innerHTML = '';
  const monday = new Date(d); monday.setDate(d.getDate() - ((d.getDay()+6)%7));
  for(let i=0;i<5;i++){
    const day = new Date(monday); day.setDate(monday.getDate()+i);
    const ativo = day.toDateString() === d.toDateString();
    const fer = FeriadosData.verificarDia(day);
    const tab = document.createElement('div');
    tab.className = 'day-tab' + (ativo?' active':'');
    tab.innerHTML = `<span class="day-name">${DIAS_FULL[day.getDay()]}</span>
      <span class="day-num">${String(day.getDate()).padStart(2,'0')}</span>
      ${fer?`<span style="background:#fee2e2;color:#dc2626;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;margin-top:4px">AVISO</span>`:''}`;
    tab.onclick = () => { dataAtual = new Date(day); render(); };
    wg.appendChild(tab);
  }

  // Conteúdo
  const main = $('mainContent');
  const fer = FeriadosData.verificarDia(d);
  const aulas = grade[d.getDay()]?.aulas || [];
  const now = new Date();
  const ehHoje = now.toDateString() === d.toDateString();
  const nowMin = now.getHours()*60+now.getMinutes();
  const curIdx = ehHoje ? aulas.findIndex(a => nowMin >= toMin(a.ini) && nowMin < toMin(a.fim)) : -1;
  const nextIdx = ehHoje ? aulas.findIndex(a => toMin(a.ini) > nowMin) : (aulas.length?0:-1);
  const cur = aulas[curIdx], nxt = aulas[nextIdx];

  // Status banner
  if(cur) $('statusTexto').innerHTML = `Você está agora em: <strong>${cur.sala||''} · ${cur.materia}</strong>`;
  else if(fer) $('statusTexto').innerHTML = `<strong>${fer.tipo === 'feriado'?'Feriado':'Férias'}:</strong> ${fer.nome}`;
  else $('statusTexto').innerText = 'Sem aula no momento';

  if(fer){
    main.style.gridTemplateColumns = '1fr';
    main.innerHTML = `<div class="holiday-card">
      <div class="holiday-icon-box"><span class="material-icons-round">celebration</span></div>
      <h3 class="holiday-title">${fer.tipo==='feriado'?'Feriado':'Férias Escolares'}</h3>
      <p class="holiday-name">${fer.nome}</p>
      <p class="holiday-desc">Aproveite o descanso! Nenhuma atividade escolar programada.</p>
      <div class="holiday-date-badge"><small>Em recesso</small><strong>${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}</strong></div>
    </div>`;
    return;
  }

  main.style.gridTemplateColumns = '2fr 1fr';
  const prog = cur ? Math.min(100, ((nowMin-toMin(cur.ini))/(toMin(cur.fim)-toMin(cur.ini)))*100) : 0;
  const falta = cur ? toMin(cur.fim)-nowMin : 0;

  main.innerHTML = `
    <div>
      <div class="current-activity-card">
        <span class="card-tag tag-now">AGORA</span>
        ${cur ? `
          <h3 class="activity-title">${cur.materia}</h3>
          <p class="activity-subtitle">${cur.prof?'Prof. '+cur.prof+' · ':''}${cur.sala||''} · ${cur.ini} - ${cur.fim}</p>
          <div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div>
          <p class="timer-status-text" style="margin-top:8px">Faltam aproximadamente ${falta} minutos</p>
        ` : '<p style="color:#64748b;margin-top:8px">Nenhuma aula em andamento</p>'}
      </div>
      ${nxt ? `<div class="next-activity-card">
        <div class="tag-next"><span class="material-icons-round tag-icon">push_pin</span> A SEGUIR</div>
        <h4 class="next-activity-title">${nxt.materia}</h4>
        <div class="next-activity-meta"><span>${nxt.ini} - ${nxt.fim}</span><span class="meta-item-separator">•</span><span>${nxt.sala||''}</span></div>
      </div>`:''}
      <div class="change-alert">
        <h4>⚠ MUDANÇAS NO HORÁRIO</h4>
        <p>Prof. João substituirá a aula de História amanhã, 08:50</p>
      </div>
    </div>
    <div class="current-activity-card">
      <h4 style="margin-bottom:12px;color:#1e293b">📋 Meu Dia</h4>
      <div class="meu-dia-container">
        ${aulas.length === 0 ? '<p style="color:#64748b;font-size:0.85rem">Nenhuma aula configurada.</p>' :
        aulas.map((a,i)=>`<div class="activity-item" style="${i===curIdx?'border-color:var(--primary-color);background:var(--primary-light)':''}">
          <div><strong style="display:block;font-size:0.88rem">${a.materia}</strong>
          <small style="color:#64748b">${a.ini}-${a.fim} ${a.sala?'· '+a.sala:''}</small></div>
          ${$('chkEditar').checked?`<button class="btn-action" onclick="removerAulaDia(${d.getDay()},${i})">✕</button>`:''}
        </div>`).join('')}
      </div>
    </div>
  `;
}

window.removerAulaDia = (dia, idx) => {
  grade[dia].aulas.splice(idx,1); salvar(); render();
};

// ---- Editor de matérias ----
function abrirEditor(){
  $('modalEditor').classList.remove('hidden');
  const tabs = $('editorTabs'); tabs.innerHTML = '';
  for(let i=1;i<=5;i++){
    const b = document.createElement('button');
    b.className = 'editor-tab' + (i===diaEditor?' active':'');
    b.innerText = DIAS_FULL[i];
    b.onclick = () => { diaEditor = i; abrirEditor(); };
    tabs.appendChild(b);
  }
  renderListaEditor();
}
function renderListaEditor(){
  const aulas = grade[diaEditor]?.aulas || [];
  $('listaAulasEditor').innerHTML = aulas.length === 0
    ? '<p style="text-align:center;color:#94a3b8;font-size:0.85rem">Nenhuma aula nesse dia.</p>'
    : aulas.map((a,i)=>`<div class="aula-item">
        <div class="info"><strong>${a.materia}</strong><small>${a.ini}-${a.fim} ${a.sala?'· '+a.sala:''}</small></div>
        <button class="btn-remove" onclick="removerDoEditor(${i})">✕</button>
      </div>`).join('');
}
window.addAula = () => {
  const materia = $('inMateria').value.trim();
  if(!materia) return alert('Digite a matéria');
  grade[diaEditor].aulas.push({
    materia, prof:$('inProf').value, sala:$('inSala').value,
    ini:$('inIni').value, fim:$('inFim').value
  });
  grade[diaEditor].aulas.sort((a,b)=>toMin(a.ini)-toMin(b.ini));
  salvar(); $('inMateria').value=''; $('inProf').value=''; $('inSala').value='';
  renderListaEditor(); render();
};
window.removerDoEditor = idx => {
  grade[diaEditor].aulas.splice(idx,1); salvar(); renderListaEditor(); render();
};

// ---- Modais e eventos ----
window.fecharModal = id => $(id).classList.add('hidden');
$('btnAbrirConfig').onclick = () => $('modalConfig').classList.remove('hidden');
$('btnAbrirEditor').onclick = abrirEditor;
$('btnPrevWeek').onclick = () => { dataAtual.setDate(dataAtual.getDate()-7); render(); };
$('btnNextWeek').onclick = () => { dataAtual.setDate(dataAtual.getDate()+7); render(); };
$('chkEditar').onchange = render;
$('chkFoco').onchange = e => document.body.classList.toggle('focus-mode-active', e.target.checked);

// Tema
document.querySelectorAll('.theme-dot').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.theme-dot').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.body.classList.remove('theme-green','theme-purple','theme-orange');
    if(b.dataset.theme) document.body.classList.add(b.dataset.theme);
    localStorage.setItem('tema', b.dataset.theme);
  };
});
document.querySelectorAll('.size-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.body.classList.remove('size-small','size-medium','size-large');
    document.body.classList.add(b.dataset.size);
    localStorage.setItem('tamanho', b.dataset.size);
  };
});

// Restaura preferências
const tema = localStorage.getItem('tema'); if(tema) document.body.classList.add(tema);
const tam = localStorage.getItem('tamanho') || 'size-medium'; document.body.classList.add(tam);

render();
setInterval(render, 30000);
