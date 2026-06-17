'use strict';

// ── Verificar sessão ──────────────────────────────────────
const session = JSON.parse(sessionStorage.getItem('bssola_session') || 'null');
if (!session) {
  window.location.href = 'index.html';
}

// ── Constantes e estado ───────────────────────────────────
const SCHEDULE_KEY  = 'bssola_schedule';
const SETTINGS_KEY  = 'bssola_settings';

const WEEK_DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const PT_WEEKDAY = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const PT_MONTHS  = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const PT_WEEKDAY_SHORT = ['dom','seg','ter','qua','qui','sex','sáb'];

const DEFAULT_SCHEDULE = {
  'Segunda': [
    { time:'08:00 - 08:50', subject:'Matemática', room:'Sala 12', teacher:'Prof. Ana', isBreak:false },
    { time:'08:50 - 09:40', subject:'Português',  room:'Sala 12', teacher:'Prof. Carlos', isBreak:false },
    { time:'09:40 - 10:00', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'10:00 - 10:50', subject:'Ciências',   room:'Lab',     teacher:'Prof. Bia', isBreak:false },
    { time:'10:50 - 11:10', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'11:10 - 12:00', subject:'Ed. Física', room:'Quadra',  teacher:'Prof. Lucas', isBreak:false },
  ],
  'Terça': [
    { time:'08:00 - 08:50', subject:'História',   room:'Sala 15', teacher:'Prof. João', isBreak:false },
    { time:'08:50 - 09:40', subject:'Geografia',  room:'Sala 15', teacher:'Prof. João', isBreak:false },
    { time:'09:40 - 10:00', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'10:00 - 10:50', subject:'Matemática', room:'Sala 12', teacher:'Prof. Ana', isBreak:false },
    { time:'10:50 - 11:10', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'11:10 - 12:00', subject:'Inglês',     room:'Sala 20', teacher:'Prof. Sara', isBreak:false },
  ],
  'Quarta': [
    { time:'08:00 - 08:50', subject:'Português',  room:'Sala 12', teacher:'Prof. Carlos', isBreak:false },
    { time:'08:50 - 09:40', subject:'História',   room:'Sala 15', teacher:'Prof. João', isBreak:false },
    { time:'09:40 - 10:00', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'10:00 - 10:50', subject:'Matemática', room:'Sala 12', teacher:'Prof. Ana', isBreak:false },
    { time:'10:50 - 11:10', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'11:10 - 12:00', subject:'Ciências',   room:'Lab',     teacher:'Prof. Bia', isBreak:false },
  ],
  'Quinta': [
    { time:'08:00 - 08:50', subject:'Matemática', room:'Sala 12', teacher:'Prof. Ana', isBreak:false },
    { time:'08:50 - 09:40', subject:'Arte',        room:'Sala 25', teacher:'Prof. Rita', isBreak:false },
    { time:'09:40 - 10:00', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'10:00 - 10:50', subject:'Geografia',  room:'Sala 15', teacher:'Prof. João', isBreak:false },
    { time:'10:50 - 11:10', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'11:10 - 12:00', subject:'Inglês',     room:'Sala 20', teacher:'Prof. Sara', isBreak:false },
  ],
  'Sexta': [
    { time:'08:00 - 08:50', subject:'Ciências',   room:'Lab',     teacher:'Prof. Bia', isBreak:false },
    { time:'08:50 - 09:40', subject:'Português',  room:'Sala 12', teacher:'Prof. Carlos', isBreak:false },
    { time:'09:40 - 10:00', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'10:00 - 10:50', subject:'Ed. Física', room:'Quadra',  teacher:'Prof. Lucas', isBreak:false },
    { time:'10:50 - 11:10', subject:'Intervalo',  room:'Pátio',   teacher:'',isBreak:true },
    { time:'11:10 - 12:00', subject:'Matemática', room:'Sala 12', teacher:'Prof. Ana', isBreak:false },
  ],
};

