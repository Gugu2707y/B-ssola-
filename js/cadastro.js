'use strict';

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

document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name    = document.getElementById('reg-name').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const pass    = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  const errName    = document.getElementById('error-reg-name');
  const errEmail   = document.getElementById('error-reg-email');
  const errPass    = document.getElementById('error-reg-password');
  const errConfirm = document.getElementById('error-reg-confirm');
  const globalErr  = document.getElementById('register-error');

  errName.textContent = errEmail.textContent = errPass.textContent = errConfirm.textContent = globalErr.textContent = '';

  let valid = true;

  if (!name) {
    errName.textContent = 'Preencha seu nome completo.';
    valid = false;
  }
  if (!email || !email.includes('@')) {
    errEmail.textContent = 'Digite um e-mail válido.';
    valid = false;
  }
  if (pass.length < 4) {
    errPass.textContent = 'A senha deve ter pelo menos 4 caracteres.';
    valid = false;
  }
  if (pass !== confirm) {
    errConfirm.textContent = 'As senhas não coincidem.';
    valid = false;
  }
  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('bssola_users') || '[]');
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    globalErr.textContent = 'Já existe uma conta com este e-mail.';
    return;
  }

  users.push({ name, email, password: pass });
  localStorage.setItem('bssola_users', JSON.stringify(users));

  sessionStorage.setItem('bssola_session', JSON.stringify({ name, email }));
  window.location.href = 'dashboard.html';
});
