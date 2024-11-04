var App;
(function (App) {
    var TodoList = /** @class */ (function () {
        function TodoList(container) {
            this.container = container;
            this.todos = [];
            this.todoId = 1;
            this.filter = 'all';
            this.loadFromStorage();
        }
        // Add a new task to the list
        TodoList.prototype.addTodo = function (task) {
            this.todos.push({ id: this.todoId++, task: task, completed: false });
            this.saveToStorage();
            this.render();
        };
        // Toggle the completion status of a task
        TodoList.prototype.toggleComplete = function (id) {
            var todo = this.todos.filter(function (todo) { return todo.id === id; })[0];
            if (todo) {
                todo.completed = !todo.completed;
                this.saveToStorage();
                this.render();
            }
        };
        // Delete a specific task
        TodoList.prototype.deleteTodo = function (id) {
            this.todos = this.todos.filter(function (todo) { return todo.id !== id; });
            this.saveToStorage();
            this.render();
        };
        // Edit a specific task
        TodoList.prototype.editTodo = function (id, newTask) {
            var todo = this.todos.filter(function (todo) { return todo.id === id; })[0];
            if (todo) {
                todo.task = newTask;
                this.saveToStorage();
                this.render();
            }
        };
        // Clear all completed tasks
        TodoList.prototype.clearCompleted = function () {
            this.todos = this.todos.filter(function (todo) { return !todo.completed; });
            this.saveToStorage();
            this.render();
        };
        // Filter tasks based on status
        TodoList.prototype.setFilter = function (filter) {
            this.filter = filter;
            this.render();
        };
        // Save tasks to localStorage
        TodoList.prototype.saveToStorage = function () {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        };
        // Load tasks from localStorage
        TodoList.prototype.loadFromStorage = function () {
            var storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                this.todos = JSON.parse(storedTodos);
                this.todoId = this.todos.length ? Math.max.apply(Math, this.todos.map(function (todo) { return todo.id; })) + 1 : 1;
            }
        };
        // Render the to-do list with all functionalities
        TodoList.prototype.render = function () {
            var _this = this;
            this.container.innerHTML = '';
            // Input section for adding a new task
            var input = document.createElement('input');
            var addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.onclick = function () {
                if (input.value) {
                    _this.addTodo(input.value);
                    input.value = '';
                }
            };
            this.container.appendChild(input);
            this.container.appendChild(addButton);
            // Filter options
            var filterContainer = document.createElement('div');
            ['all', 'completed', 'incomplete'].forEach(function (status) {
                var filterButton = document.createElement('button');
                filterButton.textContent = status;
                filterButton.onclick = function () { return _this.setFilter(status); };
                filterContainer.appendChild(filterButton);
            });
            this.container.appendChild(filterContainer);
            // List of tasks
            var ul = document.createElement('ul');
            var filteredTodos = this.todos.filter(function (todo) {
                if (_this.filter === 'completed')
                    return todo.completed;
                if (_this.filter === 'incomplete')
                    return !todo.completed;
                return true;
            });
            filteredTodos.forEach(function (todo) {
                var li = document.createElement('li');
                li.textContent = todo.task;
                li.style.textDecoration = todo.completed ? 'line-through' : 'none';
                // Toggle complete
                li.onclick = function () { return _this.toggleComplete(todo.id); };
                // Edit button
                var editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.onclick = function (e) {
                    e.stopPropagation();
                    var newTask = prompt("Edit task:", todo.task);
                    if (newTask) {
                        _this.editTodo(todo.id, newTask);
                    }
                };
                // Delete button
                var deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = function (e) {
                    e.stopPropagation();
                    _this.deleteTodo(todo.id);
                };
                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                ul.appendChild(li);
            });
            this.container.appendChild(ul);
            // Clear completed button
            var clearCompletedBtn = document.createElement('button');
            clearCompletedBtn.textContent = 'Clear Completed';
            clearCompletedBtn.onclick = function () { return _this.clearCompleted(); };
            this.container.appendChild(clearCompletedBtn);
        };
        return TodoList;
    }());
    App.TodoList = TodoList;
})(App || (App = {}));
// Initialize the TodoList on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    var appContainer = document.getElementById('app');
    if (appContainer) {
        var todoList = new App.TodoList(appContainer);
        todoList.render();
    }
});
