var firebaseConfig = {
    apiKey: "AIzaSyBsrVziLkgGXgwWJ0Y6-7NWYsSP1jYVqlw",
    authDomain: "team-proj-133.firebaseapp.com",
    databaseURL: "https://team-proj-133.firebaseio.com",
    projectId: "team-proj-133",
    storageBucket: "team-proj-133.appspot.com",
    messagingSenderId: "355133090911",
    appId: "1:355133090911:web:0caadf58bbca71992e3fea",
    measurementId: "G-JPNL12HBDE"
  };
  firebase.initializeApp(firebaseConfig);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);