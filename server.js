const express = require("express")
const app = express()
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.use("/signup", signupRouter)
app.use("/login", loginRouter)

app.get("/", checkLoggedIn, (req, res) => {
  res.render("index")
})

function checkLoggedIn(req, res, next) {
  req.isAuthenticated = () => true // write auth function
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/login")
  }
}

app.listen(5000, () => console.log("Server listening on port 5000"))
