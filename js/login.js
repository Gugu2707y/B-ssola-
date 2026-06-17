import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtG101f6qujclXRCWmdHJVcbqlKjFXVM",
    authDomain: "bancodedadosdourado3.firebaseapp.com",
    projectId: "bancodedadosdourado3",
    storageBucket: "bancodedadosdourado3.firebasestorage.app",
    messagingSenderId: "211252758015",
    appId: "1:211252758015:web:82ccfc9e426a8c2d60d53d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");
    console.log("Tentando login...");

    const email = inputs[0].value; // primeiro input
    const senha = document.getElementById("loginPassword").value;

    try {
        console.log("tentando login:", email);
        
        // Faz a autenticação no Firebase
        await signInWithEmailAndPassword(auth, email, senha);
        
        alert("login OK 😁");
        window.location.href = "dashboard.html";
        
    } catch (error) {
        console.log("ERRO:", error.code, error.message);
        alert(error.message);
    }
});