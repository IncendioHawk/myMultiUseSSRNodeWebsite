require("dotenv").config()
const express = require("express")
const router = express.Router()
const Todos = require("../models/todoSchema")
const User = require("../models/userSchema")
const Session = require("../models/sessionSchema")
const databaseEmpty = require("../databaseEmpty")

router.get("/dice", (req, res) => {
  res.render("dice")
})

router.get("/dudeneyNumbers", (req, res) => {
  res.render("dudeneyNumbers")
})

router.get("/todoList", (req, res) => {
  res.render("todoList")
})

router.post("/todoList", async (req, res) => {
  console.log("todoList")
  const session = await Session.findOne({ sessionId: req.cookies["_session_ID"] })
  const user = await User.findById(session.user)
  const todoList = await Todos.findOne({ user: user._id })
  switch (req.query.action) {
    case "create":
      console.log("create")
      todoList.todos.push({ todoCode: req.body.todo, todoId: req.body.todoId })
      await todoList.save()
      break
    case "delete":
      if (await databaseEmpty(Todos)) return console.log("delete failed")
      console.log("delete")
      await Todos.findOneAndUpdate(
        { user: user._id },
        { $pull: { todos: { todoId: req.body.todoId } } }
      )
      break
    case "read":
      if (await databaseEmpty(Todos)) return
      res.json(todoList.todos)
      break
  }
  console.log(await Todos.findOne({ user: user._id }))
})

module.exports = router
