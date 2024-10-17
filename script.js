function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todos')) || { "todoList": [] };
}

let filterState = 'all';
let idCount = 0;

function addTodoToLocalStorage(todoObject) {
    const todos = getTodosFromLocalStorage();
    todos.todoList.push(todoObject);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function displayTodos(){
    const todos = getTodosFromLocalStorage().todoList;
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    for(let i = 0; i < todos.length; i++) {

        if(filterState == 'completed' && !todos[i].completed) continue;
        if(filterState == 'pending' && todos[i].completed) continue;
        
        const todoElement = document.createElement('li');
        todoElement.setAttribute('listId', todos[i].id);

        const textElement = document.createElement('div');
        textElement.textContent = todos[i].text;
        textElement.classList.add('textElement');

        if(todos[i].completed) textElement.classList.add('todoCompletedBtn');

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', deleteTodo);

        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.addEventListener('click', toggleTodo);

        completeButton.innerText = todos[i].completed ? 'Reset' : 'Completed';

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', editTodo);

        wrapper.appendChild(editButton);
        wrapper.appendChild(deleteButton);
        wrapper.appendChild(completeButton);

        todoElement.appendChild(textElement);   
        todoElement.appendChild(wrapper);

        todoList.appendChild(todoElement);
    }
}

function deleteTodo() {
    const todoID = this.parentElement.parentElement.getAttribute('listId');
    const todos = getTodosFromLocalStorage();

    const newTodos = [];
    for(let i = 0; i < todos.todoList.length; i++) {
        if(todos.todoList[i].id != todoID) {
            newTodos.push(todos.todoList[i]);
        }
    }
    todos.todoList = newTodos;
    localStorage.setItem('todos', JSON.stringify(todos));

    displayTodos();
}

function toggleTodo() {
    const todoID = this.parentElement.parentElement.getAttribute('listId');
    const todos = getTodosFromLocalStorage();

    for(let i = 0; i < todos.todoList.length; i++) {
        if(todos.todoList[i].id == todoID) {
            todos.todoList[i].completed = !todos.todoList[i].completed;
        }
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

function editTodo() {
    const todoId = this.parentElement.parentElement.getAttribute('listId');
    const todos = getTodosFromLocalStorage();

    const response = prompt("Enter new todo value");
    const trimmedResponse = response.trim();

    if(trimmedResponse.length == 0) return;

    for(let i = 0; i < todos.todoList.length; i++) {
        if(todos.todoList[i].id == todoId) {
            todos.todoList[i].text = trimmedResponse;
        }
    }

    localStorage.setItem('todos', JSON.stringify(todos));   
    displayTodos();
}
    

function addNewTodo() {
    const textInput = document.getElementById('todoTextInput');
    const todoText = textInput.value;
    if (todoText.length == 0){
        alert('Please enter a todo');
        return;
    } 
    textInput.value = "";
    
    const todoId = idCount++;
    addTodoToLocalStorage({ "id": todoId, "text": todoText, "completed": false });
    
    if(filterState != 'completed') {
        displayTodos();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', addNewTodo);
    document.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            addNewTodo();
        }
    });

    const filterButtons = document.getElementsByClassName('filterBtn');
    for(let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', (event) => {
            filterState = event.target.getAttribute('filterState');
            displayTodos();
        });
    }

    displayTodos();
});