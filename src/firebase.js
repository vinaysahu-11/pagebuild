// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBM9WrBkUTunGEUi2VFeKJ_bmahjzT0OYg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pagebuild-69948.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pagebuild-69948",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pagebuild-69948.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "547376206648",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:547376206648:web:39d3f87e8d9d8392bce7cd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1KV3VYS6YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
