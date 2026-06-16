import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1G18Jf6qujcLXRc6Wz4K3VcOqi8jfXY8",
  authDomain: "bancodedadosdourado2.firebaseapp.com",
  projectId: "bancodedadosdourado2",
  storageBucket: "bancodedadosdourado2.firebasestorage.app",
  messagingSenderId: "311352710045",
  appId: "1:311352710045:web:83ccfce9c45a0a266e9574"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    document.getElementById("welcomeUser").innerText =
      docSnap.data().nome;
  }
});

document.addEventListener('DOMContentLoaded', () => {

    // ===== UTIL =====
    const $ = (id) => document.getElementById(id);

    // ===== USER =====
    const user = localStorage.getItem('usuarioLogado') || 'Usuário';
    const welcome = $('welcomeUser');
    if (welcome) welcome.innerText = user;

    // ===== DATA =====
    let dataAtual = new Date('2026-06-02T00:00:00');

    const fullDate = $('currentFullDate');
    if (fullDate) {
        fullDate.innerText = dataAtual.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // ===== ELEMENTOS =====
    const weekGrid = $('weekGrid');
    const banner = $('statusBanner');
    const timeline = $('timelineList');

    // ===== SEMANA =====
    function gerarSemana() {
        if (!weekGrid) return;

        weekGrid.innerHTML = '';

        let base = new Date(dataAtual);
        let day = base.getDay();
        let diff = day === 0 ? -6 : 1 - day;
        base.setDate(base.getDate() + diff);

        for (let i = 0; i < 5; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);

            const card = document.createElement('div');
            card.className = 'week-day-card';

            if (d.toDateString() === dataAtual.toDateString()) {
                card.classList.add('active');
            }

            card.innerHTML = `
                <small>${d.toLocaleDateString('pt-BR', { weekday: 'short' })}</small>
                <h3>${d.getDate()}</h3>
            `;

            card.onclick = () => {
                dataAtual = d;
                gerarSemana();
                atualizarBanner();
            };

            weekGrid.appendChild(card);
        }
    }

    // ===== BANNER =====
    function atualizarBanner() {
        if (!banner) return;

        banner.innerHTML = `
            <span class="material-symbols-outlined">info</span>
            <span>📍 Dia selecionado: ${dataAtual.toLocaleDateString('pt-BR')}</span>
        `;
    }

    // ===== TIMELINE (MOCK) =====
    function gerarTimeline() {
        if (!timeline) return;

        const rotina = [
            { nome: "Português", hora: "08:00 - 08:50", sala: "12" },
            { nome: "Matemática", hora: "08:50 - 09:40", sala: "12" },
            { nome: "História", hora: "09:40 - 10:30", sala: "15" }
        ];

        timeline.innerHTML = '';

        rotina.forEach(item => {
            const div = document.createElement('div');
            div.className = 'info-block-card';

            div.innerHTML = `
                <strong>${item.nome}</strong>
                <div style="font-size:12px; opacity:.7">${item.hora} • Sala ${item.sala}</div>
            `;

            timeline.appendChild(div);
        });
    }

    // ===== BOTÕES =====
    $('btnPrevDay')?.addEventListener('click', () => {
        dataAtual.setDate(dataAtual.getDate() - 1);
        gerarSemana();
        atualizarBanner();
    });

    $('btnNextDay')?.addEventListener('click', () => {
        dataAtual.setDate(dataAtual.getDate() + 1);
        gerarSemana();
        atualizarBanner();
    });

    // ===== LOGOUT =====
    $('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });

    // ===== INIT =====
    gerarSemana();
    atualizarBanner();
    gerarTimeline();
});