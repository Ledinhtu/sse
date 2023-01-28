// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJU-RR2MKhO9SgWaQMAwa2A2yU6_QKwLc",
    authDomain: "iot-datastream-tu2142.firebaseapp.com",
    databaseURL: "https://iot-datastream-tu2142-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-datastream-tu2142",
    storageBucket: "iot-datastream-tu2142.appspot.com",
    messagingSenderId: "231851759724",
    appId: "1:231851759724:web:0273a32b2d1246d44f6049"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
const db = getFirestore(app);

// const User = db.colection("Users");
// module.exports = Users;

// Add data
// addUser();

readUser();

async function addUser() {
    const { collection, addDoc } = require("firebase/firestore"); 
    try {
          const docRef = await addDoc(collection(db, "users"), {
            first: "Ada",
            middle: "Mathison",
            last: "Lovelace",
            born: 1815
          });
            
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
}

async function readUser() {
    const { collection, getDocs } = require("firebase/firestore"); 

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        console.log(doc.data());
    })
}