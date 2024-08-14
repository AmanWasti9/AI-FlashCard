// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg2kp7_Ircxn0gDLqxZeXvMqBr7nkzekM",
  authDomain: "ai-flashcards-fe531.firebaseapp.com",
  projectId: "ai-flashcards-fe531",
  storageBucket: "ai-flashcards-fe531.appspot.com",
  messagingSenderId: "674893612675",
  appId: "1:674893612675:web:3d305e84f061d37fa73db6",
  measurementId: "G-G585T68TM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

export { firestore, storage, analytics, auth };
