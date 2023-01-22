require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(process.env.database_url)
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const Session = require("./models/sessionSchema")
const User = require("./models/userSchema")
const cookieParser = require("cookie-parser")

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)

app.get("/", checkLoggedIn, async (req, res) => {
  const { _session_ID: sessionId } = req.cookies
  const session = await Session.findOne({ sessionId })
  if (session == null) return
  const user = await User.findById(session.user)
  const username = user?.userName
  res.render("index", { username: username })
})

app.post("/logout", checkLoggedIn, async (req, res) => {
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

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
)
