// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6nNxwBySd1YiG4QUtU9XACrIMtR8w42M",
  authDomain: "recipe-app-ff529.firebaseapp.com",
  projectId: "recipe-app-ff529",
  storageBucket: "recipe-app-ff529.firebasestorage.app",
  messagingSenderId: "317582960360",
  appId: "1:317582960360:web:fd2d95a79efc7bb8788b5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección 'users'
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para la colección 'recipes' (si la tienes)
    match /recipes/{recipeId} {
      allow read: if true; // Cualquiera puede leer las recetas
      allow write: if request.auth != null; // Solo usuarios autenticados pueden escribir
    }
    
    // Regla por defecto - denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}