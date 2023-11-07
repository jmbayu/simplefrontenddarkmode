import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';

import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const [startDateTime, handleStartDateTimeChange] = useState(null);
  const [endDateTime, handleEndDateTimeChange] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [prettyResponse, setPrettyResponse] = useState(null); // State for pretty-formatted response

  const sendDataToAPI = async () => {
    if (startDateTime && endDateTime) {
      const timestampData = {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:44444/setrange/', timestampData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setResponseMessage('Timestamp sent successfully');
          setPrettyResponse(JSON.stringify(response, null, 2)); // Pretty-format the JSON
        } else {
          setResponseMessage('Failed to send timestamp data');
        }
      } catch (error) {
        setResponseMessage(`An error occurred while sending the data: ${error.message}`);
      }
    } else {
      setResponseMessage('Please select start and end date and time');
    }
  };

const readDataFromAPI = async () => {
  try {
    const response = await axios.get('http://localhost:44444/getrange/');
    if (response.status === 200) {
      setResponseMessage('Data read successfully');
      setPrettyResponse(JSON.stringify(response, null, 2));
    } else {
      setResponseMessage('Failed to read data' + response.statusText);
    }
  } catch (error) {
    setResponseMessage(`Error while reading the data: ${error.message}`);
  }
};

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Button
          variant="contained"
          onClick={readDataFromAPI}
        >
          Read Data
        </Button>
        <br/>
        <br/>
        <MobileDateTimePicker
          label="Start Date and Time"
          ampm={false}
          displayWeekNumber={false}
          value={startDateTime}
          onChange={handleStartDateTimeChange}
          renderInput={(props) => <TextField {...props} />}
        />
        <MobileDateTimePicker
          label="End Date and Time"
          ampm={false}
          displayWeekNumber={true}
          value={endDateTime}
          onChange={handleEndDateTimeChange}
          renderInput={(props) => <TextField {...props} />}
        />
      </LocalizationProvider>
      <br/>
      <Button
       variant="contained"
        disabled={!startDateTime || !endDateTime}
        onClick={sendDataToAPI}
      >
        Send Data
      </Button>
      <br/>

      {responseMessage && <div>{responseMessage}</div>}
      {prettyResponse && (
        <div>
          <pre>{prettyResponse}</pre>
        </div>
      )}
    </div>
    </ThemeProvider>
  );
};

export default App;
