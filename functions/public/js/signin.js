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

// FirebaseUI config.
var uiConfig = {
    signInOptions: [
        // google sign in option
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],

    callbacks: {
        signInSuccess: function(user, credential, redirectUrl) {
            // User successfully signed in.
            user.getIdToken().then(function(idToken) {
                window.location.href = '/sessionLogin?idToken=' + idToken;
            }).catch(error => {
                alert(error);
            }) 

        }
    }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);