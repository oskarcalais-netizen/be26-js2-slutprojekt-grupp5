// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh6cjaS-q6ww_dPsqK08bPhK8pPMGCAkA",
  authDomain: "scrum-board-78c6b.firebaseapp.com",
  databaseURL:
    "https://scrum-board-78c6b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scrum-board-78c6b",
  storageBucket: "scrum-board-78c6b.firebasestorage.app",
  messagingSenderId: "942988826225",
  appId: "1:942988826225:web:37f2260c511831dfc3edd0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
