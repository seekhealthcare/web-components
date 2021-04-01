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
        <InputField name="firstName" placeholder="Text input" />
        <InputField name="number" type="number" placeholder="Number input" />
        <InputField name="tel" type="tel" placeholder="phone number input" />
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
