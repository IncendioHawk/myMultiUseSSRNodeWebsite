const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://127.0.0.1/mywebsite")
const bcrypt = require("bcrypt")
const User = require("../models/userSchema")
const Session = require("../models/sessionSchema")
const crypto = require("crypto")

router.get("/", checkNotLoggedIn, async (req, res) => {
  res.render("login", { error: false })
})

router.post("/", checkNotLoggedIn, authenticateUser, async (req, res) => {
  const user = await User.findOne({ userName: req.body.username })
  if (user == null) return res.sendStatus(401)

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
    return res.status(401).render("login", {
      username: req.body.username,
      usernameMessage: "User does not exist",
      error: true,
    })
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).render("login", {
      username: req.body.username,
      passwordMessage: "Password is incorrect",
      error: true,
    })
  }
  next()
}

async function checkNotLoggedIn(req, res, next) {
  if (await databaseEmpty(Session)) next()
  const session = await Session.findOne({ sessionId: req.cookies?._session_ID })
  const user = await User.findById(session.user)
  console.log(user)
  if (user != null) res.redirect("/", { username: user.userName })
  next()
}

async function databaseEmpty(schema) {
  const length = await schema.countDocuments()
  return length === 0
}

module.exports = router
