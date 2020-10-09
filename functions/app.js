const functions = require("firebase-functions");
const express = require("express");
const engines = require("consolidate");
const firebase = require("firebase-admin");
const path = require("path");
const PORT = 80;

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();

app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

let staticOptions = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false
}

app.use(express.static("public", staticOptions));


app.get("/", (req, res) => {
    res.render("index", {});
});

exports.app = functions.https.onRequest(app);

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
});