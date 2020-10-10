



const functions     = require('firebase-functions');
const express       = require('express')
const admin         = require('firebase-admin');
const cookieParser  = require('cookie-parser');
const csrf          = require("csurf");
const exphbs        = require("express-handlebars");
const bodyParser    = require("body-parser");


admin.initializeApp();
const db = admin.firestore();


const app = express();


let staticOptions = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false
}




//I don't care if this gets leaked. Who will use it anyways?
/*const ALGOLIA_APP_ID = "OBHENVV9DR";
const ALGOLIA_ADMIN_KEY = "3a7b89776da3b87012ef76126a9783a6";
const ALGOLIA_INDEX_NAME = "subjects";

exports.addFirestoreDataToAlgolia = functions.https.onRequest((req,res) => {
	admin.firestore().collection("subjects").get().then((docs)=> {
		docs.forEach((doc) => {
			let name = doc.data();
			name.objectID = doc.id;
		})
	})
})*/

app.use(bodyParser.json());
app.use(cookieParser());
var csurfMiddleware = csrf({ cookie: true });
app.use(csurfMiddleware);


app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public", staticOptions));
app.use(function (req, res, next) {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.setHeader(
	'Access-Control-Allow-Headers',
	'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
  });

//Home page
app.get("/", (req, res) => {
	const sessionCookie = req.cookies.__session || '';

	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			
			// See the UserRecord reference doc for the contents of userRecord.
			data = userRecord.toJSON();

			db.collection("subjects").get()
			.then(query=>{
				let json = query.docs.map(doc=>{
					let x = doc.data()
						x['_id']=doc.id;
						return x;
				});
				console.log("LOOKIE HERE!");
				console.log(json);
				res.render("index", {title: "All Toasts | ToastLearn", user: data, subjects: json});
				
			})
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		db.collection("subjects").get()
			.then(query=>{
				let json = query.docs.map(doc=>{
					let x = doc.data()
						x['_id']=doc.id;
						return x;
				});
				console.log("LOOKIE HERE!");
				console.log(json);
				res.render("index", {title: "All Toasts | ToastLearn", user: false, subjects: json});
				
			});
	  });
});
//Login page
app.get("/login", (req, res) => {
	console.log(" ");
	console.log(" ");
	console.log(" TOKEN:" + req.csrfToken());
	console.log(" ");
	console.log(" ");
	const sessionCookie = req.cookies.__session || '';
	
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			data = userRecord.toJSON();
			res.render("login", {title: "Log In | ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.render("login", {title: "Log In | ToastLearn", user: false});
	  });
});
//Register page
app.get("/register", (req, res) => {
    const sessionCookie = req.cookies.__session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			data = userRecord.toJSON();
			res.render("register", {title: "Register | ToastLearn", user: data});
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.render("register", {title: "Register | ToastLearn", user: false});
	  });
});

app.get("/toast", (req,res) => {
    const sessionCookie = req.cookies.__session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			data = userRecord.toJSON();
			res.redirect('/');
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.redirect('/login');
	  });
});

app.get('/toast/:id', function(req, res) {
	var id = req.params.id;
	const sessionCookie = req.cookies.__session || '';
	console.log(sessionCookie);
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			// See the UserRecord reference doc for the contents of userRecord.
			db.collection('subjects').doc(id).get().then(function(sub){
				console.log(sub.data());
				data = userRecord.toJSON();


				db.collection("subjects/"+id+"/resources").get()
				.then(query=>{
					let json = query.docs.map(doc=>{
						let x = doc.data()
							x['_id']=doc.id;
							return x;
					});
					
					res.render("toast", {title: sub.data().name+" | ToastLearn", user: data, toast: sub.data(), resources: json});
				});
			});
		  });
	  })
	  .catch(error => {
		res.redirect("/login");
	  });
});

app.get('/profile', (req, res) => {
	
	const sessionCookie = req.cookies.__session || '';
	admin.auth().verifySessionCookie(
	  sessionCookie, true /** checkRevoked */)
	  .then((decodedClaims) => {
		var uid = decodedClaims.user_id;
		admin.auth().getUser(uid).then(function(userRecord) {
			res.redirect("/");
		});
	  })
	  .catch(error => {
		// Session cookie is unavailable or invalid. Force user to login.
		res.redirect('/login');
	  });
});

  app.get("/logout", (req, res) => {
	res.clearCookie("__session");
	res.redirect("/login");
  });


app.get('/searchQuery', function(req, res){
	var val = req.query.search;
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
		  res.cookie("__session", sessionCookie, options);
		  res.end(JSON.stringify({ status: "success" }));
		},
		(error) => {
		  res.status(401).send("UNAUTHORIZED REQUEST!");
		}
	  );
  });




exports.app = functions.https.onRequest(app);
