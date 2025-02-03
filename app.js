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
app.get("/", (req, res) => res.render("index"));
app.get("/sign-up", (req, res) => res.render("singUpForm"));

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

// SERVER
app.listen(3000, () => console.log("app listening on port 3000!"));
