import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const config = {
    apiKey: "AIzaSyB05Vp9pAA57RENR7CE4gWWGXP5SSeX7ak",
    authDomain: "customchat-6cc01.firebaseapp.com",
    projectId: "customchat-6cc01",
    storageBucket: "customchat-6cc01.appspot.com",
    messagingSenderId: "538921746817",
    appId: "1:538921746817:web:93ab6a01ae454f1d306880"
}


const app = initializeApp(config);

export const db = getDatabase(app)

export const messageListRef = ref(db, 'messages');





