import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
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
export const storage = getStorage(app);