const THEME_COLORS = {
  blue:   { primary:'#4299e1', dark:'#3182ce', light:'#90cdf4', lighter:'#bee3f8', bg:'#ebf8ff', accent:'#fbd38d' },
  green:  { primary:'#48bb78', dark:'#38a169', light:'#9ae6b4', lighter:'#c6f6d5', bg:'#f0fff4', accent:'#f6ad55' },
  purple: { primary:'#9f7aea', dark:'#805ad5', light:'#d6bcfa', lighter:'#e9d8fd', bg:'#faf5ff', accent:'#fc8181' },
  orange: { primary:'#ed8936', dark:'#dd6b20', light:'#fbd38d', lighter:'#feebc8', bg:'#fffaf0', accent:'#90cdf4' },
};

const THEME_NAMES = { blue:'Azul', green:'Verde', purple:'Roxo', orange:'Laranja' };

const CHANGES = [
  { message:'Prof. João substituirá a aula de História amanhã', time:'Amanhã, 08:50' }
];

// ── Estado global ─────────────────────────────────────────
let state = {
  selectedDate: new Date(),
  holidays: [],
  editMode: false,
  focusMode: false,
  weeklyView: false,
  settings: { themeColor:'blue', fontSize:'medium', soundEnabled:true },
  schedule: null,
};

// ── Carregar dados ────────────────────────────────────────
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) Object.assign(state.settings, JSON.parse(saved));
}
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}
function loadSchedule() {
  const saved = localStorage.getItem(SCHEDULE_KEY);
  state.schedule = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
}
function saveSchedule() {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(state.schedule));
}

// ── Utilitários de data ───────────────────────────────────
function formatDateLong(d) {
  return `${PT_WEEKDAY[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}
function formatDateMedium(d) {
  return `${String(d.getDate()).padStart(2,'0')} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}
function isToday(d) {
  const t = new Date();
  return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}
function isSameDay(a, b) {
  return a.getDate()===b.getDate() && a.getMonth()===b.getMonth() && a.getFullYear()===b.getFullYear();
}
function addDays(d, n) {
  const r = new Date(d); r.setDate(r.getDate()+n); return r;
}
function getMondayOfWeek(d) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}
function getWeekDates(d) {
  const monday = getMondayOfWeek(d);
  return Array.from({length:5}, (_,i) => addDays(monday, i));
}
function getWeekDayName(d) {
  const idx = d.getDay();
  if (idx === 0 || idx === 6) return 'Segunda';
  return WEEK_DAY_NAMES[idx - 1];
}
function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
function getCurrentClassIndex(schedule) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < schedule.length; i++) {
    const parts = schedule[i].time.split(' - ');
    if (parts.length < 2) continue;
    const start = parseTimeToMinutes(parts[0].trim());
    const end   = parseTimeToMinutes(parts[1].trim());
    if (nowMin >= start && nowMin < end) return i;
  }
  return 3; // fallback para demonstração
}
function getClassProgress(item) {
  const parts = item.time.split(' - ');
  if (parts.length < 2) return 65;
  const start = parseTimeToMinutes(parts[0].trim());
  const end   = parseTimeToMinutes(parts[1].trim());
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin < start) return 0;
  if (nowMin >= end) return 100;
  return Math.round(((nowMin - start) / (end - start)) * 100);
}

// ── Aplicar tema ──────────────────────────────────────────
function applyTheme() {
  const t = state.settings.themeColor;
  const colors = THEME_COLORS[t];
  document.body.className = `dashboard-page theme-${t} font-${state.settings.fontSize}`;
  const root = document.documentElement.style;
  root.setProperty('--primary',         colors.primary);
  root.setProperty('--primary-dark',    colors.dark);
  root.setProperty('--primary-light',   colors.light);
  root.setProperty('--primary-lighter', colors.lighter);
  root.setProperty('--primary-bg',      colors.bg);
  root.setProperty('--accent',          colors.accent);
}

// ── Ícone SVG inline ──────────────────────────────────────
function svg(type) {
  const icons = {
    book:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    food:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    check:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    clock:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    pin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    user:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    edit:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    party:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.9 4.96-8.82 5.51-10.41.13"/></svg>`,
  };
  return icons[type] || icons.book;
}

