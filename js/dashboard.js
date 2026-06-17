let hoje = new Date();

document.getElementById("saudacao")
.innerHTML =
"Olá, " +
localStorage.getItem("usuario");

let dia = hoje.getDate();
let mes = hoje.getMonth()+1;

let mensagem = "";

if(dia == 7 && mes == 9){
    mensagem =
    "Hoje é Independência do Brasil";
}

else if(dia == 12 && mes == 10){
    mensagem =
    "Hoje é Nossa Senhora Aparecida";
}

else if(dia == 15 && mes == 11){
    mensagem =
    "Hoje é Proclamação da República";
}

else if(dia == 25 && mes == 12){
    mensagem =
    "Hoje é Natal";
}

else if(mes == 1){
    mensagem =
    "Você está em férias de janeiro";
}

else if(mes == 7){
    mensagem =
    "Você está em férias de julho";
}

else{
    mensagem =
    "Hoje não há feriados";
}

document.getElementById("mensagemData")
.innerHTML = mensagem;