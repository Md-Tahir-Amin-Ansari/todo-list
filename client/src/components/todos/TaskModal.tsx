import { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/tailgrids/core/dialog.tsx'
import { Input } from "@/components/tailgrids/core/input";
import { Button } from "../tailgrids/core/button";
import { Label } from "../tailgrids/core/label";
import { Select, SelectContent, SelectIndicator, SelectItem, SelectTrigger, SelectValue } from "../tailgrids/core/select";
import { DatePicker, DatePickerGroup, DatePickerPopover, DatePickerTrigger } from "../tailgrids/core/date-picker";
import { DateInput, DateSegment } from "react-aria-components";
import type { DateValue } from "react-aria-components";
import { FieldLabel } from "../tailgrids/core/field";
import { ButtonGroup } from "@/components/tailgrids/core/button-group";
import { z } from "zod";

const taskSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Title is required"),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    tag: z.string().optional(),
    dueDate: z.any().nullable().optional(),
});
export type TaskInput = z.infer<typeof taskSchema>;

export interface Task {
    id: number;
    name: string;
    priority: "high" | "medium" | "low";
    dueDate?: DateValue | null;
    tag?: string | null;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: TaskInput) => void;
    onDelete?: () => void;
    task?: Task;
}


export function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
    // states
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState<DateValue | null>(null);
    const [tag, setTag] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // sync for when open
    useEffect(() => {
        if (task) {
            setName(task.name);
            setPriority(task.priority);
            setDueDate(task.dueDate);
            setTag(task.tag);
            setErrorMessage(null);

        } else {
            setName('');
            setPriority('medium');
            setDueDate(null);
            setTag('');
            setErrorMessage(null);

        }
    }, [task, isOpen]);


    // handle submit and validation
    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const result = taskSchema.safeParse({
            name,
            priority,
            tag,
            dueDate,
        });
        if (!result.success) {
            // Grab the first validation error message
            const firstError = result.error.issues[0]?.message ?? "Invalid input";
            setErrorMessage(firstError);
            return;
        }
        // Clear errors & proceed
        setErrorMessage(null);
        onSave(result.data);
        onClose();
    }

    return (
        <>
            <Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogHeader>
                    <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
                </DialogHeader>
                <DialogBody className="space-y-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Task Title</FieldLabel>
                        <Input id="task-title" placeholder="What needs doing?" value={name} onChange={(e) => setName(e.target.value)} />
                        {errorMessage && (
                            <p className="text-xs text-error-500 font-medium">{errorMessage}</p>
                        )}
                    </div>
                    {/* Due Date */}
                    <div className="flex flex-col gap-1.5">
                        <DatePicker value={dueDate} onChange={setDueDate}>
                            <FieldLabel>Due Date</FieldLabel>
                            <DatePickerGroup>
                                <DateInput className="flex w-full rounded-lg border border-base-300 bg-input-background px-4 py-2.5 text-title-50 outline-none focus-within:ring-2 focus-within:ring-primary-500">
                                    {segment => <DateSegment segment={segment} className="rounded px-0.5 outline-none focus:bg-primary-500 focus:text-white" />}
                                </DateInput>

                                <DatePickerTrigger />
                            </DatePickerGroup>
                            <DatePickerPopover />
                        </DatePicker>
                    </div>
                    {/* Priority */}
                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Priority</FieldLabel>
                        <ButtonGroup className="w-full">
                            {(['high', 'medium', 'low'] as const).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setPriority(level)}
                                    className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${priority === level
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-transparent text-text-50 hover:bg-base-100'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </ButtonGroup>

                    </div>
                    {/* Tag */}
                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Tag</FieldLabel>
                        <Select
                            value={tag}
                            onChange={(val) => setTag(String(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                                <SelectIndicator />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem id="work">Work</SelectItem>
                                <SelectItem id="personal">Personal</SelectItem>
                                <SelectItem id="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter className="flex justify-between items-center">
                    {task && onDelete ? (
                        <Button variant="danger" appearance="outline" onClick={onDelete}>
                            Delete
                        </Button>
                    ) : <div />}

                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {task ? "Save changes" : "Add task"}
                        </Button>
                    </div>
                </DialogFooter>

            </Dialog>
        </>
    );
}