// ── Renderizar semana ─────────────────────────────────────
function renderWeekNav() {
  const container = document.getElementById('week-days');
  container.innerHTML = '';
  const dates = getWeekDates(state.selectedDate);
  dates.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'week-day-btn' + (isSameDay(d, state.selectedDate) ? ' active' : '');
    btn.innerHTML = `<span class="day-name">${PT_WEEKDAY_SHORT[d.getDay()]}</span><span class="day-number">${d.getDate()}</span>`;
    if (isToday(d) && !isSameDay(d, state.selectedDate)) {
      const dot = document.createElement('span'); dot.className = 'dot';
      btn.appendChild(dot);
    }
    const hol = Feriados.checar(d, state.holidays);
    if (hol && !isSameDay(d, state.selectedDate)) {
      const badge = document.createElement('span'); badge.className = 'holiday-icon'; badge.textContent = '🎉';
      btn.appendChild(badge);
    }
    btn.addEventListener('click', () => {
      state.selectedDate = d;
      render();
    });
    container.appendChild(btn);
  });
}

// ── Renderizar cabeçalho ──────────────────────────────────
function renderHeader() {
  document.getElementById('greeting-text').textContent =
    `Olá, ${session.name}! Bem-vindo(a) de volta`;
  document.getElementById('header-date').textContent = formatDateLong(state.selectedDate);

  // Atividade atual para o banner de localização
  const dayName = getWeekDayName(state.selectedDate);
  const daySchedule = state.schedule[dayName] || [];
  const currentIdx = getCurrentClassIndex(daySchedule);
  const currentItem = daySchedule[currentIdx];
  const locBanner = document.getElementById('location-banner');
  const locValue  = document.getElementById('location-value');
  if (currentItem && !state.focusMode) {
    locBanner.style.display = '';
    locValue.textContent = `${currentItem.room} — ${currentItem.subject}`;
  } else {
    locBanner.style.display = 'none';
  }
}

