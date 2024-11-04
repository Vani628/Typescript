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
        TodoList.prototype.addTodo = function (task) {
            this.todos.push({ id: this.todoId++, task: task, completed: false });
            this.saveToStorage();
            this.render();
        };
        TodoList.prototype.toggleComplete = function (id) {
            var todo = this.todos.filter(function (todo) { return todo.id === id; })[0];
            if (todo) {
                todo.completed = !todo.completed;
                this.saveToStorage();
                this.render();
            }
        };
        TodoList.prototype.deleteTodo = function (id) {
            this.todos = this.todos.filter(function (todo) { return todo.id !== id; });
            this.saveToStorage();
            this.render();
        };
        TodoList.prototype.editTodo = function (id, newTask) {
            var todo = this.todos.filter(function (todo) { return todo.id === id; })[0];
            if (todo) {
                todo.task = newTask;
                this.saveToStorage();
                this.render();
            }
        };
        TodoList.prototype.clearCompleted = function () {
            this.todos = this.todos.filter(function (todo) { return !todo.completed; });
            this.saveToStorage();
            this.render();
        };
        TodoList.prototype.setFilter = function (filter) {
            this.filter = filter;
            this.render();
        };
        TodoList.prototype.saveToStorage = function () {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        };
        TodoList.prototype.loadFromStorage = function () {
            var storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                this.todos = JSON.parse(storedTodos);
                this.todoId = this.todos.length ? Math.max.apply(Math, this.todos.map(function (todo) { return todo.id; })) + 1 : 1;
            }
        };
        TodoList.prototype.render = function () {
            var _this = this;
            this.container.innerHTML = '';
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
            var filterContainer = document.createElement('div');
            ['all', 'completed', 'incomplete'].forEach(function (status) {
                var filterButton = document.createElement('button');
                filterButton.textContent = status;
                filterButton.onclick = function () { return _this.setFilter(status); };
                filterContainer.appendChild(filterButton);
            });
            this.container.appendChild(filterContainer);
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
                var completeBtn = document.createElement('button');
                completeBtn.textContent = todo.completed ? 'Uncomplete' : 'Complete';
                completeBtn.style.backgroundColor = todo.completed ? '#28a745' : '#ffc107';
                completeBtn.style.color = 'white';
                completeBtn.onclick = function (e) {
                    e.stopPropagation();
                    _this.toggleComplete(todo.id);
                };
                var editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.style.backgroundColor = '#007bff';
                editBtn.style.color = 'white';
                editBtn.onclick = function (e) {
                    e.stopPropagation();
                    var newTask = prompt("Edit task:", todo.task);
                    if (newTask) {
                        _this.editTodo(todo.id, newTask);
                    }
                };
                var deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.style.backgroundColor = '#dc3545';
                deleteBtn.style.color = 'white';
                deleteBtn.onclick = function (e) {
                    e.stopPropagation();
                    _this.deleteTodo(todo.id);
                };
                completeBtn.style.marginLeft = '10px';
                editBtn.style.marginLeft = '10px';
                deleteBtn.style.marginLeft = '10px';
                li.appendChild(completeBtn);
                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                ul.appendChild(li);
            });
            this.container.appendChild(ul);
            var clearCompletedBtn = document.createElement('button');
            clearCompletedBtn.textContent = 'Clear Completed';
            clearCompletedBtn.onclick = function () { return _this.clearCompleted(); };
            clearCompletedBtn.classList.add('clear-completed');
            this.container.appendChild(clearCompletedBtn);
        };
        return TodoList;
    }());
    App.TodoList = TodoList;
})(App || (App = {}));
document.addEventListener('DOMContentLoaded', function () {
    var appContainer = document.getElementById('app');
    if (appContainer) {
        var todoList = new App.TodoList(appContainer);
        todoList.render();
    }
});
