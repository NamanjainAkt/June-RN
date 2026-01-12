import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import Constants from 'expo-constants';

let app: FirebaseApp;
let db: Firestore;

const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY || Constants.expoConfig?.extra?.eas?.apiKey || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.eas?.authDomain || '',
    projectId: process.env.FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.eas?.projectId || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.eas?.storageBucket || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.eas?.messagingSenderId || '',
    appId: process.env.FIREBASE_APP_ID || Constants.expoConfig?.extra?.eas?.appId || '',
  };

  return config;
};

export const initializeFirebase = (): void => {
  try {
    const config = getFirebaseConfig();

    if (!config.apiKey || !config.projectId) {
      console.warn('Firebase configuration missing. Please set environment variables.');
      return;
    }

    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }

    db = getFirestore(app);

    enableIndexedDbPersistence(db).catch((err) => {
      console.error('Firebase persistence error:', err);
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
};

initializeFirebase();

export { app, db };
