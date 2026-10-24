import { Button } from '../tailgrids/core/button';
import { Checkbox } from '../tailgrids/core/checkbox';
import type { Task } from './TaskModal';

interface TaskItemProps {
    task: Task,
    onToggle: (id: number) => void;
    onEdit: (task: Task) => void;
}
const PRIORITY_CONFIG = {
    high: { label: 'High', color: 'bg-error-500' },
    medium: { label: 'Medium', color: 'bg-warning-500' },
    low: { label: 'Low', color: 'bg-base-400' },
} as const;

export function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
    return (
        <>
            <div className="flex items-start gap-3.5 rounded-2xl border border-base-200 bg-white p-4 shadow-xs transition-colors hover:border-base-300">
                {/* Checkbox */}
                <Checkbox
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    aria-label={`Mark "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                    {/* 1. Title */}
                    <p className={`text-sm font-semibold transition-colors ${task.completed ? 'text-text-200 line-through' : 'text-title-50'
                        }`}>
                        {task.name}
                    </p>

                    {/* 2. Meta row */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-100">
                        {/* Priority Dot */}
                        <div className="flex items-center gap-1.5">
                            <span className={`size-2 rounded-full ${PRIORITY_CONFIG[task.priority].color}`} />
                            <span>{PRIORITY_CONFIG[task.priority].label}</span>
                        </div>

                        {/* Due Date (if present) */}
                        {task.dueDate && (
                            <span>{task.dueDate.toString()}</span>
                        )}

                        {/* Tag Badge (if present) */}
                        {task.tag && (
                            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600">
                                {task.tag}
                            </span>
                        )}
                    </div>
                </div>


                {/* Edit Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="text-text-100 hover:text-title-50"
                >
                    Edit
                </Button>

            </div>


        </>
    )
}
