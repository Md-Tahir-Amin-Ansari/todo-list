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
export interface TodayViewProps {
    tasks: Task[];
    tasksLoading: boolean;
    onToggleTask: (id: number) => void;
    onEditTask: (task: Task) => void;
    onOpenCreateModal: () => void;
}
/**
 * UpdateTaskPayload:
 * Uses Partial<TaskInput> so callers can update any subset of editable fields
 * (e.g. just toggling completed, or editing name/priority in a modal).
 * We base it on TaskInput rather than Task to prevent mutating immutable server
 * identifiers like `id`.
 */
export type UpdateTaskPayload = Partial<TaskInput> & {
    completed?: boolean;
};
export type FilterType = 'all' | 'active' | 'done' | 'high';
export type ViewType = 'today' | 'all' | 'settings';