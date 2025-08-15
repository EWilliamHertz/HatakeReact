// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AlzaSyD2Z3rCmmgReMG77ywxkKKC_YtXsbP3uoU", // Found in IMG_6607.jpg as "Web API key"
  authDomain: "hatakesocial-88b5e.firebaseapp.com",
  projectId: "hatakesocial-88b5e", // Found in IMG_6607.jpg
  storageBucket: "hatakesocial-88b5e.appspot.com",
  messagingSenderId: "1091697032506",
  appId: "1:1091697032506:web:6a7cf9f1dbd12650b22403",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { auth, db, storage, functions };