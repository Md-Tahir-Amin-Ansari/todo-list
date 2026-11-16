import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthCard from './AuthCard';

const meta = {
  title: 'Components/Auth/AuthCard',
  component: AuthCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: (data, isSignUp) => console.log('Submitted:', data, 'isSignUp:', isSignUp),
  },
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default Sign-up state */
export const Default: Story = {};
/** When authentication request is in flight */
export const Loading: Story = {
  args: {
    loading: true,
  },
};
/** When backend returns an authentication error */
export const WithError: Story = {
  args: {
    errorMessage: 'Invalid username or password. Please try again.',
  },
};