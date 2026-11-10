/**
 * @file todos.ts
 * @brief HTTP client API functions for Todo CRUD operations.
 */
import { type Task, type TaskInput, type UpdateTaskPayload } from '@/types.ts'
/**
 * @brief Fetches all todos belonging to the authenticated user.
 * @returns Promise resolving to an array of `Task` objects.
 * @throws Error if request fails or user is unauthenticated.
 */
export async function getTodos(): Promise<Task[]> {
    const res = await fetch('/todos')
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to fetch todos")
    } else {
        return await res.json() as Task[]
    }
}
/**
 * @brief Creates a new task on the server.
 * @param payload Task attributes (`name`, `priority`, `dueDate`, `tag`).
 * @returns Promise resolving to the newly created `Task`.
 * @throws Error if validation fails or server rejects creation.
 */
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
/**
 * @brief Updates specific fields of an existing task.
 * @param id Task ID to modify.
 * @param payload Subset of task properties to update.
 * @returns Promise resolving to the updated `Task`.
 * @throws Error if task not found or update fails.
 */
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
/**
 * @brief Deletes a task from the database.
 * @param id Task ID to delete.
 * @returns Promise resolving when deletion completes.
 * @throws Error if deletion fails or task does not belong to user.
 */
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