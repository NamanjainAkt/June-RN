import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

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
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY &&
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

    if (hasEnvConfig) {
      const config = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
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

