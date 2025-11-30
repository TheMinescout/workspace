// FIREBASE CONFIGURATION (Centralized)
// Copy this file to assets/js/firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyAZE1qCY8YCZLrZ2EWT0QTFRoBVHvabqDM",
    authDomain: "minescout-life-4a668.firebaseapp.com",
    databaseURL: "https://minescout-life-4a668-default-rtdb.firebaseio.com",
    projectId: "minescout-life-4a668",
    storageBucket: "minescout-life-4a668.appspot.com",
    messagingSenderId: "351393417322",
    appId: "1:351393417322:web:92c9a92a50e60890136213",
    measurementId: "G-RFP78TP9KZ"
};

// Initialize if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}