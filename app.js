const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const database = require("./database")
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

//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.150",
  user: "username",
  password: "password",
  database: "projectGenerator"
});

con.connect();

//

//get
app.get("/", async (req, res) => {
  con.query("SELECT * FROM verified",function(err,result){
    if (err) throw err;
    if (result.length === 0){
      res.render("home", { exists: false, title: null, user: null });
    }else{
      randomDoc = result[randomNum(0, result.length)]
      res.render("home", {exists: true, title: randomDoc.title, user: randomDoc.user })
    }
  })
});
app.get("/admin", async(req,res) => {
  con.query("SELECT * FROM unverified", function (err, result) {
    if (err) throw err;

    table = ""
    for(var x in result) {
      console.log(result[x])
      table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td></tr>";
    }
    res.render("admin", { table: table });
  });
})

app.get("/add-to-database", recaptcha.middleware.render, function (req, res) {
  var recaptchaVal = req.recaptcha;
  if (req.recaptcha === undefined) recaptchaVal = false;
  res.render("add_to_database", { captcha: res.recaptcha, error: recaptchaVal });
});

app.get("/database", function (req, res) {
  con.query("SELECT * FROM verified", function (err, result) {
    if (err) throw err;

    table = ""
    for(var x in result) {
      console.log(result[x])
      table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + "</td></tr>";
    }
    res.render("database", { table: table });
  });

});
//post requests
//adds item to database

app.post("/add-to-database", recaptcha.middleware.render, recaptcha.middleware.verify, function (req, res) {
  if (!req.recaptcha.error) {
    con.query(`INSERT INTO verified (title, user) VALUES ('${req.body.title}','${req.body.user}')`)
    res.redirect("/")
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
