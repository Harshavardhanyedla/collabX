import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwN_5jlQ3edG8WRIOWnBCUKnjyfnXtEPo",
    authDomain: "collabx-a055c.firebaseapp.com",
    projectId: "collabx-a055c",
    storageBucket: "collabx-a055c.firebasestorage.app",
    messagingSenderId: "348756055784",
    appId: "1:348756055784:web:803b0214061b74dff01b5d",
    measurementId: "G-NKNYLWZV4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
