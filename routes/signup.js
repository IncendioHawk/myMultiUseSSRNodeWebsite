require("dotenv").config()
const express = require("express")
const router = express.Router()
const cors = require("cors")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(process.env.database_url)
const User = require("../models/userSchema")
const validator = require("email-validator")
const passwordValidator = require("../password-validator")

router.use(cors({ origin: process.env.site_url, credentials: true }))

router.get("/", (req, res) => {
  res.render("signup", { error: false })
})

router.post("/", validateInput, async (req, res) => {
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

async function databaseEmpty() {
  const length = await User.countDocuments()
  return length === 0
}

module.exports = router