// ── Renderizar atividade atual/próxima ────────────────────
function renderCurrentActivity() {
  const dayName = getWeekDayName(state.selectedDate);
  const daySchedule = state.schedule[dayName] || [];
  const currentIdx = getCurrentClassIndex(daySchedule);
  const current = daySchedule[currentIdx];
  const next    = daySchedule[currentIdx + 1];

  if (current) {
    document.getElementById('current-name').textContent = current.subject;
    const meta = [];
    if (current.teacher) meta.push(`${svg('user')}<span>${current.teacher}</span>`);
    meta.push(`${svg('pin')}<span>${current.room}</span>`);
    meta.push(`${svg('clock')}<span>${current.time}</span>`);
    document.getElementById('current-meta').innerHTML = meta.map(m => `<span style="display:flex;align-items:center;gap:5px">${m}</span>`).join('');

    const progress = isToday(state.selectedDate) ? getClassProgress(current) : 65;
    document.getElementById('progress-pct').textContent  = progress + '%';
    document.getElementById('progress-fill').style.width = progress + '%';
    const parts = current.time.split(' - ');
    const remaining = parts.length > 1
      ? Math.max(0, parseTimeToMinutes(parts[1].trim()) - (new Date().getHours()*60+new Date().getMinutes()))
      : 17;
    document.getElementById('progress-hint').textContent =
      `Faltam aproximadamente ${remaining} minutos`;
  }

  if (next) {
    document.getElementById('next-name').textContent = next.subject;
    const meta = [];
    meta.push(`${svg('clock')}<span>${next.time}</span>`);
    meta.push(`${svg('pin')}<span>${next.room}</span>`);
    document.getElementById('next-meta').innerHTML = meta.map(m => `<span style="display:flex;align-items:center;gap:5px">${m}</span>`).join('');
  }

  // Relógio
  const now = new Date();
  document.getElementById('current-clock').textContent =
    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

// ── Renderizar avisos ─────────────────────────────────────
function renderChanges() {
  const card = document.getElementById('changes-card');
  const list = document.getElementById('changes-list');
  if (!isToday(state.selectedDate) || state.focusMode) {
    card.style.display = 'none'; return;
  }
  if (CHANGES.length === 0) { card.style.display = 'none'; return; }
  card.style.display = '';
  list.innerHTML = CHANGES.map(c => `
    <div class="change-item">
      <p>${c.message}</p>
      <span class="change-time">${c.time}</span>
    </div>
  `).join('');
}

// ── Renderizar timeline do dia ────────────────────────────
function renderTimeline() {
  const dayName = getWeekDayName(state.selectedDate);
  const daySchedule = state.schedule[dayName] || [];
  const currentIdx  = getCurrentClassIndex(daySchedule);

  const list = document.getElementById('timeline-list');
  const oldLine = list.querySelector('.timeline-line');
  list.innerHTML = '';
  const line = document.createElement('div'); line.className = 'timeline-line';
  list.appendChild(line);

  document.getElementById('activities-badge').textContent = daySchedule.length + ' atividades';
  document.getElementById('add-class-sidebar').classList.toggle('hidden', !state.editMode);

  daySchedule.forEach((item, i) => {
    const isPast    = isToday(state.selectedDate) ? i < currentIdx : false;
    const isCurrent = isToday(state.selectedDate) ? i === currentIdx : false;

    const wrap = document.createElement('div');
    wrap.className = 'timeline-item';

    const dotClass = isPast ? 'past' : isCurrent ? 'current' : '';
    const contentClass = isCurrent ? 'current' : isPast ? 'past' : '';

    let editBtns = '';
    if (state.editMode) {
      editBtns = `
        <div class="edit-btns">
          <button class="edit-btn" data-day="${dayName}" data-idx="${i}" title="Editar">${svg('edit')}</button>
          <button class="del-btn"  data-day="${dayName}" data-idx="${i}" title="Excluir">${svg('trash')}</button>
        </div>`;
    }

    wrap.innerHTML = `
      <div class="timeline-dot ${dotClass}">
        ${isPast ? svg('check') : item.isBreak ? svg('food') : svg('book')}
      </div>
      <div class="timeline-content ${contentClass}">
        ${isCurrent ? '<span class="timeline-now-badge">Agora</span>' : ''}
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
          <p class="timeline-subject ${isPast ? 'past' : ''}">${item.subject}</p>
          ${editBtns}
        </div>
        <div class="timeline-meta">
          <span>${svg('clock')} ${item.time}</span>
          <span>${svg('pin')} ${item.room}</span>
        </div>
      </div>`;
    list.appendChild(wrap);
  });

  document.getElementById('timeline-summary').textContent =
    `Você está na atividade ${Math.min(currentIdx+1, daySchedule.length)} de ${daySchedule.length}`;

  // Botões de editar/excluir na timeline
  list.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      const idx = parseInt(btn.dataset.idx);
      openClassModal(day, idx);
    });
  });
  list.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      const idx = parseInt(btn.dataset.idx);
      if (confirm('Deseja excluir esta atividade?')) {
        state.schedule[day].splice(idx, 1);
        saveSchedule();
        render();
      }
    });
  });
}

// ── Renderizar vista semanal ──────────────────────────────
function renderWeeklyView() {
  const tabs = document.getElementById('day-tabs');
  tabs.innerHTML = '';
  WEEK_DAY_NAMES.forEach(day => {
    const btn = document.createElement('button');
    btn.className = 'day-tab' + (day === WEEK_DAY_NAMES[0] ? ' active' : '');
    btn.textContent = day;
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderWeeklyList(day);
    });
    tabs.appendChild(btn);
  });
  renderWeeklyList(WEEK_DAY_NAMES[0]);

  document.getElementById('add-class-weekly').classList.toggle('hidden', !state.editMode);
}

