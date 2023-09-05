const addTodoBtn = document.querySelector(".add-todo-btn")
const todoInput = document.querySelector(".todo-input")
const todosList = document.querySelector(".todos")
const todoLabel = document.querySelector(".todo-label")
const ids = []

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
  sessionStorage.removeItem(id)
}

async function loadTodos() {
  addTodoBtn.addEventListener("click", addTodo)
  const sessionStorageKeys = Object.keys(sessionStorage)
  if (sessionStorageKeys.length === 0) {
    await getTodosFromDatabase()
  }
  sessionStorageKeys.forEach((i) => {
    const todo = sessionStorage.getItem(i)
    todosList.innerHTML += todo
  })
}

async function getTodosFromDatabase() {}
