 document.getElementById('submit-btn').addEventListener('click', async () => {
            const idInput = document.getElementById('todo-id');
            const nameInput = document.getElementById('todo-name');
            // validation
            if (!nameInput.value.trim()) {
                alert('Please fill out both ID and Task Name.');
                return;
            }
            // create a todo object
            const todoData = {
                name: nameInput.value.trim(),
            };
            // send
            try {
                const response = await fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(todoData)
                });

                const result = await response.json();

                if (response.ok) {
                    nameInput.value = '';
                    displayTodos();
                } else {
                    alert('Server error: ' + result.message);
                }

            } catch (error) {
                console.error('Error sending request:', error);
                alert('Could not connect to the server. Check if your Node app is running on port 3000.');
            }
        });


async function LoadTodos() {
    try{
        const response = await fetch('http://localhost:3000/todos');

        if(!response.ok){
            throw new Error('HTTP error! Status: ${response.status}')
        }
        const todoList = await response.json();
        return todoList

    }
    catch(error){
        console.error('Failed to load todos: ' , error);
    }
}

async function displayTodos(){
    const todos = await LoadTodos();
    const todoListElement = document.getElementById('todo-list');
    todoListElement.innerHTML = '';
    if (todos.length === 0) {
        todoListElement.innerHTML = '<li>No tasks found</li>'
        return;
    }
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.name;
        if(todo.completed){
            li.classList.add('completed');
        }
        todoListElement.appendChild(li)
    })
}

document.addEventListener("DOMContentLoaded",()=>{
    displayTodos();
})