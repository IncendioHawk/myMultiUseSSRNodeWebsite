const addTodoBtn = document.querySelector(".add-todo-btn")
const todoInput = document.querySelector(".todo-input")
const todosList = document.querySelector(".todos")
const todoLabel = document.querySelector(".todo-label")
const ids = []
const urlBase = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}`

window.addEventListener("load", loadTodos)

function addTodo(e) {
  e.preventDefault()
  todoInput.setAttribute("focus", false)
  if (todoInput.value === "" || todoInput.value == null) return alert("Please Enter a Todo")
  const data = todoInput.value
  todoInput.value = ""
  const todo = createTodo(data)
  todosList.appendChild(todo)
}

function createTodo(data) {
  const id = generateUniqueId(Math.random())
  const todo = document.createElement("li")
  todo.className = "todo"
  const deleteTodo = document.createElement("button")
  deleteTodo.className = "delete-todo-btn"
  deleteTodo.textContent = "X"
  const todoValue = document.createElement("span")
  todoValue.className = "todo-value"
  todoValue.textContent = data
  todo.dataset.id = id
  deleteTodo.addEventListener("click", () => {
    deleteTodoFunction(id)
  })
  todo.appendChild(todoValue)
  todo.appendChild(deleteTodo)
  fetch(`${urlBase}/projects/todoList?action=create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: todo.outerHTML, todoId: id }),
  })
  sessionStorage.setItem(id, todo.outerHTML)
  return todo
}

function generateUniqueId(id) {
  let x
  ids.includes(id) ? generateUniqueId(Math.random()) : (x = id)
  return x
}

function deleteTodoFunction(id) {
  const todo = document.querySelector(`[data-id="${id}"]`)
  todosList.removeChild(todo)
  fetch(`${urlBase}/projects/todoList?action=delete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todoId: id }),
  })
  sessionStorage.removeItem(id)
}

async function loadTodos() {
  addTodoBtn.addEventListener("click", addTodo)
  const sessionStorageKeys = Object.keys(sessionStorage)
  if (sessionStorageKeys.length === 0) {
    const todos = await getTodosFromDatabase()
    todos.forEach((todo) => {
      console.log(todo)
      sessionStorage.setItem(todo.todoId, todo.todoCode)
      loadTodos()
    })
    return
  }
  sessionStorageKeys.forEach((i) => {
    const todo = sessionStorage.getItem(i)
    todosList.innerHTML += todo
    console.log(todo)
    console.log(i)
  })
  document.querySelectorAll(`[data-id]`).forEach((i) => {
    i.addEventListener("click", () => {
      deleteTodoFunction(i.dataset.id)
    })
  })
}

async function getTodosFromDatabase() {
  const res = await fetch(`${urlBase}/projects/todoList?action=read`, {
    method: "POST",
    credentials: "include",
  })
  const todos = await res.json()
  return todos
}
