// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,

    // apiKey: 'AIzaSyBMUJVSD_uGzuHNfwNOV5JMcGiwfTOFxJQ',
    // authDomain: 'bill-mate-780dc.firebaseapp.com',
    // projectId: 'bill-mate-780dc',
    // storageBucket: 'bill-mate-780dc.firebasestorage.app',
    // messagingSenderId: '1006398142601',
    // appId: '1:1006398142601:web:2299f6fc2c0f490d1aee58',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
