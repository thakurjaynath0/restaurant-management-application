import React from 'react';
import MuiAlert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props}>
    <AlertTitle>{props?.title}</AlertTitle>
    {props?.content}
  </MuiAlert>;
});


export default Alert
