import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// console.log(process.env.NEXT_APP_FIREBASE_API_KEY)

// const firebaseConfig = {
//   apiKey: process.env.NEXT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_APP_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyB-SscxnN3fNRGQGMqRTmhfjNu_u310ERQ",
  authDomain: "realtime-communication.firebaseapp.com",
  projectId: "realtime-communication",
  storageBucket: "realtime-communication.appspot.com",
  messagingSenderId: "1018693628217",
  appId: "1:1018693628217:web:ebb9c3ca51f1601b45b8e8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);