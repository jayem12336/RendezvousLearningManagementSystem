import { initializeApp , getApp, getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage} from "firebase/storage";


import firebaseConfig from '../config/firebaseConfig';

// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = !getApp.length ? initializeApp(firebaseConfig) : {}
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage};