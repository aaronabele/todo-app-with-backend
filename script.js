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
      console.log(todos);
      console.log(todos[0].id);
      console.log(todos[0].done);
      console.log(todos[0].description);
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
todoList.addEventListener("change", updateTodos);

function updateTodos() {
  for (let i = 0; i < todos.length; i++) {
    todos[i].done = e.target.checked;

    const updateTodoId = todos[i].id;
    const updateTodoText = todos[i].description;
    const updateTodoDoneState = todos[i].done;

    const updatedTodo = {
      id: updateTodoId,
      description: updateTodoText,
      done: updateTodoDoneState,
    };

    fetch(url + "/" + todos[i].id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((res) => res.json())
      .then((updatedTodoFromApi) => {
        console.log(updatedTodoFromApi);
        renderTodos();
      });
  }
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
