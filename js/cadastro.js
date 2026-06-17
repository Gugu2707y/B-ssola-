import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtG101f6qujclXRCWmdHJVcbqlKjFXVM",
    authDomain: "bancodedadosdourado3.firebaseapp.com",
    projectId: "bancodedadosdourado3",
    storageBucket: "bancodedadosdourado3.firebasestorage.app",
    messagingSenderId: "211252758015",
    appId: "1:211252758015:web:82ccfc9e426a8c2d60d53d"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("cadForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturar os valores dos campos do formulário
    const nome = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const senha = document.getElementById("regPassword").value;
    const confirmar = document.getElementById("regConfirmPassword").value;

    // Validação da palavra-passe
    if (senha !== confirmar) {
        alert("As senhas não coincidem!");
        return; // Interrompe a execução
    }

    try {
        // 1. Criar o utilizador no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // 2. Guardar os dados adicionais no Firestore Database
        await setDoc(doc(db, "usuarios", user.uid), {
            nome: nome,
            email: email
        });

        alert("Conta criada com sucesso 🔥");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Erro ao registar:", error);
        alert("Erro: " + error.message);
    }
});