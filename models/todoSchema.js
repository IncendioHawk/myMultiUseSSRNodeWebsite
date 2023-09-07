const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
  todos: [
    {
      todoCode: {
        type: String,
        required: true,
      },
      todoId: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
})

module.exports = mongoose.model("Todos", todoSchema)
