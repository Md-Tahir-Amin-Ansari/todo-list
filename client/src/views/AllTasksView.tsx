import { useState } from 'react';
import { TaskFilters } from '@/components/todos/TaskFilters';
import { TaskItem } from '@/components/todos/TaskItem';
import { EmptyState } from '@/components/layout/EmptyState';
import { Spinner } from '@/components/tailgrids/core/spinner';
import type { FilterType, AllTasksViewProps } from '@/types';
import { Button } from '@/components/tailgrids/core/button';


export default function AllTasksView({ tasks, tasksLoading, onToggleTask, onEditTask, onOpenCreateModal }: AllTasksViewProps) {
    // inside AllTasksView:
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    // Derived filtered list (not useState, as you learned!):
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        if (!matchesSearch) return false;
        if (activeFilter === 'active') return !task.completed;
        if (activeFilter === 'done') return task.completed;
        if (activeFilter === 'high') return task.priority === 'high';
        return true; // 'all'
    });
    const renderContent = () => {
        if (tasksLoading) {
            return (
                <div className="flex justify-center py-12">
                    <Spinner size="md" />
                </div>
            );
        }

        if (tasks.length === 0) {
            return (
                <EmptyState
                    badge="0"
                    title="No tasks yet"
                    description="Add your first task and it will show up here."
                    actionLabel="+ Add task"
                    onAction={onOpenCreateModal}
                />
            );
        }

        if (filteredTasks.length === 0) {
            return (
                <EmptyState
                    title="No matches"
                    description="Try a different search or filter."
                />
            );
        }

        return (
            <div className="space-y-2 mt-4">
                {filteredTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onEdit={onEditTask}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="flex items-end justify-between mb-7">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-title-50">All Tasks</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="primary" onClick={onOpenCreateModal}>
                        + Add task
                    </Button>
                </div>
            </div>
            <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            {renderContent()}
        </>
    )
}