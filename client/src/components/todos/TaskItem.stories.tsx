import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskItem } from './TaskItem';

const meta = {
    title: 'Components/Todos/TaskItem',
    component: TaskItem,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    args: {
        onToggle: (id: number) => console.log('Toggled task:', id),
        onEdit: (task) => console.log('Edit task:', task),
    },
} satisfies Meta<typeof TaskItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard active task */
export const Default: Story = {
    args: {
        task: {
            id: 1,
            name: 'Review quarterly architecture plan',
            priority: 'medium',
            completed: false,
            tag: 'work',
        },
    },
};

/** High priority task with tag and due date */
export const HighPriority: Story = {
    args: {
        task: {
            id: 2,
            name: 'Fix critical database deadlock in production',
            priority: 'high',
            completed: false,
            dueDate: '2026-11-16' as any,
            tag: 'work',
        },
    },
};

/** Low priority task */
export const LowPriority: Story = {
    args: {
        task: {
            id: 3,
            name: 'Water the office plants',
            priority: 'low',
            completed: false,
            tag: 'personal',
        },
    },
};

/** Completed task displaying strikethrough styling */
export const Completed: Story = {
    args: {
        task: {
            id: 4,
            name: 'Submit monthly expense report',
            priority: 'medium',
            completed: true,
            tag: 'work',
        },
    },
};