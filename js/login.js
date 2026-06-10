import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
 
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_ID",
  appId: "SEU_APP_ID"
};
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 
const form = document.getElementById("loginForm");
 
form.addEventListener("submit", async (e) => {
  e.preventDefault();
 
  const email = form.querySelector('input[type="text"]').value;
  const senha = document.getElementById("loginPassword").value;
 
  try {
    await signInWithEmailAndPassword(auth, email, senha);
 
    alert("Login feito com sucesso 🔥");
    window.location.href = "dashboard.html";
 
  } catch (error) {
    alert("Erro: " + error.message);
  }
});