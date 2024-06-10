// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyC68GcAhoSG2NQc3A1xQB6OAoiGPaVScR8",
    authDomain: "msme-support.firebaseapp.com",
    projectId: "msme-support",
    storageBucket: "msme-support.appspot.com",
    messagingSenderId: "936443617181",
    appId: "1:936443617181:web:1b05eaebff43d27fb09974",
    measurementId: "G-V7RLHM3KW4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export {auth};
export const firestore = getFirestore(app);