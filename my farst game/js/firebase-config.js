// js/firebase-config.js
// This file initializes the Firebase SDK. 
// Note: Replace these config values with your actual Firebase project credentials.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplaceWithYourOwnAppKey",
  authDomain: "rafiq-game.firebaseapp.com",
  projectId: "rafiq-game",
  storageBucket: "rafiq-game.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  databaseURL: "https://rafiq-game-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
