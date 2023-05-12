//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res) {
  res.render("home");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.get("/register", function(req,res) {
  res.render("register");
});

app.post("/register", function(req,res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    try {
      newUser.save();
      res.render("secrets");
    } catch {
      console.log("Error");
    }
  });
});

app.post("/login",async function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  const userExist = await User.findOne({email: username}).exec();

  if (userExist) {
    bcrypt.compare(password, userExist.password, function(err, result) {
       if (result === true) {
         res.render("secrets");
       } else {
         console.log("Error");
       }
    });
  }
  else {
    console.log("Error");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
