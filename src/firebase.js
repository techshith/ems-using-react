// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhCGwvg9lT6hmo3TEPhZSzmd-4DK768LE",
  authDomain: "employeemanagement-29998.firebaseapp.com",
  projectId: "employeemanagement-29998",
  storageBucket: "employeemanagement-29998.appspot.com",
  messagingSenderId: "491230452734",
  appId: "1:491230452734:web:faaddbf50c11a33e943eaf",
  measurementId: "G-5S079ZJBS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };