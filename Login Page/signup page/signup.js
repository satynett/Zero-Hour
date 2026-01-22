// 1. Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 2. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaYXsWDST32eNKNIGeW9aYisxp4i9cDrQ",
  authDomain: "zero-hour-cf373.firebaseapp.com",
  projectId: "zero-hour-cf373",
  storageBucket: "zero-hour-cf373.firebasestorage.app",
  messagingSenderId: "872285669208",
  appId: "1:872285669208:web:36153f37ba10617c8b872d"
};

// 3. Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Handle Email Sign Up
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('.signup-btn');

    // Validation
    if(password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    // Button loading state
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Creating account...";
    submitBtn.disabled = true;

    try {
        // Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created for:", userCredential.user.email);
        
        // --- CHANGE START ---
        // Redirect to home page
        window.location.href = "../../Home_Page/home.html";
        // --- CHANGE END ---
        
    } catch (error) {
        console.error("Error:", error);
        let errorMsg = "Sign up failed.";
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = "That email is already registered. Try logging in.";
        }
        alert(errorMsg);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

// 5. Handle Google Sign Up
window.handleGoogleSignup = async function() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google Sign-Up Success:", user.email);
        
        // --- CHANGE START ---
        // Redirect to home page
        window.location.href = "../home.html";
        // --- CHANGE END ---
        
    } catch (error) {
        console.error("Google Error:", error);
        alert("Google Sign-In failed. Please try again.");
    }
}