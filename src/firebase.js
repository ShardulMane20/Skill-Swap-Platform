// Import core Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGLeHYcTJ-dXV-VuOS3_3TtzQnDFKtaNE",
  authDomain: "skillswap-6d2b7.firebaseapp.com",
  projectId: "skillswap-6d2b7",
  storageBucket: "skillswap-6d2b7.appspot.com", // ✅ fixed domain
  messagingSenderId: "809120031146",
  appId: "1:809120031146:web:f96c8db8d3c56e485e0bd3",
  measurementId: "G-97GGWWWL2D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export for use in other parts of the app
export { auth, provider, db };
