import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

let app: FirebaseApp;
let db: Firestore;

export const initializeFirebase = (): void => {
  try {
    if (getApps().length > 0) {
      app = getApps()[0];
      db = getFirestore(app);
      return;
    }

    const hasEnvConfig = 
      process.env.FIREBASE_API_KEY && 
      process.env.FIREBASE_PROJECT_ID;

    if (hasEnvConfig) {
      const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };
      app = initializeApp(config);
      db = getFirestore(app);
    }
  } catch {
    // Firebase is optional - silently skip if no config
  }
};

initializeFirebase();

export { app, db };
