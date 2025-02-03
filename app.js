const express = require("express");
const app = express();
const { Pool } = require("pg");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const SingUpRouter = require("./routes/SingUpRouter");
const path = require("node:path");


// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Passport Configuration
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", SingUpRouter);
const PORT = 3000;
app.listen(PORT, () => console.log(`This server is listening on port ${PORT}`));
