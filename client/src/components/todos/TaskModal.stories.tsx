import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskModal } from './TaskModal';

const meta = {
    title: 'Components/Todos/TaskModal',
    component: TaskModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        isOpen: true,
        onClose: () => console.log('Closed modal'),
        onSave: (payload) => console.log('Save payload:', payload),
        onDelete: () => console.log('Delete requested'),
    },
} satisfies Meta<typeof TaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Modal opened in Create mode to add a new task */
export const CreateTask: Story = {
    args: {
        isOpen: true,
        task: undefined,
    },
};

/** Modal opened in Edit mode with existing task details pre-filled */
export const EditTask: Story = {
    args: {
        isOpen: true,
        task: {
            id: 101,
            name: 'Prepare quarterly sprint review presentation',
            priority: 'high',
            completed: false,
            tag: 'work',
            dueDate: '2026-11-20' as any,
        },
    },
};