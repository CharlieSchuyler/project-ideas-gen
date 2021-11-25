const express = require("express");
const app = express();
const port = 3000;
//database
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var dataItem = new LinvoDB("items", {});

app.set("view engine", "ejs"); //set view engine
app.use(express.urlencoded({ extended: true }));  //allow routing
app.use(express.static('public')) //use static files
app.use('/static', express.static('public')) //use static files

//get
app.get("/", (req, res) => {
	dataItem.find({}, function (err, docs) {
		randomDoc = docs[randomNum(0, docs.length)]; //generates random number to display random doc
		res.render("home", { title: randomDoc.projectName, description: randomDoc.projectDescription, user: randomDoc.projectCreator });
	});
});

app.get("/create", (req, res) => res.render("new")); // renders create page

//post requests
//changes data when pressing space bar
app.post("/", (req,res) => {
	dataItem.find({}, function (err, docs) {
		randomDoc = docs[randomNum(0, docs.length)]; //generates random number to display random doc
		res.render("home", { title: randomDoc.projectName, description: randomDoc.projectDescription,  user: randomDoc.projectCreator });
	});
})
//adds item to database
app.post("/create", (req, res) => {
	dataItem.insert([{ projectName: req.body.title, projectDescription: req.body.description, projectCreator : req.body.user }], function (err, docs) {
		console.log("running if")
	});
	res.redirect("/") 

});

//on start
app.listen(port, () => { 
	console.log(`Example app listening at http://localhost:${port}`);
});


function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
