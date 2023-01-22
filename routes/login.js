require("dotenv").config()
const cors = require("cors")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(process.env.database_url)
const bcrypt = require("bcrypt")
const User = require("../models/userSchema")
const Session = require("../models/sessionSchema")
const crypto = require("crypto")

router.use(cors({ origin: process.env.site_url, credentials: true }))

router.get("/", checkNotLoggedIn, async (req, res) => {
  res.render("login", { error: false })
})

router.post("/", checkNotLoggedIn, authenticateUser, async (req, res) => {
  const user = await User.findOne({ userName: req.body.username })
  if (user == null) return res.redirect("/login")
  const sessionId = crypto.randomUUID()
  await Session.create({ sessionId: sessionId, user })
  res
    .cookie("_session_ID", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .redirect("/")
})

async function authenticateUser(req, res, next) {
  const user = await User.findOne({ userName: req.body.username })
  if (user == null) {
    return res.render("login", {
      username: req.body.username,
      usernameMessage: "User does not exist",
      error: true,
    })
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.render("login", {
      username: req.body.username,
      passwordMessage: "Password is incorrect",
      error: true,
    })
  }
  next()
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

async function databaseEmpty(schema) {
  const length = await schema.countDocuments()
  return length === 0
}

module.exports = router
