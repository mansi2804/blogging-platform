import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB876C6_PUX0Ch3fEmct_HvLRlZi1d1OZA",
    authDomain: "blogging-platform-cd7e2.firebaseapp.com",
    projectId: "blogging-platform-cd7e2",
    storageBucket: "blogging-platform-cd7e2.firebasestorage.app",
    messagingSenderId: "900051933384",
    appId: "1:900051933384:web:63e5e0663b38b4669fedfd"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };