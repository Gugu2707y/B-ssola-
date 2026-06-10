import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
 
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