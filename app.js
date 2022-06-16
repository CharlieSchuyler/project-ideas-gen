require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3030;

//routes
const adminRouter = require("./routes/admin");
const randomRouter = require("./routes/addRandom");

app.set("view engine", "ejs"); //set view engine
app.use(express.static("public")); //use static files
app.use("/static", express.static("public")); //use static files
app.use(express.urlencoded({ extended: true })); //allow routing
app.use(bodyParser.json());
app.use("/admin", adminRouter);
app.use("/random", randomRouter);

// recaptcha`
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const { json } = require("body-parser");

const recaptcha = new Recaptcha("6LfgonEdAAAAAL89_Mmoq3wg4g0CB1rM43FQNZzM", "6LfgonEdAAAAAJy5KJm2G9_O6kLTN_LwdEFniPOL");

//words
const words = require("./misc/words");

//mysql
var mysql = require("mysql");

var con = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_DB,
});

con.connect();

//

//get

app.get("/", function (req, res) {
	con.query("SELECT * FROM data WHERE vStatus='1'", function (err, result) {
		if (err) throw err;
		const itemLists = [];

		for (let i = 0; i < 40; i++) {
			if (i > result.length || i > 40) break;
			const index = randomNum(0, result.length);
			itemLists.push(result[index]);
		}

		if (result.length === 0) res.render("home", { exists: false, items: itemLists });
		else {
			index = result[randomNum(0, result.length)];
			res.render("home", { exists: true, items: itemLists });
		}
	});
});

app.get("/submit", recaptcha.middleware.renderWith({ theme: "dark" }), function (req, res) {
	res.render("submit", { captcha: res.recaptcha, error: reCaptchaErrRes(req.query.error) });
});

app.post("/submit", recaptcha.middleware.render, recaptcha.middleware.verify, function (req, res) {
	if (!req.recaptcha.error) {
		const risk_level = () => {
			if (!words.list.includes(req.body.title) && !words.list.includes(req.body.user)) {
				return "low";
			} else if (words.list.includes(req.body.title) || words.list.includes(req.body.user)) {
				return "high";
			}
		};
		con.query(`INSERT INTO data (title,user,difficulty,risk_level) VALUES ('${req.body.title}','${req.body.user}','${req.body.difficulty}','${risk_level()}')`);
		res.redirect("/");
	} else if (req.recaptcha.error) {
		var recaptchaVal = req.recaptcha;
		if (req.recaptcha.error === undefined) recaptchaVal = false;
		//invalid-input-response
		res.redirect(`/submit?error=${req.recaptcha.error}`);
		// res.render("/submit", { captcha: res.recaptcha, error: { message: "Please complete the reCaptcha", error: recaptchaVal.error } });
	}
});

const reCaptchaErrRes = (err) => {
	if (err === undefined) {
		return "ok";
	} else if (err === "invalid-input-response") {
		return { message: "please complete the reCaptcha" };
	} else {
		return { message: `unknown error` };
	}
};

//on start
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
