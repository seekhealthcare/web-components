import React from 'react';
import withFormik from 'storybook-formik';

import { storiesOf } from '@storybook/react';

import { InputField } from './input-field';

storiesOf('Input field', module)
  .addDecorator(withFormik)
  .add(
    'text',
    () => (
      <>
        <h3>Text input</h3>
        <InputField name="firstName" placeholder="First Name" />
        <h3>Number input</h3>
        <InputField name="number" type="number" placeholder="Enter your age" />
        <h3>Phone number input</h3>
        <InputField name="tel" type="tel" placeholder="phone number" />
      </>
    ),
    {
      formik: {
        initialValues: {
          firstName: '',
          number: '',
          tel: ''
        }
      }
    }
  );
