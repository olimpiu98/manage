import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL0m8v9nDRM-b8n7QJaoM3T5ZkEr_W8a4",
  authDomain: "todo-app-bf443.firebaseapp.com",
  projectId: "todo-app-bf443",
  storageBucket: "todo-app-bf443.firebasestorage.app",
  messagingSenderId: "428373017223",
  appId: "1:428373017223:web:a6087406b6d5e3ace22e22",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }

