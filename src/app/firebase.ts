import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC0bhIEMKfNuBKu4Vp5WwGYoZW2GWJGfaY',
  authDomain: 'magic-173de.firebaseapp.com',
  databaseURL: 'https://magic-173de-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'magic-173de',
  storageBucket: 'magic-173de.appspot.com',
  messagingSenderId: '843032359293',
  appId: '1:843032359293:web:cf9b2d1cfe9dc26dfd5c14'
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
