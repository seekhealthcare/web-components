import React from 'react';

import { Button, CircularProgress } from '@material-ui/core';

import scssStyles from './custom-button.module.scss';

export interface ICustomButtonProps {
  id: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  backgroundColor: string;
  onClick?: () => void;
}

export const CustomButton: React.FC<ICustomButtonProps> = ({
  id,
  disabled = false,
  isSubmitting = false,
  text,
  backgroundColor,
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
            className={backgroundColor}
            disabled={disabled}
            onClick={onClick}
            fullWidth
            endIcon={isSubmitting ? <CircularProgress color="inherit" size="1rem" /> : null}
          >
            {text}
          </Button>
        </div>
        <style jsx>{scssStyles}</style>
      </div>
    </>
  );
};
