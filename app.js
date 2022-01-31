const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;


//routes
const adminRouter = require("./routes/admin")

app.set("view engine", "ejs"); //set view engine
app.use(express.static("public")); //use static files
app.use("/static", express.static("public")); //use static files
app.use(express.urlencoded({ extended: true })); //allow routing
app.use(bodyParser.json());
app.use('/admin', adminRouter)



// recaptcha`
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const { json } = require("body-parser");

const recaptcha = new Recaptcha("6LfgonEdAAAAAL89_Mmoq3wg4g0CB1rM43FQNZzM", "6LfgonEdAAAAAJy5KJm2G9_O6kLTN_LwdEFniPOL");

//words
const words = require("./misc/words")

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

app.get("/", function (req, res) {
  con.query("SELECT * FROM data WHERE ACCEPTED='1'", function (err, result) {
    if (err) throw err;
    if (result.length === 0) res.render("home", { exists: false, title: null, difficulty: null, user: null });
    else {
      index = result[randomNum(0, result.length)]
      res.render("home", { exists: true, title: index.title, difficulty: index.difficulty, author: index.user })
    }
  })
})


app.get("/submit", recaptcha.middleware.renderWith({ theme: "dark" }), function (req, res) {
  var recaptchaVal = req.recaptcha;
  if (req.recaptcha === undefined) recaptchaVal = false;
  res.render("submit", { captcha: res.recaptcha, error: recaptchaVal });
});




app.post("/submit", recaptcha.middleware.render, recaptcha.middleware.verify, function (req, res) {
  console.log(req.body)
  if (!req.recaptcha.error) {
    const risk_level = () => {
      if (!words.list.includes(req.body.title) && !words.list.includes(req.body.user)) {
        return "low"
      } else if (words.list.includes(req.body.title) || words.list.includes(req.body.user)) {
        return "high"
      }
    }
    con.query(`INSERT INTO data (title,user,difficulty,risk_level) VALUES ('${req.body.title}','${req.body.user}','${req.body.difficulty}','${risk_level()}')`)
    res.redirect("/")
  }
  else {
    var recaptchaVal = req.recaptcha;
    if (req.recaptcha === undefined) recaptchaVal = false;
    //invalid-input-response
    res.render("/submit", { captcha: res.recaptcha, error: { message: "Please complete the reCaptcha", error: recaptchaVal.error } });
  }

});


//on start
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
