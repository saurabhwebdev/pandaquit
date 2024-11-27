import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD4FAZhMStMrqNhX3ZpHxsVmph21Ggamts",
  authDomain: "quitter-614a5.firebaseapp.com",
  projectId: "quitter-614a5",
  storageBucket: "quitter-614a5.firebasestorage.app",
  messagingSenderId: "403092958220",
  appId: "1:403092958220:web:5ee213b4b73ee8822c9229",
  measurementId: "G-GEMSJETJLF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
