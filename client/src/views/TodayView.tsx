import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { ProgressRing } from "@/components/todos/ProgressRing";
import { TaskItem } from "@/components/todos/TaskItem";
import type { TodayViewProps } from "@/types";

export default function TodayView({ tasks, tasksLoading, onToggleTask, onEditTask, onOpenCreateModal }: TodayViewProps) {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const dateFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const overdueTasks = tasks.filter(
        (t) => t.dueDate && t.dueDate.toString().split('T')[0] < todayIso && !t.completed
    );
    const todayIso = new Date().toISOString().split('T')[0];
    const dueTodayTasks = tasks.filter(
        (t) => !t.dueDate || t.dueDate.toString().split('T')[0] >= todayIso
    );

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
                            <p className="text-sm text-text-200">Nothing due today.</p>
                        ) : (
                            <div className="space-y-2">
                                {dueTodayTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} onToggle={onToggleTask} onEdit={onEditTask} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>

    )
}