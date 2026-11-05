import { createTodos, deleteTodos, getTodos, updateTodos } from "@/api/todos";
import type { Task, TaskInput, User } from "@/types";
import { useEffect, useState, useMemo } from "react";
import { toast } from 'sonner';
export function useTasks(user: User | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksLoading, setTasksLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const handleOpenCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };
    const counts = useMemo(() => {
        const todayISO = new Date().toISOString().split('T')[0];

        //Tasks needing attention today: incomplete AND (due today or overdue)
        const today = tasks.filter((task) => {
            if (!task.dueDate || task.completed) return false;
            const taskDate = task.dueDate.toString().split('T')[0];
            return taskDate <= todayISO;
        }).length;

        const all = tasks.filter((task) => !task.completed).length;
        return { today, all };
    }, [tasks]);
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
                handleCloseModal();
                toast.success("Task updated");
            } else {
                const newTask = await createTodos(payload);
                setTasks((prev) => [...prev, newTask]);
                handleCloseModal();
                toast.success("Task created");
            }
        } catch (err) {
            console.error("Failed to create task:", err);
            toast.error("Failed to save task. Please try again.");
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
            toast.error("Failed to update status");
        }

    };

    const handleDeleteTask = async () => {
        if (!editingTask) return;
        try {
            await deleteTodos(editingTask.id);
            setTasks((prev) => prev.filter((t) => t.id !== editingTask.id));
            handleCloseModal();
            toast.success("Task deleted");
        } catch (err) {
            console.error("Failed to delete task:", err);
            toast.error("Failed to delete task");
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
        counts,
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