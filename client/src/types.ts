import type { DateValue } from "react-aria-components";

export interface User {
    id: number;
    name: string;
    email?: string;
}
export interface AuthCredentials {
    name: string;
    email?: string;
    password: string;
}

export interface TaskInput {
    name: string;
    priority: "high" | "medium" | "low";
    dueDate?: DateValue | null;
    tag?: string | null;
}
export interface Task extends TaskInput {
    id: number,
    completed: boolean
}

export type FilterType = 'all' | 'active' | 'done' | 'high';
export type ViewType = 'today' | 'all' | 'settings';