  const { initializeApp } = require("firebase/app");
  const { getDatabase} = require("firebase/database");

  const firebaseConfig = {
      apiKey: "AIzaSyBJU-RR2MKhO9SgWaQMAwa2A2yU6_QKwLc",
      authDomain: "iot-datastream-tu2142.firebaseapp.com",
      projectId: "iot-datastream-tu2142",
      storageBucket: "iot-datastream-tu2142.appspot.com",
      messagingSenderId: "231851759724",
      appId: "1:231851759724:web:0273a32b2d1246d44f6049",
      databaseURL: "https://iot-datastream-tu2142-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);

  module.exports = database;