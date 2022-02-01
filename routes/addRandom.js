const express = require("express")
const router = express.Router()
const axios = require('axios');


//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.150",
  user: "username",
  password: "password",
  database: "projectGenerator"
});

con.connect();
router.get("/", async (req, res) => {

  const data = await postReq();
  let text = ""
  for (const x in data.data) {
    // con.query(`INSERT INTO data (title,user,difficulty,risk_level) VALUES ('${data.data[x]}','${data.data[x]}','${data.data[x]}','${data.data[x]}')`)
    text += `\nINSERT INTO data (title,user,difficulty,risk_level) VALUES ('${data.data[x]}','${data.data[x]}','advanced','low');\n`
  }
  res.send(text)
})

module.exports = router


async function postReq() {
  return await axios.get('https://random-word-api.herokuapp.com/word?number=200');
}