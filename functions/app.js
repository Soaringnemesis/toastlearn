



const functions     = require('firebase-functions');
const express       = require('express')
const admin         = require('firebase-admin');
const cookieParser  = require('cookie-parser');
const csrf          = require("csurf");
const exphbs        = require("express-handlebars");
const bodyParser    = require("body-parser");


admin.initializeApp();

const app = express();


let staticOptions = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false
}


app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));


app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public", staticOptions));
app.all("*", (req, res, next) => {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	next();
  });
//Home page
app.get("/", (req, res) => {
    const sessionCookie = req.cookies.session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(userRecord);
			data = userRecord.toJSON();
			res.render("index", {title: "ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.render("index", {title: "ToastLearn", user: false});
	  });
});
//Login page
app.get("/login", (req, res) => {
    const sessionCookie = req.cookies.session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(userRecord);
			data = userRecord.toJSON();
			res.render("login", {title: "ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.render("login", {title: "ToastLearn", user: false});
	  });
});
//Register page
app.get("/register", (req, res) => {
    const sessionCookie = req.cookies.session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(userRecord);
			data = userRecord.toJSON();
			res.render("register", {title: "ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.render("register", {title: "ToastLearn", user: false});
	  });
});

app.get("/toast", (req,res) => {
    const sessionCookie = req.cookies.session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(userRecord);
			data = userRecord.toJSON();
			res.render("toast", {title: "ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.redirect('/login');
	  });
})

app.get('/profile', (req, res) => {
	
	const sessionCookie = req.cookies.session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(userRecord);
			data = userRecord.toJSON();
			res.render("index", {title: "ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.redirect('/login');
	  });
});

app.get("/login", function (req, res) {
	res.render("login", {title: "ToastLearn"});
});

  app.get("/logout", (req, res) => {
	res.clearCookie("session");
	res.redirect("/login");
  });

app.post("/sessionLogin", (req, res) => {
	const idToken = req.body.idToken.toString();
  
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
	admin
	  .auth()
	  .createSessionCookie(idToken, { expiresIn })
	  .then(
		(sessionCookie) => {
		  const options = { maxAge: expiresIn, httpOnly: true };
		  res.cookie("session", sessionCookie, options);
		  res.end(JSON.stringify({ status: "success" }));
		},
		(error) => {
		  res.status(401).send("UNAUTHORIZED REQUEST!");
		}
	  );
  });




exports.app = functions.https.onRequest(app);
