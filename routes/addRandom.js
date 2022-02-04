const express = require("express");
const router = express.Router();
const axios = require("axios");

//mysql
var mysql = require("mysql");
const { json } = require("body-parser");

var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_DB,
});

con.connect();
router.get("/", (req,res) => {
  res.send("format : random/[number 1-200]?[auto]&[status(-1,0,1)]")
})
router.get("/:number", async (req, res) => {
  const props = {
    amount: req.params.number,
    auto: req.query.auto,
    status: req.query.status,
  };
  const so = ["0", "1", "-1"]
  const difficulties = ["beginer","intermediate","advanced"]

  if (!isNaN(props.amount) && parseInt(props.amount) <= 200) { //checks if amount is a number
    const words = await postReq(props);
    if (props.auto !== undefined) { //if auto is contained in search queries
      if (so.includes(props.status)) { //if props.status is one of the three so
        for (const x in words.data) /*for loop for the words fetched from the api */ con.query(`INSERT INTO data (title,user,difficulty,risk_level,vStatus) VALUES ('${words.data[x]}','${words.data[x]}','${difficulties[Math.floor(Math.random()*difficulties.length)]}','low','${req.query.status}')`); //add to MySQL db
        res.send("added to database with vStatus"); //sends webpage
      } else if (!so.includes(props.status) && props.status !== undefined) res.send("enter valid status code - -1, 0, 1"); /* if props.status isnt one of the three and props.status exists */
      else { //if so doesn't exist
        for (const x in words.data) con.query(`INSERT INTO data (title,user,difficulty,risk_level) VALUES ('${words.data[x]}','${words.data[x]}','${difficulties[Math.floor(Math.random()*difficulties.length)]}','low')`);
        res.send("added to database without vStatus");
      }
    } else if (props.auto === undefined) {
      let text = "";
      for (const x in words.data) {
        if (["0", "1", "-1"].includes(props.status)) {
          text += `INSERT INTO data (title,user,difficulty,risk_level,vStatus) VALUES ('${words.data[x]}','${words.data[x]}','${difficulties[Math.floor(Math.random()*difficulties.length)]}','low','${req.query.status}');`;
        } else {
          text += `INSERT INTO data (title,user,difficulty,risk_level) VALUES ('${words.data[x]}','${words.data[x]}','${difficulties[Math.floor(Math.random()*difficulties.length)]}','low');`;
        }
      }
      res.send(text);
    } else res.send("error");
  } else res.send("enter a valid number or number is to large (max 200)")
});

module.exports = router;

async function postReq(props) {
  return await axios.get(
    `https://random-word-api.herokuapp.com/word?number=${props.amount}`
  );
}
