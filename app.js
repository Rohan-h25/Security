//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  try {
    newUser.save();
    res.render("secrets");
  } catch {
    console.log("Error");
  }
});

app.post("/login",async function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  const userExist = await User.findOne({email: username}).exec();

  console.log(userExist);

  if (userExist) {
    const passwordExist = await User.findOne({password: password}).exec();
    if (passwordExist) {
      res.render("secrets");
    } else {
      console.log("Error");
    }
  }
  else {
    console.log("Error");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
