/**
 * @file schema.ts
 * @brief Zod validation schemas for request payloads.
 * @details Validates incoming request data for authentication and todo CRUD operations
 *          before reaching route controllers.
 */

import { z } from 'zod';
/**
 *
 * @brief Validation schema for updating an existing todo.
 * @details Allows optional updates to name, status, priority, dueDate, or tag.
 * @note Requires at least one property to be present in the update payload.
 */
export const updateTodoSchema = z.object({
    name: z.string().trim().min(1).optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().nullable().optional(),
    tag: z.enum(['work', 'personal', 'others']).nullable().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});
/**
 * 
 * @brief Validation schema for create todos.
 * @note Requires name and optional priority, due dates and tags.
 */
export const createTodoSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().nullable().optional(),
    tag: z.enum(['work', 'personal', 'others']).nullable().optional(),
});
/**
 * 
 * @brief Validation schema for user registration.
 * @note Requires name, valid email format, and a minimum 8-character password.
 */

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
/**
 * 
 * @brief Validation schema for user login.
 * @note Requires name and a minimum 8-character password.
 */
export const loginSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
});