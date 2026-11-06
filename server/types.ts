/**
 * @file types.ts
 * @brief type definitions for backend.
 * @details Includes type and interface definition for TodoDB, TodoAPP , TodoUpdate Input, create todo input , user , userDB , priority and tags.
 */

/**
 * @brief Database representation of a Todo row in SQLite.
 * @details Uses `completed: number` (0 or 1) and snake_case `due_date`.
 */
export type TodoDB = {
    id: number;
    name: string;
    completed: number;
    priority?: Priority;
    due_date?: string | null;
    tag?: Tag | null;
};
/**
 * @brief Application/API representation of a Todo.
 * @details Uses `completed: boolean` and camelCase `dueDate` for frontend consumption.
 */
export type TodoAPP = {
    id: number;
    name: string;
    completed: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};
/**@brief Todo input update */
export type TodoUpdateInput = {
    name?: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
}
/**@brief Todo input create */
export type CreateTodoInput = {
    name: string;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};
/**
 * @brief API/Application representation of a User record.
 */
export type User = {
    id: number,
    name: string,
    email: string
}
/**
 * @brief Database representation of a User record.
 * @note Contains sensitive `password_hash` which must never be leaked to the client.
 */
export type UserDB = {
    id: number,
    name: string,
    email: string,
    password_hash: string
}
/**@brief Priority */
export type Priority = 'high' | 'low' | 'medium'
/**@brief Tags */
export type Tag = 'work' | 'personal' | 'others'