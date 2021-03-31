import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export interface ICircularSpinnerProps {
  isLoading: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      zIndex: 1000,
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000000',
      opacity: 0.5,
      position: 'fixed',
      overflow: 'hidden',
      top: '0',
      left: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
);

export const CircularSpinner = (props: ICircularSpinnerProps): JSX.Element | null => {
  const classes = useStyles();
  const isLoading = props.isLoading;

  if (!isLoading) {
    return null;
  }
  return (
    <div className={classes.root}>
      <CircularProgress color="primary" size="8rem" thickness={4} />
    </div>
  );
};