function renderWeeklyList(day) {
  const list = document.getElementById('weekly-list');
  const items = state.schedule[day] || [];
  list.innerHTML = items.map((item, i) => {
    let editBtns = '';
    if (state.editMode) {
      editBtns = `
        <div class="edit-btns">
          <button class="edit-btn" data-day="${day}" data-idx="${i}" title="Editar">${svg('edit')}</button>
          <button class="del-btn"  data-day="${day}" data-idx="${i}" title="Excluir">${svg('trash')}</button>
        </div>`;
    }
    return `
      <div class="schedule-item">
        <div class="schedule-item-icon ${item.isBreak ? 'break' : ''}">
          ${item.isBreak ? svg('food') : svg('book')}
        </div>
        <div class="schedule-item-body">
          <div class="schedule-item-top">
            <span class="schedule-item-name">${item.subject}</span>
            ${editBtns}
          </div>
          <div class="schedule-item-meta">
            <span>${svg('clock')} ${item.time}</span>
            <span>${svg('pin')} ${item.room}</span>
            ${item.teacher ? `<span>${svg('user')} ${item.teacher}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openClassModal(btn.dataset.day, parseInt(btn.dataset.idx)));
  });
  list.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.day, i = parseInt(btn.dataset.idx);
      if (confirm('Deseja excluir esta aula?')) {
        state.schedule[d].splice(i, 1);
        saveSchedule();
        renderWeeklyList(d);
      }
    });
  });
}

// ── Renderizar tudo ───────────────────────────────────────
async function render() {
  applyTheme();
  renderHeader();
  renderWeekNav();

  // Feriados
  const year = state.selectedDate.getFullYear();
  state.holidays = await Feriados.buscar(year);
  const holiday = Feriados.checar(state.selectedDate, state.holidays);

  const dayView     = document.getElementById('day-view');
  const weekView    = document.getElementById('week-view');
  const holidayView = document.getElementById('holiday-view');

  if (holiday && !state.weeklyView) {
    // Tela de feriado
    holidayView.classList.remove('hidden');
    dayView.style.display = 'none';
    weekView.classList.add('hidden');

    document.getElementById('holiday-title').textContent =
      isToday(state.selectedDate) ? 'Hoje é Feriado!' : 'Feriado';
    document.getElementById('holiday-name').textContent = holiday.name;
    document.getElementById('holiday-desc').textContent =
      `Aproveite o seu dia de descanso! Sem atividades escolares programadas para ${isToday(state.selectedDate) ? 'hoje' : 'este dia'}.`;
    document.getElementById('holiday-date').textContent = formatDateMedium(state.selectedDate);
    return;
  }

  holidayView.classList.add('hidden');

  if (state.weeklyView) {
    dayView.style.display = 'none';
    weekView.classList.remove('hidden');
    renderWeeklyView();
  } else {
    dayView.style.display = '';
    weekView.classList.add('hidden');
    renderCurrentActivity();
    renderChanges();
    renderTimeline();
  }

  // Sidebar visibilidade no modo foco
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.display = state.focusMode ? 'none' : '';
}

// ── Modal de aula ─────────────────────────────────────────
function openClassModal(day, idx) {
  const modal = document.getElementById('class-modal');
  const title = document.getElementById('class-modal-title');
  const submit = document.getElementById('class-submit');
  const dayGroup = document.getElementById('class-day-group');

  document.getElementById('class-edit-day').value   = day || '';
  document.getElementById('class-edit-index').value = idx !== undefined ? idx : -1;

  if (idx !== undefined && idx >= 0 && day) {
    const item = state.schedule[day][idx];
    document.getElementById('class-subject').value = item.subject;
    document.getElementById('class-time').value    = item.time;
    document.getElementById('class-room').value    = item.room;
    document.getElementById('class-teacher').value = item.teacher || '';
    title.innerHTML  = svg('edit') + ' Editar Aula';
    submit.textContent = 'Salvar Alterações';
    dayGroup.style.display = 'none';
  } else {
    document.getElementById('class-subject').value = '';
    document.getElementById('class-time').value    = '';
    document.getElementById('class-room').value    = '';
    document.getElementById('class-teacher').value = '';
    document.getElementById('class-day').value     = day || WEEK_DAY_NAMES[0];
    title.innerHTML  = svg('edit') + ' Nova Aula';
    submit.textContent = 'Adicionar Aula';
    dayGroup.style.display = '';
  }

  modal.classList.add('open');
}

function closeClassModal() {
  document.getElementById('class-modal').classList.remove('open');
}

// ── Configurações ─────────────────────────────────────────
function openSettings() {
  document.getElementById('settings-modal').classList.add('open');
  const s = state.settings;
  document.querySelectorAll('.theme-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.theme === s.themeColor);
  });
  document.querySelectorAll('.font-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.size === s.fontSize);
  });
  document.getElementById('sound-toggle').checked = s.soundEnabled;
  document.getElementById('theme-hint').textContent = 'Selecionado: ' + THEME_NAMES[s.themeColor];
}
function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

