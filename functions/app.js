


// Retrieve Wikipedia Description Data
var request = require('request');

const functions     = require('firebase-functions');
const express       = require('express')
const admin         = require('firebase-admin');
const exphbs        = require("express-handlebars");
const algoliasearch = require("algoliasearch");
const {PythonShell} = require("python-shell");
const simpleYT = require("simpleyt");
const stripHtml = require("string-strip-html");
const wtf = require("wtf_wikipedia");
const bot = require("nodemw");
const usetube = require("usetube");


var wikiClient = new bot({
	protocol: "https",
	server: "en.wikipedia.org",
	path: "/w",
	debug: false

});

admin.initializeApp();
const db = admin.firestore();


const app = express();


let staticOptions = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false
}




//I don't care if this gets leaked. Who will use it anyways? I'm not paying a dime.
const APP_ID = functions.config().ALGOLIA_APP_ID;
const ADMIN_KEY = functions.config().ALGOLIA_ADMIN_KEY;
const YOUTUBE_KEY = functions.config().YOUTUBE_API_KEY;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("Subjects");


exports.addToIndex = functions.firestore.document("subjects/{subjectId}")
	.onCreate(snapshot => {
		const data = snapshot.data();
		const objectID = snapshot.id;

		return index.addObject({...data, objectID});
	});
exports.updateIndex = functions.firestore.document("subjects/{subjectId}")
	.onUpdate((change) => {
		const newData = change.after.data();
		const objectID = change.after.id;
		return index.saveObject({ ...newData, objectID});
	});
exports.deleteFromIndex = functions.firestore.document("subjects/{subjectId}")
	.onDelete(snapshot => index.deleteObject());



app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public", staticOptions));

//Home page
app.get("/", (req, res) => {
	db.collection("subjects").get()
		.then(query=>{
			let json = query.docs.map(doc=>{
				let x = doc.data()
					x['_id']=doc.id;
					return x;
			});

			res.render("index", {title: "All Toasts | ToastLearn", user: false, subjects: json});
			
	});
});


app.get("/toast", (req,res) => {
    res.redirect('/');
});

app.get('/toast/:id', function(req, res) {
	var id = req.params.id;
	db.collection('subjects').doc(id).get().then(function(sub){

		db.collection("subjects/"+id+"/resources").get()
		.then(query=>{
			let json = query.docs.map(doc=>{
				let x = doc.data()
					x['_id']=doc.id;
					return x;
			});
			
			res.render("toast", {title: sub.data().name+" | ToastLearn", toast: sub.data(), resources: json});
		});
	});
});

app.get("/create", function(req, res){
	res.render("create", {title: "Create a Toast"});
});

app.post("/createToast", function(req, res){
	var name = req.body.name;
	var tag = req.body.tag;

	console.log(name, tag);

	/*PythonShell.run("./add_to_database.py", {
		mode: "text",
		scriptPath: "./modules/",
		args: [name, tag]
	}, function(err, results){
		if(err){
			console.log(err);
			results = err;
		}
		console.log(results);
		res.send(results);
	});*/
	var numDocs = db.collection("num_topics").doc("0").get().then(query => {

		console.log(query.data().count);
		var numDocs = query.data().count;
		const data = {
			name: name,
			tag: tag
		}
		db.collection("subjects").doc(numDocs.toString()).set(data).then(doc => {

			db.collection("num_topics").doc("0").update({
				count: numDocs+1
			}).then(function(){
				simpleYT(tag + " " + name, {
					filter:"video"
				}).then(videos => {
					console.log(videos);
					var vids = videos;
					var index = 0;
					for(var x = 0; x < vids.length; x++){
						if(x > 20){
							break;
						}
						var d = {
							channel: vids[x].author.name,
							title: vids[x].title,
							type: "video",
							url: vids[x].uri
						}
						
						db.collection("subjects").doc(numDocs.toString()).collection("resources").doc(x.toString()).set(d);
						x++;
						index = x;
					}



					/*wikiClient.getArticle(name, function(err, data) {
						// error handling
						if (err) {
						  console.error(err);
						  return;
						}


						wikiClient.parse(data, name, function(e){
							console.log(e);
						})
						
					});*/


					

				})
				
			});

		});

	}, function(err){
		console.log(err);
		res.redirect("/");
	});

	
});







exports.app = functions.https.onRequest(app);
