function login(){

    let email =
    document.getElementById("email").value;

    let senha =
    document.getElementById("senha").value;

    if(email === "" || senha === ""){
        alert("Preencha todos os campos");
        return;
    }

    localStorage.setItem("usuario", email);

    window.location.href =
    "dashboard.html";
}