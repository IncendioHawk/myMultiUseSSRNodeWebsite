require("dotenv").config()
const express = require("express")
const router = express.Router()

router.get("/dice", (req, res) => {
  res.render("dice")
})

module.exports = router
