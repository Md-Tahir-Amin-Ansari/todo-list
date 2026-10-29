import { db } from './database.ts';
type TodoDB = {
    id: number;
    name: string;
    completed: number;
    priority?: Priority;
    due_date?: string | null;
    tag?: Tag | null;
};

type TodoAPP = {
    id: number;
    name: string;
    completed: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};
type TodoUpdateInput = {
    name?: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
}
export type CreateTodoInput = {
    name: string;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};
type Priority = 'high' | 'low' | 'medium'
type Tag = 'work' | 'personal' | 'others'



export function getAllTodos(user_id: number): TodoAPP[] {
    const result = db.prepare(`SELECT * FROM todos WHERE user_id = ?`).all(user_id) as Array<TodoDB>
    return mapTodos(result)
}

export function getTodo(id: number, user_id: number): TodoAPP | undefined {
    const result = db.prepare(`SELECT * FROM todos WHERE id = ? AND user_id=?`).get(id, user_id) as TodoDB | undefined
    if (result) {
        return mapTodo(result)
    } else {
        return undefined
    }
}

export function postTodo(user_id: number, data: CreateTodoInput): TodoAPP {
    const priority = data.priority ?? 'medium';
    const dueDate = data.dueDate ?? null;
    const tag = data.tag ?? null;
    const name = data.name.trim()
    const statement = db.prepare(`INSERT INTO todos (name, user_id, priority, due_date, tag) VALUES (?,?,?,?,?)`)
    const result = statement.run(name, user_id, priority, dueDate, tag)
    const responseStatement = db.prepare(`SELECT * FROM todos WHERE id = ? AND user_id = ?`)
    const resultRow = responseStatement.get(result.lastInsertRowid, user_id) as TodoDB
    return mapTodo(resultRow)
}
export function deleteTodo(id: number, user_id: number): boolean {
    const result = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`).run(id, user_id)
    return Boolean(result.changes)
}
export function patchTodo(id: number, user_id: number, updates: TodoUpdateInput): boolean {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    // "An array whose items can be strings, numbers, or null."
    if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name.trim())
    }
    if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(Number(updates.completed))
    }
    if (updates.priority !== undefined) {
        fields.push('priority = ?');
        values.push(updates.priority);
    }
    if (updates.dueDate !== undefined) {
        fields.push('due_date = ?');
        values.push(updates.dueDate);
    }
    if (updates.tag !== undefined) {
        fields.push('tag = ?')
        values.push(updates.tag)
    }

    if (fields.length === 0) return false;
    values.push(id, user_id);
    const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ? `;
    const result = db.prepare(sql).run(...values)
    return Boolean(result.changes)
}

function mapTodos(list: Array<TodoDB>): TodoAPP[] {
    return list.map(todo => mapTodo(todo))
}

function mapTodo(todo: TodoDB): TodoAPP {
    return { id: todo.id, name: todo.name, completed: Boolean(todo.completed), dueDate: todo.due_date ?? null, priority: todo.priority ?? 'medium', tag: todo.tag ?? null }
}