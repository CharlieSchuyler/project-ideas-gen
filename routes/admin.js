const express = require("express")
const router = express.Router()


//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.150",
  user: "username",
  password: "password",
  database: "projectGenerator"
});



con.connect();

router.get("/pending", (req, res) => {
  con.query("SELECT * FROM data WHERE accepted='0' AND rejected='0'", function (err, result) {
    if (err) throw err;
    table = ""
    for (var x in result) {
      if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
      else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
    }
    res.render("admin/admin", { table: table, script: "pending" });

  })
})
router.get("/accepted", (req, res) => {
  con.query("SELECT * FROM data WHERE accepted='1' AND rejected='0'", function (err, result) {
    if (err) throw err;
    table = ""
    for (var x in result) {
      if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
      else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='reject'><img src='/images/cross.svg'/></td></tr>";
    }
    res.render("admin/admin", { table: table, script: "accepted" });

  })
})
router.get("/rejected", (req, res) => {
  con.query("SELECT * FROM data WHERE accepted='0' AND rejected='1'", function (err, result) {
    if (err) throw err;
    table = ""
    for (var x in result) {
      if (result[x]["risk_level"] === "high") table += "<tr class='warning'><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td></tr>";
      else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td data-label='Difficulty'>" + result[x]["difficulty"] + " </td><td class='accept'><img src='/images/check.svg'/></td></tr>";
    }
    res.render("admin/admin", { table: table, script: "rejected" });
  })
})



router.post("/", function (req, res) {
  const origin = req.body.origin;
  const id = req.body.data.id;
  if (origin === "accepted") {
    con.query(`UPDATE data SET accepted='0', rejected='1' WHERE id='${id}'`)
  } else if (origin === "rejected") {
    con.query(`UPDATE data SET rejected='0', accepted='1' WHERE id='${id}'`)
  } else if (origin === "pending") {
    if (req.body.action) {
      con.query(`UPDATE data SET accepted='1' WHERE id='${id}'`)
    } else if (!req.body.action) {
      con.query(`UPDATE data SET rejected='1' WHERE id='${id}'`)
    }
  }
})

module.exports = router


// app.post("/admin", function (req, res) {
//   if (req.body.action) {
//     con.query(`INSERT INTO verified (title, user) VALUES ('${req.body.data.title}','${req.body.data.user}')`)
//     con.query(`DELETE FROM unverified WHERE id = '${req.body.data.id}'`)
//   } else if (!req.body.action) {
//     con.query(`INSERT INTO rejected (title, user) VALUES ('${req.body.data.title}','${req.body.data.user}')`)
//     con.query(`DELETE FROM unverified WHERE id = '${req.body.data.id}'`)
//   }
// })

// app.get("/admin", async (req, res) => {
//   res.render("admin", { table: "" })
//   con.query("SELECT * FROM unverified", function (err, result) {
//     if (err) throw err;
//     table = ""
//     for (var x in result) {
//       //! better way to do this
//       if (words.list.includes(result[x]["title"]) || words.list.includes(result[x]["user"])) table += "<tr class='warning'><td data-label='id'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + "</td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'>x</td></tr>";
//       else table += "<tr><td data-label='Index'>" + result[x]["id"] + "</td><td data-label='Project Name'>" + result[x]["title"] + "</td><td data-label='Project Author'>" + result[x]["user"] + " </td><td class='accept'><img src='/images/check.svg'/></td><td class='reject'>x</td></tr>";
//     }
//     res.render("admin", { table: table });
//   });
// })