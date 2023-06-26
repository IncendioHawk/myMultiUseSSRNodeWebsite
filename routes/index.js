require("dotenv").config()
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(process.env.DATABASE_URL)
const Session = require("../models/sessionSchema")
const User = require("../models/userSchema")
const databaseEmpty = require("../databaseEmpty")

router.get("/", checkLoggedIn, async (req, res) => {
  const { _session_ID: sessionId } = req.cookies
  const session = await Session.findOne({ sessionId })
  if (session == null) return
  const user = await User.findById(session.user)
  const username = user?.userName
  res.render("index", { username: username })
})

router.post("/logout", checkLoggedIn, async (req, res) => {
  try {
    await Session.findOneAndDelete({ sessionId: req.cookies?._session_ID })
    res.clearCookie("_session_ID")
    res.render("logout-success")
  } catch {
    res.redirect("/")
  }
})

async function checkLoggedIn(req, res, next) {
  req.isAuthenticated = async () => {
    if (await databaseEmpty(Session)) return false
    const sessionId = req.cookies._session_ID
    const session = await Session.findOne({ sessionId })
    return sessionId != null || session != null
  }
  if (await req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/login")
  }
}

module.exports = router
