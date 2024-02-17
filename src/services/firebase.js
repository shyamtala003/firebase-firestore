// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsAfNpdrZtxN1eFypvc0KLc1m7agMrMqo",
  authDomain: "firestore-auth-adee9.firebaseapp.com",
  projectId: "firestore-auth-adee9",
  storageBucket: "firestore-auth-adee9.appspot.com",
  messagingSenderId: "1022976085654",
  appId: "1:1022976085654:web:23cb7c8ebe365e4b377cb7",
  measurementId: "G-P0C69YP5GD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();
