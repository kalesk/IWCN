import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles, TextField, Button, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to top, #cbb4d4, #20002c)',
    padding: theme.spacing(4),
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  responseContainer: {
    marginTop: theme.spacing(4),
    width: '100%',
    maxWidth: '400px',
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
  },
  accordion: {
    width: '100%',
  },
}));

const App = () => {
  const classes = useStyles();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState('');
  const [headers, setHeaders] = useState(null);
  const [statusCode, setStatusCode] = useState(null); 
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError(true);
      return;
    }

    if (submittedData.find(item => item.phoneNumber === phoneNumber)) {
      alert("Phone number already submitted!");
      return;
    }

    try {
      const response = await axios.post('https://chimpu.xyz/api/post.php', { phonenumber: phoneNumber });
      setHeaders(response.headers);
      setStatusCode(response.status);
      setSubmittedPhoneNumber(phoneNumber);
      setPhoneNumberError(false);
      setOpen(true);
      setSubmittedData([...submittedData, { phoneNumber, headers: response.headers }]);
    } catch (error) {
      console.error('Error posting data', error);
    }
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    return phonePattern.test(phone);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneNumberError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setPhoneNumber('');
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.formContainer}>
        <Typography variant="h5" gutterBottom>
          Enter Phone Number
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.input}
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Phone Number"
            fullWidth
            error={phoneNumberError}
            helperText={phoneNumberError ? 'Invalid phone number' : ''}
            InputProps={{
              endAdornment: phoneNumberError && (
                <Typography color="error">Invalid</Typography>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
        <Button onClick={handleReset} color="secondary" fullWidth>
          Reset
        </Button>
      </Paper>
      {submittedData.length > 0 && (
        <div className={classes.responseContainer}>
          {submittedData.map((data, index) => (
            <Accordion key={index} className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1"><strong>Phone Number:</strong> {data.phoneNumber}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography variant="h5" gutterBottom style={{ marginTop: '1.5rem' }}>
                    Response Headers
                  </Typography>
                  <pre>{data.headers ? JSON.stringify(data.headers, null, 2) : "No headers"}</pre>
                  <Typography variant="h5" gutterBottom style={{ marginTop: '1.5rem' }}>
                    Status Code: {statusCode}
                  </Typography>
                  <IconButton onClick={() => handleDelete(index)} aria-label="delete" color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Submitted Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {submittedPhoneNumber}
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: '1.5rem' }}>
            Response Headers
          </Typography>
          <pre>{headers ? JSON.stringify(headers, null, 2) : "No headers"}</pre>
          <Typography variant="h5" gutterBottom style={{ marginTop: '1.5rem' }}>
            Status Code: {statusCode}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
