import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/tailgrids/core/dialog.tsx'
import { Input } from "@/components/tailgrids/core/input";
import { Button } from "../tailgrids/core/button";

interface TaskModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSave: (title: string) => void,
    onDelete?: () => void
}

export function TaskModal({ isOpen, onClose, onSave, onDelete }: TaskModalProps) {
    // states
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tag, setTag] = useState('');
    return (
        <>
            <Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogBody></DialogBody>
            </Dialog>
        </>
    );
}