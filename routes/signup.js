require("dotenv").config()
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(process.env.DATABASE_URL)
const User = require("../models/userSchema")
const Session = require("../models/sessionSchema")
const validator = require("email-validator")
const passwordValidator = require("../password-validator")
const databaseEmpty = require("../databaseEmpty")

router.get("/", checkNotLoggedIn, (req, res) => {
  res.render("signup", { error: false })
})

router.post("/", checkNotLoggedIn, validateInput, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  await User.create({
    userName: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  })
  res.redirect("/login")
})

async function validateInput(req, res, next) {
  const vars = {
    error: false,
    email: req.body.email,
    username: req.body.username,
  }
  let invalid = false
  if (!(await databaseEmpty())) {
    if (await User.findOne({ userName: req.body.username })) {
      invalid = true
      vars.usernameMessage = "This username already exists"
      vars.error = true
    }
  }
  if (await User.findOne({ email: req.body.email })) {
    invalid = true
    vars.emailMessage = "This email address is already taken"
    vars.error = true
  }
  const tests = passwordValidator.validate(req.body.password, { list: true })
  if (tests.length > 0) {
    invalid = true
    vars.passwordMessage = `Password must ${
      tests[0] === "min"
        ? "be at least 8 characters"
        : tests[0] === "uppercase" || tests[0] === "lowercase"
        ? "contain at least 1 lowercase and 1 uppercase character"
        : tests[0] === "digits"
        ? "contain at least 1 digit"
        : "not contain any spaces"
    }`
    vars.error = true
  }
  if (req.body.password !== req.body.confirmPassword) {
    invalid = true
    vars.passwordConfirmMessage = "Passwords do not match"
    vars.error = true
  }
  if (!validator.validate(req.body.email)) {
    invalid = true
    vars.emailMessage = "Please enter a valid email address"
    vars.error = true
  }
  invalid ? res.render("signup", vars) : next()
}

async function checkNotLoggedIn(req, res, next) {
  if ((await databaseEmpty(Session)) || (await databaseEmpty(User)))
    return next()
  const session = await Session.findOne({ sessionId: req.cookies?._session_ID })
  if (session == null) return next()
  const user = await User.findById(session.user)
  if (user != null) return res.redirect("/" /*, { username: user.userName }*/)
  next()
}

module.exports = router
