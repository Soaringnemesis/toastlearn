const { convertRuleOptions } = require("tslint/lib/configuration");


console.log(Cookies.get("XSRF-TOKEN"));
document.getElementById("login").addEventListener("submit", (event) => {
    event.preventDefault();
    const login = $("#email").val();
    const password = $("#password").val();

    firebase.auth().signInWithEmailAndPassword(login, password)
                .then(({ user }) => {
                  return user.getIdToken().then((idToken) => {
                    return fetch("/sessionLogin", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                      },
                      body: JSON.stringify({ idToken }),
                    });
                  });
                })
                .then(() => {
                  return firebase.auth().signOut();
                })
                .then(() => {
                  window.location.assign("/profile");
                });
              return false;
            });