require("dotenv").config()
const express = require("express")
const app = express()
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const projectsRouter = require("./routes/projects")
const indexRouter = require("./routes/index")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const User = require("./models/userSchema")
const Session = require("./models/sessionSchema")

const sessionTimeoutTime = 300000

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/projects", projectsRouter)
app.use("/", indexRouter)

app.get("/confirmDelete", (req, res) => {
  res.render("confirm-delete")
})

app.post("/delete", authenticateUser, async (req, res) => {
  await User.findOneAndDelete({ userName: req.body.username })
  res.clearCookie("_session_ID")
  res.render("delete-success")
  const session = await Session.findOne({ sessionId: req.cookies["_session_ID"] })
  await Session.findOneAndDelete({ sessionId: session.sessionId })
  if (session == null) return
})

app.get("/interactedWithPage", async (req, res) => {
  if (req.query.boolean === "true") {
    await Session.findOneAndUpdate(
      { sessionId: req.cookies["_session_ID"] },
      { updatedAt: Date.now() }
    )
  }
  if (req.query.boolean === "false") {
    const session = await Session.findOne({ sessionId: req.cookies["_session_ID"] })
    if (session == null) return res.send({ message: "Session not found, please log in" })
    if (session.updatedAt > Date.now() - sessionTimeoutTime) return
    res.clearCookie("_session_ID")
    res.send({
      message: `You have been inactive for ${(sessionTimeoutTime / 60000).toFixed(
        3
      )} minutes. Please sign in again to keep using this service.`,
    })
    console.log(await Session.findOneAndDelete({ sessionId: session.sessionId }))
  }
})

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
)

async function authenticateUser(req, res, next) {
  const user = await User.findOne({ userName: req.body.username })
  if (user == null) {
    return res.render("confirm-delete", {
      username: req.body.username,
      usernameMessage: `User '${req.body.username}' does not exist`,
      error: true,
    })
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.render("confirm-delete", {
      username: req.body.username,
      passwordMessage: "Password is incorrect",
      error: true,
    })
  }
  next()
}
