import React from 'react';

import { Button, CircularProgress } from '@material-ui/core';

import './custom-button.scss';

export interface ICustomButtonProps {
  id: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className: string;
  onClick?: () => void;
}

export const CustomButton: React.FC<ICustomButtonProps> = ({
  id,
  disabled = false,
  isSubmitting = false,
  text,
  className,
  type = 'button',
  onClick
}) => {
  return (
    <>
      <div>
        <div className="custom-button">
          <Button
            id={id}
            type={type}
            className={className}
            disabled={disabled}
            onClick={onClick}
            fullWidth
            endIcon={isSubmitting ? <CircularProgress color="inherit" size="1rem" /> : null}
          >
            {text}
          </Button>
        </div>
      </div>
    </>
  );
};
