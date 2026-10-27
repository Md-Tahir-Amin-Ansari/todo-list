import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthCard from './AuthCard';

const meta = {
  title: 'Components/Auth/AuthCard',
  component: AuthCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    errorMessage: '',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    errorMessage: '',
  },
};

export const WithError: Story = {
  args: {
    loading: false,
    errorMessage: 'Invalid credentials. Please try again.',
  },
};
