import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta = {
    title: 'Components/Layout/EmptyState',
    component: EmptyState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onAction: () => console.log('Empty state action triggered'),
    },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Initial state when user has no tasks in their list */
export const NoTasksYet: Story = {
    args: {
        badge: '0',
        title: 'No tasks yet',
        description: 'Get started by creating your very first task for today.',
        actionLabel: '+ Add task',
    },
};

/** Celebratory state when all daily tasks are finished */
export const AllCaughtUp: Story = {
    args: {
        badge: '✓',
        title: 'All caught up!',
        description: 'You have no pending tasks for today. Relax or plan ahead.',
        actionLabel: '+ Add task',
    },
};

/** Informational state without a call-to-action button */
export const Informational: Story = {
    args: {
        title: 'Nothing due today',
        description: 'All clear for the rest of today!',
    },
};