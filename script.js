const url = "http://localhost:4730/todos";
const btnAdd = document.querySelector("#add-todo");
const btnRemove = document.querySelector("#remove-done-todo");
const newTodoInput = document.querySelector("input");
const todoList = document.querySelector("#todo-list");

let todos = [];
let createdUrl = [];

//Get Objects from backend

function getObjectsFromBackend() {
  fetch(url)
    .then((res) => res.json())
    .then((todosFromAPI) => {
      todos = todosFromAPI;
      renderTodos();

      for (let i = 1; i < todos.length; i++) {
        createdUrl.push(url + "/" + [i]);
      }
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

    checkbox.addEventListener("change", (e) => {
      todo.done = e.target.checked;
    });

    newLi.appendChild(checkbox);
    const text = document.createTextNode(todo.description);
    newLi.appendChild(text);

    todoList.appendChild(newLi);
  });
}

//Add Todos
btnAdd.addEventListener("click", () => {
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
});

//Delete Done Toods
btnRemove.addEventListener("click", () => {
  todos = todos.filter((todo) => todo.done === false);

  for (let i = 0; i < todos.length; i++) {
    if (todos.done === false) {
      fetch(createdUrl, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {});
    }
  }
  renderTodos();
});
