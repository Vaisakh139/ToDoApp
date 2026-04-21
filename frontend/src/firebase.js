import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDryWEGvo38ITj0-gXjfH47lZjhoHodEWo",
  authDomain: "todo-4b619.firebaseapp.com",
  projectId: "todo-4b619",
  storageBucket: "todo-4b619.appspot.com",
  messagingSenderId: "616833743888",
  appId: "1:616833743888:web:f60d08870f13ceae095e95",
  measurementId: "G-B832S6PFM1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
