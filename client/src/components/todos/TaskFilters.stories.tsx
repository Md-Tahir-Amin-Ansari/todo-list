import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskFilters } from './TaskFilters';

const meta = {
    title: 'Components/Todos/TaskFilters',
    component: TaskFilters,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    args: {
        searchQuery: '',
        activeFilter: 'all',
        onSearchChange: (query: string) => console.log('Search query changed:', query),
        onFilterChange: (filter) => console.log('Filter changed to:', filter),
    },
} satisfies Meta<typeof TaskFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default filter state showing 'all' selected */
export const Default: Story = {};

/** 'Active' tasks filter selected */
export const FilterActive: Story = {
    args: {
        activeFilter: 'active',
    },
};

/** 'Done' tasks filter selected */
export const FilterDone: Story = {
    args: {
        activeFilter: 'done',
    },
};

/** 'High' priority tasks filter selected */
export const FilterHighPriority: Story = {
    args: {
        activeFilter: 'high',
    },
};

/** With active search query typed in */
export const WithSearchQuery: Story = {
    args: {
        searchQuery: 'Grocery shopping',
        activeFilter: 'all',
    },
};