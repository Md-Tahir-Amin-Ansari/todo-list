import { db } from './database.ts';
type TodoDB = {
    id : number,
    name : string,
    completed : number
}
type TodoAPP = {
    id : number,
    name : string,
    completed : boolean
}
export function getAllTodos(){
    const result = db.prepare(`SELECT * FROM todos`).all() as Array<TodoDB>
    return mapTodos(result)
}

export function getTodo(id:Number){
    const result = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(Number(id)) as TodoDB
    return mapTodo(result)
}

function mapTodos(list: Array<TodoDB>): TodoAPP[]{
    return list.map(todo => {return {id: todo.id, name: todo.name , completed : Boolean(todo.completed)}} )
}

function mapTodo(todo: TodoDB): TodoAPP{
    return {id: todo.id, name: todo.name, completed: Boolean(todo.completed)}
}