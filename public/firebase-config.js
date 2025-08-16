/* ======================================================= */
/* FILE: firebase-config.js                                */
/* This file handles all Firebase setup and exports the    */
/* services our app will need.                             */
/* ======================================================= */

// Import functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration - THIS IS NOW COMPLETE AND CORRECT
const firebaseConfig = {
    apiKey: "AIzaSyD2Z9tCmmgReMG77ywXukKC_YIXsbP3uoU",
    authDomain: "hatakesocial-88b5e.firebaseapp.com",
    projectId: "hatakesocial-88b5e",
    storageBucket: "hatakesocial-88b5e.appspot.com",
    messagingSenderId: "1091697032506",
    appId: "1:1091697032506:web:6a7cf9f10bd12650b22403",
    measurementId: "G-EH0PS2Z84J"
};

// Initialize Firebase and export the services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);