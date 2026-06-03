document.getElementById('cadForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Conta criada com sucesso! Redirecionando para a tela de acesso.');
    window.location.href = 'index.html';
});