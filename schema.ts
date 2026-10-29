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