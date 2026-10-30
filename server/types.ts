export type TodoDB = {
    id: number;
    name: string;
    completed: number;
    priority?: Priority;
    due_date?: string | null;
    tag?: Tag | null;
};

export type TodoAPP = {
    id: number;
    name: string;
    completed: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};
export type TodoUpdateInput = {
    name?: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
}
export type CreateTodoInput = {
    name: string;
    priority?: Priority;
    dueDate?: string | null;
    tag?: Tag | null;
};

export type User = {
    id: number,
    name: string,
    email: string
}
export type UserDB = {
    id: number,
    name: string,
    email: string,
    password_hash: string
}
export type Priority = 'high' | 'low' | 'medium'
export type Tag = 'work' | 'personal' | 'others'