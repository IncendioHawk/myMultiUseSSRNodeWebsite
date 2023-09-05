require("dotenv").config()
const express = require("express")
const router = express.Router()

router.get("/dice", (req, res) => {
  res.render("dice")
})

router.get("/todoList", (req, res) => {
  res.render("todoList")
})

router.get("/dudeneyNumbers", (req, res) => {
  res.render("dudeneyNumbers")
})

module.exports = router
