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
export interface AllTasksViewProps {
    tasks: Task[];
    tasksLoading: boolean;
    onToggleTask: (id: number) => void;
    onEditTask: (task: Task) => void;
    onOpenCreateModal: () => void;
}

export interface SidebarProps {
    currentView: ViewType;
    onSelectView: (view: ViewType) => void;
    user?: User;
    todayCount?: number;
    allCount?: number;
}
export interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: TaskInput) => void;
    onDelete?: () => void;
    task?: Task;
}
export interface AuthCardProps {
    onSubmit: (data: AuthCredentials, isSignUp: boolean) => void;
    errorMessage?: string;
    loading?: boolean;
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