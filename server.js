require("dotenv").config()
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const indexRouter = require("./routes/index")
const cookieParser = require("cookie-parser")

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/", indexRouter)

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
)
