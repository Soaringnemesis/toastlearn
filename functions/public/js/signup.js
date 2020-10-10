
  document.getElementById("register").addEventListener("submit", (event) => {
    event.preventDefault();
    const login = $("#email").val();
    const password = $("#password").val();
    const username = $("#username").val();
    firebase.auth().createUserWithEmailAndPassword(login, password)
              .then(({ user }) => {
                user.updateProfile({
                    displayName: username
                }).then(function() {
                    // Update successful.
                }, function(error) {
                    // An error happened.
                }); 


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