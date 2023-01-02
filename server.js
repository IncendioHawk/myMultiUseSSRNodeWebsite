const express = require("express")
const app = express()
const User = require("./models/userSchema")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost/mywebsite")

app.set("view engine", "ejs")

app.get("/", checkLoggedIn, (req, res) => {
  res.render("index", {})
})

app.listen(5000, () => console.log("Server listening on port 5000"))

function checkLoggedIn(req, res, next) {
  req.isAuthenticated = () => true
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/login")
  }
}
