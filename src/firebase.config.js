// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWbn7TM5XLnN_eCCKYpa1Po_bgP5mUAjQ",
  authDomain: "the-vault-ddaa2.firebaseapp.com",
  projectId: "the-vault-ddaa2",
  storageBucket: "the-vault-ddaa2.appspot.com",
  messagingSenderId: "825510130105",
  appId: "1:825510130105:web:b4767aa1a9d1fec13c8668",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
