const pool = require("./pool");


async function GetUsers(username,password) {
  await pool.query("INSERT INTO users_form (username, password) VALUES ($1,$2)",[
  username,password,
])};
module.exports={
  GetUsers
}
