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
                    alert(result.message);
                    idInput.value = '';
                    nameInput.value = '';
                } else {
                    alert('Server error: ' + result.message);
                }

            } catch (error) {
                console.error('Error sending request:', error);
                alert('Could not connect to the server. Check if your Node app is running on port 3000.');
            }
        });