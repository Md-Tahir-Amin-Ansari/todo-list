import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/tailgrids/core/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { type ViewType } from '@/types';
import AuthCard from '@/components/auth/AuthCard';
import { TaskModal } from '@/components/todos/TaskModal';
import { Spinner } from './components/tailgrids/core/spinner';
import TodayView from './views/TodayView';
import AllTasksView from './views/AllTasksView';
import { SettingsView } from './views/SettingsView';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { AngleDoubleLeft } from '@tailgrids/icons';
export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const { isDarkMode, toggleDarkMode } = useTheme();
  const {
    user,
    authLoading,
    authError,
    isCheckingSession,
    handleAuth,
    handleLogout,
  } = useAuth();
  const {
    tasks,
    tasksLoading,
    isModalOpen,
    editingTask,
    handleOpenCreateModal,
    handleCreateTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleCloseModal,
  } = useTasks(user);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-50">
        <Spinner size="lg" />
      </div>
    );
  }
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
    <SidebarProvider defaultOpen className="h-screen overflow-hidden bg-background-50">

      <AppSidebar currentView={currentView} onSelectView={setCurrentView} user={user} />

      <main className="flex-1 p-8 space-y-4  h-full overflow-y-auto">
        <SidebarTrigger>
          <AngleDoubleLeft className="group-data-[sidebar=closed]/sidebar-wrapper:rotate-180 duration-300" />
        </SidebarTrigger>
        <div className="max-w-3xl space-y-4 mx-auto">


          {currentView === 'today' && (
            <TodayView
              tasks={tasks}
              tasksLoading={tasksLoading}
              onToggleTask={handleToggleTask}
              onEditTask={handleEditTask}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}
          {currentView === 'all' && (
            <AllTasksView
              tasks={tasks}
              tasksLoading={tasksLoading}
              onToggleTask={handleToggleTask}
              onEditTask={handleEditTask}
              onOpenCreateModal={handleOpenCreateModal
              }
            />
          )}
          {currentView === 'settings' && (
            <SettingsView
              user={user ? { name: user.name, email: user.email ?? '' } : undefined}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>


      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleCreateTask} onDelete={handleDeleteTask} task={editingTask} />
    </SidebarProvider>
  );
}
