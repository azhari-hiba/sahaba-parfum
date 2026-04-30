import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChPwioly6maGlM8HfVJEYj5GVXmYIZisc",
  authDomain: "sahaba-parfum-new.firebaseapp.com",
  projectId: "sahaba-parfum-new",
  storageBucket: "sahaba-parfum-new.firebasestorage.app",
  messagingSenderId: "495591544985",
  appId: "1:495591544985:web:1a7442d9ba854b8d7c0008",
  measurementId: "G-JK6VXMHG1S"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);