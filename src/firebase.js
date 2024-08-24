import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBHyqSnj2WwmUYKyMJGm0J6ViUX8bqjcw",
  authDomain: "evaluator-4be6b.firebaseapp.com",
  projectId: "evaluator-4be6b",
  storageBucket: "evaluator-4be6b.appspot.com",
  messagingSenderId: "467999339469",
  appId: "1:467999339469:web:cef075ed13870619d48a84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
