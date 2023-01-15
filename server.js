const express = require("express")
const app = express()
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
  const user = await User.findById(session.user)
  const username = user?.userName
  res.render("index", { username: username })
})

function checkLoggedIn(req, res, next) {
  req.isAuthenticated = async () => {
    const { _session_ID: sessionId } = req.cookies
    const session = await Session.findOne({ sessionId })
    return sessionId != null || session != null
  } // write auth function
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/login")
  }
}

app.listen(5000, () => console.log("Server listening on port 5000"))
