// 1. Import the functions you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaYXsWDST32eNKNIGeW9aYisxp4i9cDrQ",
  authDomain: "zero-hour-cf373.firebaseapp.com",
  projectId: "zero-hour-cf373",
  storageBucket: "zero-hour-cf373.firebasestorage.app",
  messagingSenderId: "872285669208",
  appId: "1:872285669208:web:36153f37ba10617c8b872d"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Handle Email/Password Login
window.handleLogin = async function(event) {
    event.preventDefault(); // This stops the page from reloading

    const email = document.getElementById('login_field').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('.btn-primary');

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Verifying...";
    submitBtn.disabled = true;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as:", userCredential.user.email);
        
        // --- FIX: Standardized to 'Home%20Page' ---
        window.location.href = "../Home%20Page/home.html";
        
    } catch (error) {
        console.error("Error:", error);
        alert("Login failed: " + error.message);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

// 5. Handle Google Login
window.handleGoogleLogin = async function() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log("Google Login Success:", user.email);
        
        // --- FIX: Standardized to 'Home%20Page' ---
        window.location.href = "../Home_Page/home.html";
        
    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Google Sign-In failed. Please try again.");
    }
}