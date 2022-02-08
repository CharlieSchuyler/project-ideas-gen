const express = require("express");
const router = express.Router();

//mysql
var mysql = require("mysql");

var con = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_DB,
});

con.connect();
router.get("/", (req, res) => {
	res.render("admin/admin", { table: "", script: "home" });
});
router.get("/pending", (req, res) => {
	con.query("SELECT * FROM data WHERE vStatus='0'", function (err, result) {
		if (err) throw err;
		table = "";
		for (var x in result) {
			if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
			else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
		}
		res.render("admin/admin", { table: table, script: "pending" });
	});
});
router.get("/accepted", (req, res) => {
	con.query("SELECT * FROM data WHERE vStatus='1'", function (err, result) {
		if (err) throw err;
		table = "";
		for (var x in result) {
			if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
			else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
		}
		res.render("admin/admin", { table: table, script: "accepted" });
	});
});
router.get("/rejected", (req, res) => {
	con.query("SELECT * FROM data WHERE vStatus='-1'", function (err, result) {
		if (err) throw err;
		table = "";
		for (var x in result) {
			if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td></tr>";
			else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td></tr>";
		}
		res.render("admin/admin", { table: table, script: "rejected" });
	});
});

router.post("/", function (req, res) {
	const origin = req.body.origin;
	const id = req.body.data.id;
	if (origin === "accepted") {
		con.query(`UPDATE data SET accepted='0', rejected='1' WHERE id='${id}'`);
	} else if (origin === "rejected") {
		con.query(`UPDATE data SET rejected='0', accepted='1' WHERE id='${id}'`);
	} else if (origin === "pending") {
		if (req.body.action) {
			con.query(`UPDATE data SET accepted='1' WHERE id='${id}'`);
		} else if (!req.body.action) {
			con.query(`UPDATE data SET rejected='1' WHERE id='${id}'`);
		}
	}
});

module.exports = router;
