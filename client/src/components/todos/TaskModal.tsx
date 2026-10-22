import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/tailgrids/core/dialog.tsx'
import { Input } from "@/components/tailgrids/core/input";
import { Button } from "../tailgrids/core/button";

interface TaskModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSave: (title: string) => void,
    onDelete?: () => void,
    task?: {
        id: number,
        name: string
    }
}

export function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
    // states
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tag, setTag] = useState('');
    return (
        <>
            <Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogHeader>
                    <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
                </DialogHeader>
                <DialogBody></DialogBody>
            </Dialog>
        </>
    );
}