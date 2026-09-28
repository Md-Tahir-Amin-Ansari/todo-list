 document.getElementById('submit-btn').addEventListener('click', async () => {

            const nameInput = document.getElementById('todo-name');
            // validation
            if (!nameInput.value.trim()) {
                alert('Please fill out Task Name.');
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
            throw new Error(`HTTP error! Status: ${response.status}`)
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
    todoListElement.textContent = '';
    if (todos.length === 0) {
        todoListElement.innerHTML = '<li>No tasks found</li>'
        return;
    }
    todos.forEach(todo => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const textSpan = document.createElement('span');
        const deleteButton = document.createElement('button')
        deleteButton.innerHTML = "Delete"
        checkbox.type ='checkbox'
        checkbox.checked = todo.completed
        textSpan.textContent = todo.name;
        if(todo.completed){
            li.classList.add('completed');
            textSpan.style.textDecoration = 'line-through';
        }
        checkbox.addEventListener('change', async () => {
            const result = await toggleTodoStatus(todo.id, checkbox.checked);
            // Toggle strike-through text instantly on the UI
            if(result){
                textSpan.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            }else{
                checkbox.checked = !checkbox.checked
            }
            
        });
        deleteButton.addEventListener('click',async ()=>{
            const result = await deleteTodo(todo.id)
            if(result){
                li.remove();
            }else{
                console.log("Failed to delete todo")
            }
        })
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteButton);
        todoListElement.appendChild(li)
    })
}

async function toggleTodoStatus(id, isCompleted){
    try{
        const response = await fetch(`http://localhost:3000/todos/${id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: isCompleted })
        })
        if(response.ok){
            console.log("Task updated sucessfully")
            return true;
        }else{
            console.log("server error: ", await response.text())
            return false;
        }
    }catch(error){
        console.log("todo status was not updated: ", error)
        return false;
    }
}

async function deleteTodo(id) {
    try{
        const response = await fetch(`http://localhost:3000/todos/${id}`,{
            method:"DELETE",
        })
        if(response.ok){
            console.log("Task deleted sucessfully")
            return true;
        }else{
            console.log("server error: ", await response.text())
            return false;
        }
    }catch(error){
        console.log("todo was not deleted", error)
        return false;
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    displayTodos();
})