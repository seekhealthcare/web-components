import * as React from 'react';

import { Meta, Story } from '@storybook/react/types-6-0';

import { CustomButton, ICustomButtonProps } from './custom-button';

import './custom-button.scss';

export default {
  title: 'Button',
  component: CustomButton,
  description: `A button.`,
  argTypes: {
    className: { control: 'text' },
    text: { control: 'text' },
    disabled: { control: 'boolean' },
    id: { control: 'text' }
  }
} as Meta;

const Template: Story<ICustomButtonProps> = (args) => <CustomButton {...args} text="Click me" />;

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

export const CustomBackground = Template.bind({});
CustomBackground.args = {
  className: 'secondary-light'
};

export const CustomText = Template.bind({});
CustomText.args = {
  text: 'Custom Text'
};
