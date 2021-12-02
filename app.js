const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
//database
const LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
const dataItem = new LinvoDB("items", {});

app.set("view engine", "ejs"); //set view engine
app.use(express.static("public")); //use static files
app.use("/static", express.static("public")); //use static files
app.use(express.urlencoded({ extended: true })); //allow routing
app.use(bodyParser.json());

// recaptcha`
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const { json } = require("body-parser");
const recaptcha = new Recaptcha("6LfgonEdAAAAAL89_Mmoq3wg4g0CB1rM43FQNZzM", "6LfgonEdAAAAAJy5KJm2G9_O6kLTN_LwdEFniPOL");
//get
app.get("/", async (req, res) => {
  dataItem.find({}, function (err, docs) {
    if (docs.length !== 0) {
      randomDoc = docs[randomNum(0, docs.length)]; //generates random number to display random doc
      res.render("home", { exists: true, title: randomDoc.projectName, user: randomDoc.projectCreator });
    } else if (docs.length === 0) {
      res.render("home", { exists: false, title: null, user: null });
    }
  });
});

app.get("/add-to-database", recaptcha.middleware.render, function (req, res) {
  var recaptchaVal = req.recaptcha;
  if (req.recaptcha === undefined) recaptchaVal = false;
  res.render("add_to_database", { captcha: res.recaptcha, error: recaptchaVal });
});

app.get("/database", function (req, res) {
  dataItem.find({}, function (err, docs) {
    let obj = { 1: "one", 2: "two", 3: "three" };
    let result = "";
    for (let num in docs) {
      result += "<tr><td data-label='Index'>" + num + "</td><td data-label='Project Name'>" + docs[num].projectName + "</td><td data-label='Project Author'>" + docs[num].projectCreator + "</td></tr>";
    }
    res.render("database", { table: result });
  });
});
//post requests
//adds item to database

app.post("/add-to-database", recaptcha.middleware.render, recaptcha.middleware.verify, function (req, res) {
  if (!req.recaptcha.error) {
    dataItem.find({ projectName: req.body.title }, function (err, docs) {
      if (docs.length === 0) {
        dataItem.insert([{ projectName: req.body.title, projectCreator: req.body.user }]);
        console.log(`${req.body.title} has been created!`);
        res.redirect("/");
      } else res.send(`${req.body.title} already exists!`);
    });
  } else {
    var recaptchaVal = req.recaptcha;
    if (req.recaptcha === undefined) recaptchaVal = false;
    //invalid-input-response
    res.render("add_to_database", { captcha: res.recaptcha, error: { message: "Please complete the reCaptcha", error: recaptchaVal.error } });
  }
});

//on start
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
