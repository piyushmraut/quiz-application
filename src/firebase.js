import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3KNvaoTU4TnVzvDqRUzMlG-BQZj9eVMQ",
    authDomain: "quiz-app-f0bcb.firebaseapp.com",
    projectId: "quiz-app-f0bcb",
    storageBucket: "quiz-app-f0bcb.firebasestorage.app",
    messagingSenderId: "526655663704",
    appId: "1:526655663704:web:2ae632025843a4b856242d"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };