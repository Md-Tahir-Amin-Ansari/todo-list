import type { ReactNode } from "react";
import { Button } from "../tailgrids/core/button";

interface EmptyStateProps {
    badge?: string | ReactNode;       // e.g. "0" or "404" or an icon
    title: string;                    // e.g. "No tasks yet"
    description: string;              // e.g. "Add your first task and it will show up here."
    actionLabel?: string;             // e.g. "+ Add task"
    onAction?: () => void;
}
export function EmptyState({ badge, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            {/* 1. Big badge (e.g. "0" or "404") */}
            {badge && (
                <div className="text-6xl font-extrabold tracking-tight text-text-300 mb-2 select-none">
                    {badge}
                </div>
            )}
            {/* 2. Heading */}
            <h2 className="text-xl font-bold text-title-50 mb-2">
                {title}
            </h2>
            {/* 3. Description (constrained width for nice multi-line wrapping) */}
            <p className="text-sm text-text-100 max-w-xs mb-6">
                {description}
            </p>
            {/* 4. Action button */}
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}