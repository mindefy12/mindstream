// Firebase Configuration for Mindstream
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzfTZN7UZmIZqJlSRpHFPWFujxXNfKOlk",
  authDomain: "mindstream-2a003.firebaseapp.com",
  projectId: "mindstream-2a003",
  storageBucket: "mindstream-2a003.firebasestorage.app",
  messagingSenderId: "822653979965",
  appId: "1:822653979965:web:c5b6026a74948ea9260954",
  measurementId: "G-G3RYMHYC7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
