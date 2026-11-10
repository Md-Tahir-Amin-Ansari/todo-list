// client/src/schemas.ts
/**
 * @file schema.ts
 * @brief Client-side Zod validation schemas for forms and modals.
 */
import { z } from 'zod';

/**
 * @brief Validation schema for task creation and editing.
 * @note Requires a non-empty name; defaults priority to 'medium'.
 */
export const taskSchema = z.object({
    name: z.string().trim().min(1, "Title is required"),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    tag: z.string().optional(),
    dueDate: z.any().nullable().optional(),
});

/**
 * @brief Validation schema for user login.
 * @note Enforces minimum length, uppercase letter, number, and special character.
 */
export const LoginSchema = z.object({
    name: z.string().min(3, "Name too short"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Must contain at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least 1 symbol")
});

/**
 * @brief Validation schema for user registration.
 * @details Extends `LoginSchema` with email validation.
 */
export const SignUpSchema = LoginSchema.extend({
    email: z.email("Invalid Email")

})