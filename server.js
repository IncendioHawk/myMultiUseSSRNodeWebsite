require("dotenv").config()
const express = require("express")
const app = express()
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const indexRouter = require("./routes/index")
const cookieParser = require("cookie-parser")
const Session = require("./models/sessionSchema")

const sessionTimeoutTime = 10000
// const sessionTimeoutTime = 300000

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/", indexRouter)

app.get("/test", (req, res) => {
  res.render("logout-success", {
    message: `You have been inactive for ${(sessionTimeoutTime / 60000).toFixed(
      3
    )} minutes. Please sign in again to keep using this service.`,
  })
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
    if (session == null)
      return res.render("logout-success", { message: "Session not found, please log in" })
    if (session.updatedAt > Date.now() - sessionTimeoutTime) return
    res.clearCookie("_session_ID")
    res.render("logout-success", {
      message: `You have been inactive for ${(sessionTimeoutTime / 60000).toFixed(
        3
      )} minutes. Please sign in again to keep using this service.`,
    }) //fix this not rendering the page
    console.log(await Session.findOneAndDelete({ sessionId: session.sessionId }))
  }
})

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
)

// const removeSession = setInterval(async () => {
//   console.log("sessions", await Session.find())
//   const sessions = await Session.find()
//   if (sessions.length <= 0) return
//   sessions.forEach(async (element) => {
//     console.log("a", element)
//     if (element.updatedAt > Date.now() - sessionTimeoutTime) return
//     console.log(await Session.findByIdAndDelete(element._id))
//   })
// }, sessionTimeoutTime)
