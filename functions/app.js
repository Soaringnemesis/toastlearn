



const functions     = require('firebase-functions');
const express       = require('express')
const admin         = require('firebase-admin');
const cookieParser  = require('cookie-parser');

const exphbs = require("express-handlebars");


admin.initializeApp(functions.config().firebase);

const app = express();

app.engine("hbs", exphbs({defaultLayout: "layout.hbs"}));
app.set("views", "./views");
app.set("view engine", "hbs");

app.use(cookieParser());

let staticOptions = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false
}




app.use(express.static("public", staticOptions));

//Home page
app.get("/", (req, res) => {
    let uid = "";
    if(req.decodedClaims){
        uid = req.decodedClaims.uid;
    }
    //let uid =  req.decodedClaims.uid;
    res.render("index", {title: "ToastLearn", uid: uid});
});
//Login page
app.get("/login", (req, res) => {
    res.render("login", {});
});
//Register page
app.get("/register", (req, res) => {
    res.render("register", {});
});

app.get("/sessionLogin", (req, res) => {
    const idToken = req.query.idToken;
	setCookie(idToken, res);
});

function setCookie(idToken, res) {
	// Set session expiration to 5 days.
	// Create the session cookie. This will also verify the ID token in the process.
	// The session cookie will have the same claims as the ID token.
	
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
		
		// Set cookie policy for session cookie and set in response.
		const options = {maxAge: expiresIn, httpOnly: true, secure: true};
		res.cookie('__session', sessionCookie, options);
		
		admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
			res.redirect('/');
		});
			
	}, error => {
		res.status(401).send(error);
	});
}


exports.app = functions.https.onRequest(app);
