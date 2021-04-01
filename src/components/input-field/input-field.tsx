import { useField } from 'formik';
import React, { ChangeEvent, ReactElement } from 'react';
import InputMask, { Props } from 'react-input-mask';

import { TextField, TextFieldProps } from '@material-ui/core';

import './input-field.scss';

export interface IInputFieldProps {
  name: string;
  placeholder?: string;
  type?: 'number' | 'text' | 'tel';
  id?: string;
}

export const InputField: React.FC<IInputFieldProps> = ({ name, placeholder, type = 'text' }) => {
  const [field, meta, helpers] = useField(name);
  const error = meta.touched ? meta.error : '';

  const handleChange = (event: ChangeEvent): void => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue((event.target as HTMLInputElement).value);
  };

  const errorBlock = (): ReactElement => (
    <div className="error-container">
      <span className="error-text">{error}</span>
    </div>
  );

  if (type === 'tel') {
    return (
      <>
        <InputMask mask="(999)999-9999" value={field.value} onChange={handleChange}>
          {(inputProps: Props & TextFieldProps) => (
            <div className="custom-text-field">
              <TextField {...inputProps} name={name} placeholder={placeholder} error={Boolean(meta.error)} type="tel" />
            </div>
          )}
        </InputMask>
        {errorBlock()}
      </>
    );
  }

  return (
    <>
      <div className="custom-text-field">
        <TextField
          name={name}
          type={type}
          placeholder={placeholder}
          error={Boolean(meta.error)}
          onChange={handleChange}
          value={field.value}
        />
      </div>
      {errorBlock()}
    </>
  );
};
