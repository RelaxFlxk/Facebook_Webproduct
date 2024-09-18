// src/config/firebaseConfig.js

import firebase from 'firebase/app'
import 'firebase/auth' // Import Firebase Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC_tZSHkiE5xkAwTfKhu3hFFOvybv8tUgY',
  authDomain: 'api-intern-978ba.firebaseapp.com',
  projectId: 'api-intern-978ba',
  storageBucket: 'api-intern-978ba.appspot.com',
  messagingSenderId: '357974285385',
  appId: '1:357974285385:web:249fb55622540761eff398'
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider()

export { firebase, googleProvider }
