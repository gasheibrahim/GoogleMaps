// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS32PyI-2t53bG3aymd5_sLESsBV8hlrk",
  authDomain: "study-c4e33.firebaseapp.com",
  projectId: "study-c4e33",
  storageBucket: "study-c4e33.appspot.com",
  messagingSenderId: "695107954573",
  appId: "1:695107954573:web:b4ddeba387eca3f200ffc4",
  measurementId: "G-3FLWSWXFE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getAnalytics(app);