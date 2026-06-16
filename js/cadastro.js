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

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("regPassword").value;
  const confirmar = document.getElementById("regConfirmPassword").value;

  if (senha !== confirmar) {
    alert("Senhas não coincidem");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nome,
      email
    });

    alert("Conta criada!");
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message);
  }
});