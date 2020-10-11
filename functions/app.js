require("dotenv").config();

const functions     = require('firebase-functions');
const express       = require('express')
const admin         = require('firebase-admin');
const algoliasearch = require("algoliasearch");
const request = require("request");
const simpleYT = require("simpleyt");
const bot = require("nodemw");


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
const APP_ID = process.env.ALGOLIA_APP_ID; //functions.config().algolia.app_id;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;  //functions.config().algolia.admin_key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("Subjects");


exports.addToIndex = functions.firestore.document("subjects/{subjectId}")
	.onCreate(snapshot => {
		const data = snapshot.data();
		const objectID = snapshot.id;

		return index.saveObject({...data, objectID});
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
		if(sub.data() == null){
			res.redirect("/");
			return;
		}


		db.collection("subjects/"+id+"/resources").get()
		.then(query=>{
			let json = query.docs.map(doc=>{
				let x = doc.data()
					x['_id']=doc.id;
					return x;
			});
			
			res.render("toast", {title: sub.data().name+" | ToastLearn", toast: sub.data(), resources: json});
		});
	}).catch(function(err){
		res.redirect("/");
	});
});

app.get("/create", function(req, res){
	res.render("create", {title: "Create a Toast | ToastLearn"});
});

app.post("/createToast", function(req, res){
	if(!req.body){
		res.send(false);
		return;
	}
	var name = req.body.name;
	var tag = req.body.tag;


	if((name == "") || (tag == "")){
		res.send(false);
		return;
	}

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
					}
					var topic = name;

					var url = `https://en.wikipedia.org/w/api.php?action=query&prop=extract&list=search&srsearch=${topic}&format=json`;
					//console.log(url);
					request(url, function (err, response, body) {
						if(err){
							var error = "cannot connect to the server";
							//console.log(error);

							return {}
						} else {
							const data = JSON.parse(body)

							// get the first page as it is the most relevant
							var page = data.query.search[0]

							var page_url = `https://en.wikipedia.org/wiki/${page.title}`;

							//console.log('PAGE:', article)
							console.log(page.title)

							// this is the url to request information about the page to be used
							var curr_page_url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${page.title}&exchars=750&explaintext=1`;
							request(curr_page_url, function(err, response,body2) {
								if(err){
									var error = "cannot connect to the server";
									console.log(error);
						
								} else {
										const data = JSON.parse(body2)

										// theres only one item in this for loop so snippet will have the description
										var snippet = ''
										for (id in data.query.pages){
											snippet = data.query.pages[id].extract
										}

										// Uncomment below and Add to database here
										var article = {
											"title" : page.title,
											"snippet" : snippet,
											"url " : page_url,
											"type" : "wiki"
										}
										db.collection("subjects").doc(numDocs.toString()).collection("resources").doc("wiki").set(article).then(function(){
											res.send(numDocs.toString());
										});
								}
							});
						}
					});
				});
			});
		});
	});
});







exports.app = functions.https.onRequest(app);
