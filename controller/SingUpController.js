const db = require('../db/queries')

async function GetUsers(req,res,next) {
   try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    await db.GetUsers(username, password);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports={
  GetUsers
}