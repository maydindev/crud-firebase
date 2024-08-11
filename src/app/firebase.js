// firebase.js
/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
*/




// Import the functions you need from the SDKs you need
/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
*/
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR3ZyHsRD_3JymbRTn41-sDnGzvzXUB5g",
  authDomain: "crud-firebase-1c0dd.firebaseapp.com",
  projectId: "crud-firebase-1c0dd",
  storageBucket: "crud-firebase-1c0dd.appspot.com",
  messagingSenderId: "275196681487",
  appId: "1:275196681487:web:0c7875c302c0acd5ff327a",
  measurementId: "G-VC3EY3FRTX"
};

// Initialize Firebase
/*
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
*/

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth();
const db = getFirestore(app)

// try to add analytics
const analytics =
  app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;

export {auth, db, analytics}

//export { db };