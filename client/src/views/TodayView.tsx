import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { ProgressRing } from "@/components/todos/ProgressRing";
import { TaskItem } from "@/components/todos/TaskItem";
import { EmptyState } from "@/components/layout/EmptyState";
import { Calendar } from "@tailgrids/icons";
import type { TodayViewProps } from "@/types";

export default function TodayView({ tasks, tasksLoading, onToggleTask, onEditTask, onOpenCreateModal }: TodayViewProps) {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const dateFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const todayIso = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(
        (t) => t.dueDate && t.dueDate.toString().split('T')[0] < todayIso && !t.completed
    );

    const dueTodayTasks = tasks.filter((t) => {
        if (!t.dueDate) return false; // undefined dueDate does not belong in "Due today"
        const taskDate = t.dueDate.toString().split('T')[0];
        return taskDate === todayIso;
    }
    );
    const renderContent = () => {
        if (overdueTasks.length === 0 && dueTodayTasks.length === 0) {
            if (tasks.length === 0) {
                return (
                    <EmptyState
                        badge="0"
                        title="No tasks yet"
                        description="Get started by adding your first task for today."
                        actionLabel="+ Add task"
                        onAction={onOpenCreateModal}
                    />
                )
            } else {
                return (
                    <EmptyState
                        badge="✓"
                        title="All caught up!"
                        description="You have no pending tasks for today. Relax or plan ahead."
                        actionLabel="+ Add task"
                        onAction={onOpenCreateModal}
                    />
                )

            }
        } else {
            return (
                <div className="space-y-6">
                    {overdueTasks.length > 0 && (
                        <div className="space-y-2.5">
                            <h2 className="text-sm font-bold text-error-500">Overdue</h2>
                            <div className="space-y-2">
                                {overdueTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2.5">
                        <h2 className="text-sm font-bold text-text-100">Due today</h2>
                        {dueTodayTasks.length === 0 ? (
                            <EmptyState
                                badge={
                                    <div className="flex size-12 items-center justify-center rounded-full bg-base-100 dark:bg-base-900 text-text-200">
                                        <Calendar className="size-6" />
                                    </div>
                                }
                                title="Nothing due today"
                                description="All clear for the rest of today!"
                            />
                        ) : (
                            <div className="space-y-2">
                                {dueTodayTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            <div className="flex items-end justify-between mb-7">
                <div>
                    <div className="text-sm font-medium text-text-200">{dateFormatted}</div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-title-50">Today</h1>
                </div>
                <div className="flex items-center gap-4">
                    <ProgressRing completed={completedCount} total={totalCount} />
                    <Button variant="primary" onClick={onOpenCreateModal}>
                        + Add task
                    </Button>
                </div>
            </div>
            {tasksLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="md" />
                </div>
            ) : (
                renderContent()
            )}
        </>

    )
}