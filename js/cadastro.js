import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
e.preventDefault();


const nome = document.getElementById("nome").value.trim();
const email = document.getElementById("email").value.trim();
const senha = document.getElementById("regPassword").value;
const confirmarSenha = document.getElementById("regConfirmPassword").value;

if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
}

try {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
    );

    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        criadoEm: new Date().toISOString()
    });

    alert("Conta criada com sucesso!");

    window.location.href = "index.html";

} catch (error) {
    console.error(error);

    switch (error.code) {

        case "auth/email-already-in-use":
            alert("Este e-mail já está cadastrado.");
            break;

        case "auth/invalid-email":
            alert("E-mail inválido.");
            break;

        case "auth/weak-password":
            alert("A senha deve ter pelo menos 6 caracteres.");
            break;

        default:
            alert("Erro ao criar conta: " + error.message);
    }
}


});
