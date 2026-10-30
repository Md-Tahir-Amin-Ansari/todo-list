import { z } from 'zod';

export const updateTodoSchema = z.object({
    name: z.string().trim().min(1).optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().nullable().optional(),
    tag: z.enum(['work', 'personal', 'others']).nullable().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export const createTodoSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().nullable().optional(),
    tag: z.enum(['work', 'personal', 'others']).nullable().optional(),
});

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
});