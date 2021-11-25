const express = require("express");
const app = express();
const port = 3000;
//database
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var dataItem = new LinvoDB("items", {});
//express
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
//

//express
app.get("/", (req, res) => {
	dataItem.find({}, function (err, docs) {
		randomDoc = docs[randomNum(0, docs.length)];
		res.render("home", { name: randomDoc.projectName, desc: randomDoc.projectDescription });
	});
});

app.get("/create", (req, res) => res.render("new"));
//

app.get("/search/:proName", (req, res) => {
	dataItem.find({ projectName: req.params.proName }, function (err, docs) {
		if (docs[0] === undefined) res.send("doesn't exist");
		console.log(docs);
		res.send(docs[0]);
	});
});
//
//post requests
app.post("/", (req, res) => {
	dataItem.insert([{ projectName: req.body.name, projectDescription: req.body.description }], function (err, docs) {
		console.log(docs[0]);
	});
	res.redirect("/");
});
//
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
