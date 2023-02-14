const url = "http://localhost:4730/todos";
const btnAdd = document.querySelector("#add-todo");
const btnRemove = document.querySelector("#remove-done-todo");
const newTodoInput = document.querySelector("input");
const todoList = document.querySelector("#todo-list");

let todos = [];

//Get Objects from backend
function getObjectsFromBackend() {
  fetch(url)
    .then((res) => res.json())
    .then((todosFromAPI) => {
      todos = todosFromAPI;
      renderTodos();
    });
}
getObjectsFromBackend();

//Render Toods
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const newLi = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.value = todo.id;

    checkbox.addEventListener("change", (e) => {
      todo.done = e.target.checked;
      updateTodo(todo);
    });

    newLi.appendChild(checkbox);
    const text = document.createTextNode(todo.description);
    newLi.appendChild(text);

    todoList.appendChild(newLi);
  });
}
renderTodos();

//Add Todos
btnAdd.addEventListener("click", addNewTodo);

function addNewTodo() {
  const newTodoText = newTodoInput.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      renderTodos();
    });
}

//UPDATE Todos
function updateTodo(todo) {
  fetch(url + "/" + todo.id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((res) => res.json())
    .then((updatedTodoFromApi) => {
      console.log(updatedTodoFromApi);
      todo = updatedTodoFromApi;
      renderTodos();
    });
}

//Delete Done Toods
btnRemove.addEventListener("click", deleteDoneTodos);

function deleteDoneTodos() {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].done === true) {
      fetch(url + "/" + todos[i].id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {});
    }
  }
  todos = todos.filter((todo) => todo.done === false);
  renderTodos();
}
