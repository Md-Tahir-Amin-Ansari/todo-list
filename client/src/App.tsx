import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/tailgrids/core/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { type User, type ViewType } from '@/types';
import AuthCard from '@/components/auth/AuthCard';
import { TaskModal } from '@/components/todos/TaskModal';
import { TaskItem } from './components/todos/TaskItem';
import { TaskFilters } from './components/todos/TaskFilters';
import { getMe, login, register } from '@/api/auth';
import type { AuthCredentials, Task, TaskInput } from '@/types';
import { getTodos, createTodos, updateTodos, deleteTodos } from './api/todos';
import { EmptyState } from './components/layout/EmptyState';



export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // authentication
  const handleAuth = async (credentials: AuthCredentials, isSignUp: boolean) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const loggedInUser = isSignUp ? await register(credentials) : await login(credentials);
      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("Authentication failed: invalid response received.");
      }
      setUser(loggedInUser);
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }
  useEffect(() => {
    if (!user) return; // If not logged in, do nothing

    async function loadTasks() {
      try {
        const data = await getTodos();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    }

    loadTasks();
  }, [user]);
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    }
    checkSession();
  }, []);
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
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-50 p-4">
        <AuthCard
          onSubmit={handleAuth}
          errorMessage={authError}
          loading={authLoading}
        />
      </div>
    );
  }
  else return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background-50">
        <AppSidebar currentView={currentView} onSelectView={setCurrentView} user={user} />

        <main className="flex-1 p-8 space-y-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl font-bold capitalize">{currentView} Screen</h1>

            <TaskFilters
              searchQuery=""
              onSearchChange={(query) => console.log('Search query:', query)}
              activeFilter="all"
              onFilterChange={(filter) => console.log('Filter changed:', filter)}
            />

            <div className="max-w-3xl">
              {tasks.length === 0 ? (
                <EmptyState
                  badge="0"
                  title="No tasks yet"
                  description="Add your first task and it will show up here."
                  actionLabel="+ Add task"
                  onAction={() => setIsModalOpen(true)}
                />
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleCreateTask} onDelete={handleDeleteTask} task={editingTask} />
    </SidebarProvider>
  );
}
