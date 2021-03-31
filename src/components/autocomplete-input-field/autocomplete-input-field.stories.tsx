import React from 'react';
import withFormik from 'storybook-formik';

import { storiesOf } from '@storybook/react';

import { AutocompleteInputField } from './autocomplete-input-field';

storiesOf('Autocomplete input field', module)
  .addDecorator(withFormik)
  .add(
    'text',
    () => (
      <AutocompleteInputField
        name="address"
        id="autocomplete"
        placeholder="Street address, city, state"
        getAddressInfo={() => alert('Getting address info')}
      />
    ),
    {
      formik: {
        initialValues: {
          address: ''
        }
      }
    }
  );
