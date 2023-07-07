// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import EVENTS from "./events";
import { logFirebaseEvent } from "./logFirebaseEvent";
import "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export { EVENTS, db, analytics, logFirebaseEvent };
export default app;
