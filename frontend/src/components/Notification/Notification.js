import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import useNotification from '../../hooks/useNotification';
import {AiFillCloseCircle} from 'react-icons/ai'
import Alert from '../Alert/Alert';

const Notification = ({ id, title, content, type }) => {
    const [open, setOpen] = useState(true);

    const { remove:removeNotification } = useNotification()

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
      removeNotification({ id })
    };
    
    const action = (
      <>
        <IconButton
          size="medium"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
            {/* X */}
          {/* <CloseIcon fontSize="small" /> */}
          <AiFillCloseCircle />
        </IconButton>
      </>
    );
  
    return (
      <div>
        <Snackbar
          open={open}
          anchorOrigin={{
            vertical:"top",
            horizontal:"right"
          }}
          onClose={handleClose}
          action={action}
        >
            <Alert severity={type || 'success'} title={title} content={content} action={action}/>
        </Snackbar>
      </div>
    );
}

export default Notification