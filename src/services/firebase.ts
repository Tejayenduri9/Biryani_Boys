import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDsKWWuoSVGsAn7QMZUT9d6766Upmrvl6g",
  authDomain: "reviews-38d98.firebaseapp.com",
  projectId: "reviews-38d98",
  storageBucket: "reviews-38d98.firebasestorage.app",
  messagingSenderId: "839831299941",
  appId: "1:839831299941:web:807d9fc90c02e01f7be38c",
  measurementId: "G-GX6FKDY3ZR",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firebase Auth
const auth = getAuth(app);
auth.useDeviceLanguage();

// ✅ Firestore
const db = getFirestore(app);

// ✅ Enable IndexedDB persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Current browser does not support persistence');
  }
});

// ✅ Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider); // 🛠️ Fixed: Removed browserPopupRedirectResolver
};

export { auth, db };
