import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeNBiwQ5HNTa2Sawg63x6TAiLuTkpSq40",
    authDomain: "wcs-cm-v10-core.firebaseapp.com",
    projectId: "wcs-cm-v10-core",
    storageBucket: "wcs-cm-v10-core.firebasestorage.app",
    messagingSenderId: "69008026618",
    appId: "1:69008026618:web:c633355431c4bd7dca5243",
    measurementId: "G-TZFHYC8BTS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
