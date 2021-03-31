import * as React from 'react';

import { Meta, Story } from '@storybook/react/types-6-0';

import { CircularSpinner, ICircularSpinnerProps } from './circular-spinner';

export default {
  title: 'Circular Spinner',
  component: CircularSpinner,
  description: `A circular spinner.`,
  argTypes: {
    isLoading: { control: 'boolean' }
  }
} as Meta;

const Template: Story<ICircularSpinnerProps> = (args) => <CircularSpinner {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true
};
