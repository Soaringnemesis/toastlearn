const functions = require("firebase-functions");
const express = require("express");
const PORT = 80;

const app = express();
app.get("/", (request, response) => {

});

exports.app = functions.https.onRequest(app);

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
});