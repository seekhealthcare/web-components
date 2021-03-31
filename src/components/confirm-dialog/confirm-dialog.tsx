import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export interface IDialogProps {
  onClose: () => void;
  messageSent: boolean;
  open: boolean;
}

export const ConfirmDialog: React.FC<IDialogProps> = ({ open, messageSent, onClose }) => {
  return (
    <>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle id="alert-dialog-title">{messageSent ? 'Thanks for connecting!' : 'Oops'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageSent
              ? ''
              : 'We were unable to submit your information. We apologize for the inconvenience. Please try again later.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialog;
