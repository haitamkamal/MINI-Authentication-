/////// app.js
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

//DATABASE
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "singup",
  password: "123",
  port: 5432,
});

//Views
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//PASSPORT
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//ROUTES
app.get("/",(req,res)=>{
  res.render("index",{user :req.user});
})
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
app.get("/sign-up", (req, res) => res.render("singUpForm"));
app.get("/log-in",(req,res)=>{
  res.render("logInForm");
})
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect: "/not-defined"
  })
)
app.get("/log-out",(req,res,next)=>{
  req.logOut((err)=>{
    if (err){
      return next (err);
    }
    res.redirect("/");
  })
})
app.get("/not-defined",(req,res)=>{
  res.render("NotDefinedUser")
})
app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users_form (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
});
app.get("*",(req,res)=>{
  res.render("error");
})
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//PASSPORT ....
//takes a username and password, tries to find the user in our DB
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users_form WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
//They control how user information is stored in the session and retrieved from the database.
passport.serializeUser((user,done)=>{
  done(null,user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users_form WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});


// SERVER
app.listen(3000, () => console.log("app listening on port 3000!"));
