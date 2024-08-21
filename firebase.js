// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6BqHFI5PK9q4Y9OM8eXnFgGfm3qZiTSo",
  authDomain: "ai-flashcards-9ae70.firebaseapp.com",
  projectId: "ai-flashcards-9ae70",
  storageBucket: "ai-flashcards-9ae70.appspot.com",
  messagingSenderId: "39616233313",
  appId: "1:39616233313:web:e931ca4b01b73a8ac0cf20",
  measurementId: "G-SF3ZQGGY2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}