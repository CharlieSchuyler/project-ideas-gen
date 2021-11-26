const { promiseImpl } = require("ejs");
const express = require("express");
const app = express();
const port = 3000;
//database
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var dataItem = new LinvoDB("items", {});

app.set("view engine", "ejs"); //set view engine
app.use(express.urlencoded({ extended: true })); //allow routing
app.use(express.static("public")); //use static files
app.use("/static", express.static("public")); //use static files

/*
	get requests
*/
app.get("/", (req, res) => {
	dataItem.find({}, function (err, docs) {
		randomDoc = docs[randomNum(0, docs.length)]; //generates random number to display random doc
		res.render("home", { title: randomDoc.projectName, description: randomDoc.projectDescription, user: randomDoc.projectCreator });
	});
});

app.get("/create", (req, res) => res.render("new")); // render create page

app.get("/find", (req, res) => {
	dataItem.find({}, function (err, docs) {
		res.render("find", { docs: JSON.stringify(docs[0]) });
	});
});

/*
	post requests
*/
app.post("/create", async (req, res) => {
	//when form is submitted
	dataItem.find({ projectName: req.body.title }, (err, docs) => {
		//finds project
		if (docs.length >= 1) res.send(`'${req.body.title}' already exists`);
		// if docs.length >= project name entered already exists
		else {
			// else adds data to the database
			dataItem.insert([{ projectName: req.body.title, projectDescription: req.body.description, projectCreator: req.body.user }], function (err, docs) {
				console.log(`inserted data with the name of - ${docs[0].projectName}`);
			});
			res.send(`successfully added '${req.body.title}' to the database`);
		}
	});
});

//on start
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

//generates random number to be used for finding random documents
function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
