const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://127.0.0.1/mywebsite")
const bcrypt = require("bcrypt")
const User = require("../models/userSchema")

router.get("/", (req, res) => {
  res.render("login")
})

module.exports = router
