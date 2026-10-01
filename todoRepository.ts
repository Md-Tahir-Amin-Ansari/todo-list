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
export function getAllTodos(): TodoAPP[]{
    const result = db.prepare(`SELECT * FROM todos`).all() as Array<TodoDB>
    return mapTodos(result)
}

export function getTodo(id:number) : TodoAPP | undefined{
    const result = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(id) as TodoDB | undefined
    if(result){
        return mapTodo(result)
    }else{
        return undefined
    }
}

export function postTodo(name: string): TodoAPP{
    const statement = db.prepare(`INSERT INTO todos (name) VALUES (?)`)
    const result = statement.run(name.trim())
    const responseStatement = db.prepare(`SELECT * FROM todos WHERE id = ?`)
    const resultRow = responseStatement.get(result.lastInsertRowid) as TodoDB
    return mapTodo(resultRow)
}
export function deleteTodo(id: number): boolean{
    const result = db.prepare(`DELETE FROM todos WHERE id = ?`).run(id)
    return Boolean(result.changes)
}
export function patchTodo(id: number, completed: boolean):boolean{
    const result = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`).run(Number(completed) , id)
    return Boolean(result.changes)
}

function mapTodos(list: Array<TodoDB>): TodoAPP[]{
    return list.map(todo => mapTodo(todo) )
}

function mapTodo(todo: TodoDB): TodoAPP{
    return {id: todo.id, name: todo.name, completed: Boolean(todo.completed)}
}