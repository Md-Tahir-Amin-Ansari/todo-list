import { type Task, type TaskInput, type UpdateTaskPayload } from '@/types.ts'

export async function getTodos(): Promise<Task[]> {
    const res = await fetch('/todos')
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to fetch todos")
    } else {
        return await res.json() as Task[]
    }
}

export async function createTodos(payload: TaskInput): Promise<Task> {
    const res = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: payload.name,
            priority: payload.priority,
            dueDate: payload.dueDate ? payload.dueDate.toString() : null,
            tag: payload.tag || null,
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to fetch todos")
    } else {
        return await res.json() as Task
    }
}

export async function updateTodos(id: number, payload: UpdateTaskPayload): Promise<Task> {
    const res = await fetch(`/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...payload,
            dueDate: payload.dueDate ? payload.dueDate.toString() : payload.dueDate
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update todos")
    } else {
        return await res.json() as Task
    }
}

export async function deleteTodos(id: number): Promise<void> {
    const res = await fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete todos")
    } else {
        return
    }
}