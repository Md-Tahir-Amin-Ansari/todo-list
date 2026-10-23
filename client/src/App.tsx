import './App.css'
import { TaskModal } from './components/todos/TaskModal'

function App() {

  return (
    <>
      {/* <h1>Todo App</h1>
    <p>You have 3 tasks remaining</p>
    <ul>
      <li>Learn React</li>
      <li>Build the Todo UI</li>
      <li>Connect the backend</li>
    </ul>
    <button>Add Tasks</button> */}
      <TaskModal isOpen={true} onClose={() => { }} onSave={() => { }} task={{ id: 1, name: "hello" }} />
    </>
  )
}

export default App
