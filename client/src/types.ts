/**
 * @file types.ts
 * @brief Core domain interfaces and shared TypeScript definitions for the client.
 */
import type { DateValue } from "react-aria-components";


/**
 * @brief Represents an authenticated user profile in the client.
 */
export interface User {
    id: number;
    name: string;
    email?: string;
}

/**
 * @brief Payload required for authenticating or registering a user.
 */
export interface AuthCredentials {
    name: string;
    email?: string;
    password: string;
}

/**
 * @brief Input payload required to create or update a task.
 */
export interface TaskInput {
    name: string;
    priority: "high" | "medium" | "low";
    dueDate?: DateValue | null;
    tag?: string | null;
}

/**
 * @brief Full task entity including server-assigned ID and completion status.
 */
export interface Task extends TaskInput {
    id: number,
    completed: boolean
}

/**
 * UpdateTaskPayload:
 * Uses Partial<TaskInput> so callers can update any subset of editable fields
 * (e.g. just toggling completed, or editing name/priority in a modal).
 * We base it on TaskInput rather than Task to prevent mutating immutable server
 * identifiers like `id`.
 */
/**
 * @brief Partial update payload for modifying an existing task.
 * @details Allows updating any subset of `TaskInput` fields alongside `completed`.
 */
export type UpdateTaskPayload = Partial<TaskInput> & {
    completed?: boolean;
};
/**
 * @brief Filter categories available in the tasks view.
 */
export type FilterType = 'all' | 'active' | 'done' | 'high';
/**
 * @brief Primary navigation view identifiers for the application.
 */
export type ViewType = 'today' | 'all' | 'settings';