// ── Logout ────────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem('bssola_session');
  window.location.href = 'index.html';
}

// ── Event Listeners ───────────────────────────────────────
document.getElementById('prev-day').addEventListener('click', () => {
  state.selectedDate = addDays(state.selectedDate, -1);
  state.weeklyView = false;
  render();
});
document.getElementById('next-day').addEventListener('click', () => {
  state.selectedDate = addDays(state.selectedDate, 1);
  state.weeklyView = false;
  render();
});
document.getElementById('today-btn').addEventListener('click', () => {
  state.selectedDate = new Date();
  state.weeklyView = false;
  render();
});
document.getElementById('prev-week').addEventListener('click', () => {
  state.selectedDate = addDays(state.selectedDate, -7);
  render();
});
document.getElementById('next-week').addEventListener('click', () => {
  state.selectedDate = addDays(state.selectedDate, 7);
  render();
});

document.getElementById('edit-toggle').addEventListener('change', e => {
  state.editMode = e.target.checked;
  render();
});
document.getElementById('focus-toggle').addEventListener('change', e => {
  state.focusMode = e.target.checked;
  document.body.classList.toggle('focus-mode', state.focusMode);
  render();
});

document.getElementById('settings-btn').addEventListener('click', openSettings);
document.getElementById('settings-close').addEventListener('click', closeSettings);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('settings-logout').addEventListener('click', logout);

// Clique fora do modal fecha
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// Tema
document.querySelectorAll('.theme-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    state.settings.themeColor = sw.dataset.theme;
    saveSettings();
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    document.getElementById('theme-hint').textContent = 'Selecionado: ' + THEME_NAMES[sw.dataset.theme];
    applyTheme();
  });
});

// Tamanho do texto
document.querySelectorAll('.font-option').forEach(opt => {
  opt.addEventListener('click', () => {
    state.settings.fontSize = opt.dataset.size;
    saveSettings();
    document.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    applyTheme();
  });
});

// Som
document.getElementById('sound-toggle').addEventListener('change', e => {
  state.settings.soundEnabled = e.target.checked;
  saveSettings();
});

// Modal de aula — formulário
document.getElementById('class-modal-close').addEventListener('click', closeClassModal);
document.getElementById('class-cancel').addEventListener('click', closeClassModal);

document.getElementById('class-form').addEventListener('submit', e => {
  e.preventDefault();
  const day    = document.getElementById('class-edit-day').value || document.getElementById('class-day').value;
  const idx    = parseInt(document.getElementById('class-edit-index').value);
  const subject = document.getElementById('class-subject').value.trim();
  const time    = document.getElementById('class-time').value.trim();
  const room    = document.getElementById('class-room').value.trim();
  const teacher = document.getElementById('class-teacher').value.trim();

  if (!subject || !time || !room) {
    alert('Preencha os campos obrigatórios: Matéria, Horário e Sala.');
    return;
  }

  const isBreak = subject.toLowerCase().includes('intervalo');
  const item = { subject, time, room, teacher, isBreak };

  if (idx >= 0) {
    state.schedule[day][idx] = item;
  } else {
    const targetDay = document.getElementById('class-day').value;
    state.schedule[targetDay].push(item);
  }
  saveSchedule();
  closeClassModal();
  render();
});

// Botões de adicionar aula
document.getElementById('add-class-sidebar').addEventListener('click', () => {
  openClassModal(getWeekDayName(state.selectedDate), undefined);
});
document.getElementById('add-class-weekly').addEventListener('click', () => {
  const activeTab = document.querySelector('.day-tab.active');
  const day = activeTab ? activeTab.textContent : WEEK_DAY_NAMES[0];
  openClassModal(day, undefined);
});

// Atualizar relógio a cada minuto
setInterval(() => {
  const now = new Date();
  const el = document.getElementById('current-clock');
  if (el) el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  renderTimeline();
}, 60000);

// ── Inicializar ───────────────────────────────────────────
loadSettings();
loadSchedule();
render();