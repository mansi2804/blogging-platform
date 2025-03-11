import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_fJFYlUkZ9ZskbVllQIXfayEJJ2vt8Pw",
  authDomain: "blogging-platform-70fbf.firebaseapp.com",
  projectId: "blogging-platform-70fbf",
  storageBucket: "blogging-platform-70fbf.firebasestorage.app",
  messagingSenderId: "928893654154",
  appId: "1:928893654154:web:b19a23c59c1c2a138a4973"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, database, auth };
