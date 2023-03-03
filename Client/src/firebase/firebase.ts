// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBodCGWKXKiDkF0kN7p-k7GE5vtNWJDlEI",
  authDomain: "blaaapp2.firebaseapp.com",
  projectId: "blaaapp2",
  storageBucket: "blaaapp2.appspot.com",
  messagingSenderId: "771096389957",
  appId: "1:771096389957:web:2f5199c7b4a15949deb62c",
  measurementId: "G-KR2DY4DEFQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const analytics = getAnalytics(app);
