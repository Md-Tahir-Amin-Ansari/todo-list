import { createTodos, deleteTodos, getTodos, updateTodos } from "@/api/todos";
import type { Task, TaskInput, User } from "@/types";
import { useEffect, useState } from "react";

export function useTasks(user: User | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksLoading, setTasksLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const handleOpenCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };
    // handle task create
    const handleCreateTask = async (payload: TaskInput) => {
        try {
            if (editingTask) {
                const updated = await updateTodos(editingTask.id, payload);
                // When you pass a function instead of a value to setTasks(...):

                // example:
                // setTasks((x) => ...)

                // React itself calls your function behind the scenes, and React passes the most up-to-date state into that first parameter.
                setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? updated : task)))
                handleCloseModal()
            } else {
                const newTask = await createTodos(payload);
                setTasks((prev) => [...prev, newTask]);
                handleCloseModal();
            }
        } catch (err) {
            console.error("Failed to create task:", err);
        }
    };
    const handleToggleTask = async (id: number) => {
        const target = tasks.find((task) => task.id === id);
        if (!target) return;
        const newCompleted = !target.completed;
        try {
            await updateTodos(id, { completed: newCompleted });
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
            );
        } catch (error) {
            console.error("Failed to toggle task:", error);
        }

    };

    const handleDeleteTask = async () => {
        if (!editingTask) return;
        try {
            await deleteTodos(editingTask.id);
            setTasks((prev) => prev.filter((t) => t.id !== editingTask.id));
            handleCloseModal();
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };


    useEffect(() => {
        if (!user) {
            setTasks([]); // Auto-clears tasks when user logs out!
            setTasksLoading(false);
            return;
        }

        async function loadTasks() {
            try {
                setTasksLoading(true);
                const data = await getTodos();
                setTasks(data);
            } catch (err) {
                console.error("Failed to load tasks:", err);
            } finally {
                setTasksLoading(false);
            }
        }

        loadTasks();
    }, [user]);
    return {
        tasks,
        tasksLoading,
        isModalOpen,
        setIsModalOpen,
        editingTask,
        handleOpenCreateModal,
        handleCreateTask,
        handleToggleTask,
        handleDeleteTask,
        handleEditTask,
        handleCloseModal,
    };
}