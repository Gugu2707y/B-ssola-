document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    
    // Armazena a sessão temporária
    localStorage.setItem('usuarioLogado', user);
    window.location.href = 'dashboard.html';
});