import { useState } from 'react';
import { SidebarProvider } from '@/components/tailgrids/core/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import type { ViewType } from '@/types';

import { TaskModal } from '@/components/todos/TaskModal';
import { TaskItem } from './components/todos/TaskItem';
import { TaskFilters } from './components/todos/TaskFilters';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('today');

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background-50">
        <AppSidebar currentView={currentView} onSelectView={setCurrentView} />

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
              <TaskItem
                task={{
                  id: 1,
                  name: "Design landing page wireframes",
                  priority: "high",
                  completed: false,
                  tag: "Design",
                  dueDate: null,
                }}
                onToggle={(id) => console.log('Toggled task:', id)}
                onEdit={(task) => console.log('Edit task:', task)}
              />
            </div>
          </div>
        </main>
      </div>

      <TaskModal isOpen={false} onClose={() => { }} onSave={() => { }} />
    </SidebarProvider>
  );
}
