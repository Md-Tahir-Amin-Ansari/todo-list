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
export function getAllTodos(user_id:number): TodoAPP[]{
    const result = db.prepare(`SELECT * FROM todos WHERE user_id = ?`).all(user_id) as Array<TodoDB>
    return mapTodos(result)
}

export function getTodo(id:number,user_id:number) : TodoAPP | undefined{
    const result = db.prepare(`SELECT * FROM todos WHERE id = ? AND user_id=?`).get(id,user_id) as TodoDB | undefined
    if(result){
        return mapTodo(result)
    }else{
        return undefined
    }
}

export function postTodo(name: string,user_id:number): TodoAPP{
    const statement = db.prepare(`INSERT INTO todos (name, user_id) VALUES (?,?)`)
    const result = statement.run(name.trim(),user_id)
    const responseStatement = db.prepare(`SELECT * FROM todos WHERE id = ? AND user_id = ?`)
    const resultRow = responseStatement.get(result.lastInsertRowid, user_id) as TodoDB
    return mapTodo(resultRow)
}
export function deleteTodo(id: number, user_id: number): boolean{
    const result = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`).run(id,user_id)
    return Boolean(result.changes)
}
export function patchTodo(id: number,user_id: number, completed: boolean):boolean{
    const result = db.prepare(`UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?`).run(Number(completed) , id, user_id)
    return Boolean(result.changes)
}

function mapTodos(list: Array<TodoDB>): TodoAPP[]{
    return list.map(todo => mapTodo(todo) )
}

function mapTodo(todo: TodoDB): TodoAPP{
    return {id: todo.id, name: todo.name, completed: Boolean(todo.completed)}
}