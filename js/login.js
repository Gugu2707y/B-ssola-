'use strict';

// Mostrar data de hoje na tela de login
(function setDate() {
  const el = document.getElementById('date-text');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });
})();

// Toggle mostrar/ocultar senha
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.password-wrapper').querySelector('input');
    const show = btn.querySelector('.icon-eye-show');
    const hide = btn.querySelector('.icon-eye-hide');
    if (input.type === 'password') {
      input.type = 'text';
      show.style.display = 'none';
      hide.style.display = '';
    } else {
      input.type = 'password';
      show.style.display = '';
      hide.style.display = 'none';
    }
  });
});

// Formulário de login
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const nameInput = document.getElementById('login-name');
  const passInput = document.getElementById('login-password');
  const errorEl  = document.getElementById('login-error');
  const errName  = document.getElementById('error-name');
  const errPass  = document.getElementById('error-password');

  // Limpar erros
  errName.textContent = '';
  errPass.textContent = '';
  errorEl.textContent = '';

  const identifier = nameInput.value.trim();
  const password   = passInput.value.trim();

  let valid = true;
  if (!identifier) {
    errName.textContent = 'Preencha seu nome ou e-mail.';
    valid = false;
  }
  if (!password) {
    errPass.textContent = 'Preencha sua senha.';
    valid = false;
  }
  if (!valid) return;

  // Verificar usuário salvo
  const users = JSON.parse(localStorage.getItem('bssola_users') || '[]');
  const found = users.find(u =>
    (u.name.toLowerCase() === identifier.toLowerCase() ||
     u.email.toLowerCase() === identifier.toLowerCase()) &&
    u.password === password
  );

  if (!found && users.length > 0) {
    errorEl.textContent = 'Nome/e-mail ou senha incorretos.';
    return;
  }

  // Primeira vez (sem usuários cadastrados) — acesso de demonstração
  const userData = found || { name: identifier, email: '', password };
  sessionStorage.setItem('bssola_session', JSON.stringify({
    name: userData.name,
    email: userData.email
  }));

  window.location.href = 'dashboard.html';
});
