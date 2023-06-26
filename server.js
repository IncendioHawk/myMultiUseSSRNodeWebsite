require("dotenv").config()
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const indexRouter = require("./routes/index")
const cookieParser = require("cookie-parser")
const Session = require("./models/sessionSchema")

const sessionTimeoutTime = 300000

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/", indexRouter)

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
)

const removeSession = setInterval(async () => {
  console.log("sessions", await Session.find())
  const sessions = await Session.find()
  if (sessions.length <= 0) return
  sessions.forEach(async (element) => {
    console.log("a", element)
    if (element.updatedAt > Date.now() - sessionTimeoutTime) return
    console.log(await Session.findByIdAndDelete(element._id))
  })
}, sessionTimeoutTime)
