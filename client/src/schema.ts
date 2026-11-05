// client/src/schemas.ts
import { z } from 'zod';

export const taskSchema = z.object({
    name: z.string().trim().min(1, "Title is required"),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    tag: z.string().optional(),
    dueDate: z.any().nullable().optional(),
});
export const LoginSchema = z.object({
    name: z.string().min(3, "Name too short"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Must contain at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least 1 symbol")
});
export const SignUpSchema = LoginSchema.extend({
    email: z.email("Invalid Email")

})