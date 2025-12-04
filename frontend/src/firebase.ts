// Firebase initialization for phone authentication
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCZy5MoK06Lv2KqfihKrckhWsO7dfIi9MM",
    authDomain: "known-9851c.firebaseapp.com",
    projectId: "known-9851c",
    storageBucket: "known-9851c.firebasestorage.app",
    messagingSenderId: "436301690706",
    appId: "1:436301690706:web:6eef11e763c224f2d76c8b",
    measurementId: "G-ML69VX9PGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);
