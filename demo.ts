namespace App {
    interface Todo {
        id: number;
        task: string;
        completed: boolean;
    }

    export class TodoList {
        todos: Todo[] = [];
        todoId: number = 1;
        filter: 'all' | 'completed' | 'incomplete' = 'all';

        constructor(private container: HTMLElement) {
            this.loadFromStorage();
        }

        addTodo(task: string) {
            this.todos.push({ id: this.todoId++, task, completed: false });
            this.saveToStorage();
            this.render();
        }

        toggleComplete(id: number) {
            const todo = this.todos.filter(todo => todo.id === id)[0];
            if (todo) {
                todo.completed = !todo.completed;
                this.saveToStorage();
                this.render();
            }
        }

        deleteTodo(id: number) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.render();
        }

        editTodo(id: number, newTask: string) {
            const todo = this.todos.filter(todo => todo.id === id)[0];
            if (todo) {
                todo.task = newTask;
                this.saveToStorage();
                this.render();
            }
        }

        clearCompleted() {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
        }

        setFilter(filter: 'all' | 'completed' | 'incomplete') {
            this.filter = filter;
            this.render();
        }

        saveToStorage() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }

        loadFromStorage() {
            const storedTodos = localStorage.getItem('todos');
            if (storedTodos) {
                this.todos = JSON.parse(storedTodos);
                this.todoId = this.todos.length ? Math.max(...this.todos.map(todo => todo.id)) + 1 : 1;
            }
        }

        render() {
            this.container.innerHTML = '';
        
            const input = document.createElement('input');
            const addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.onclick = () => {
                if (input.value) {
                    this.addTodo(input.value);
                    input.value = '';
                }
            };

            this.container.appendChild(input);            
            this.container.appendChild(addButton); 
        
            const filterContainer = document.createElement('div');
            ['all', 'completed', 'incomplete'].forEach((status) => {
                const filterButton = document.createElement('button');
                filterButton.textContent = status;
                filterButton.onclick = () => this.setFilter(status as 'all' | 'completed' | 'incomplete');
                filterContainer.appendChild(filterButton);
            });
            this.container.appendChild(filterContainer);
        
            const ul = document.createElement('ul');
            const filteredTodos = this.todos.filter(todo => {
                if (this.filter === 'completed') return todo.completed;
                if (this.filter === 'incomplete') return !todo.completed;
                return true;
            });
        
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.task;
                li.style.textDecoration = todo.completed ? 'line-through' : 'none';
        
                const completeBtn = document.createElement('button');
                completeBtn.textContent = todo.completed ? 'Uncomplete' : 'Complete';
                completeBtn.style.backgroundColor = todo.completed ? '#28a745' : '#ffc107'; 
                completeBtn.style.color = 'white';
                completeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleComplete(todo.id);
                };
        
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.style.backgroundColor = '#007bff'; 
                editBtn.style.color = 'white';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    const newTask = prompt("Edit task:", todo.task);
                    if (newTask) {
                        this.editTodo(todo.id, newTask);
                    }
                };
        
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.style.backgroundColor = '#dc3545'; 
                deleteBtn.style.color = 'white';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteTodo(todo.id);
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
        
            const clearCompletedBtn = document.createElement('button');
            clearCompletedBtn.textContent = 'Clear Completed';
            clearCompletedBtn.onclick = () => this.clearCompleted();
            clearCompletedBtn.classList.add('clear-completed'); 
            this.container.appendChild(clearCompletedBtn);
        }
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        const todoList = new App.TodoList(appContainer);
        todoList.render();
    }
});
