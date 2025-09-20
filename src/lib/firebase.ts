import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

const firebaseConfig = {
  apiKey: publicRuntimeConfig?.firebaseApiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: publicRuntimeConfig?.firebaseAuthDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicRuntimeConfig?.firebaseProjectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicRuntimeConfig?.firebaseStorageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicRuntimeConfig?.firebaseMessagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicRuntimeConfig?.firebaseAppId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, firestore, googleProvider };
