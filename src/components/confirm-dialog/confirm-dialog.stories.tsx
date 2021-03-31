import * as React from 'react';

import { Meta, Story } from '@storybook/react/types-6-0';

import { ConfirmDialog, IDialogProps } from './confirm-dialog';

export default {
  title: 'Confirm Dialog',
  component: ConfirmDialog,
  description: `A confirm dialog.`,
  argTypes: {
    open: { control: 'boolean' },
    messageSent: { control: 'boolean' }
  }
} as Meta;

const Template: Story<IDialogProps> = (args) => <ConfirmDialog {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Open = Template.bind({});
Open.args = {
  open: true
};

export const MessageSent = Template.bind({});
MessageSent.args = {
  messageSent: true
};

export const OnClose = Template.bind({});
OnClose.args = {
  onClose: () => alert('Dialog was closed!')
};
