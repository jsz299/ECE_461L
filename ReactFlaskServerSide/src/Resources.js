// Resources.js
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid, Button, TextField, Stack} from '@mui/material';

const ResourceManagement = () => {
  const [hwResources, setHwResources] = useState({
    hwSet1: { capacity: '0', available: '0' },
    hwSet2: { capacity: '0', available: '0' }
  });

  // Function to fetch resource data from the database
  const fetchResources = async () => {
    try {
      const response = await fetch('/get_resources');
      if (response.ok) {
        const data = await response.json();
        setHwResources({
          hwSet1: data.hwSet1,
          hwSet2: data.hwSet2
        });
      } else {
        console.error('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Failed to fetch resources', error);
    }
  };

  // Fetch resources when the component mounts
  useEffect(() => {
    fetchResources();
  }, []);

  const [hwSet1Checkout, setHwSet1Checkout] = useState('');
  const [hwSet1Checkin, setHwSet1Checkin] = useState('');
  const [hwSet2Checkout, setHwSet2Checkout] = useState('');
  const [hwSet2Checkin, setHwSet2Checkin] = useState('');

  // Function to update the hardware set availability after check-in/check-out
const updateResources = async (hwSet, action, quantity) => {
  // Map hwSet to collection names
  const hwSetMapping = {
    'hwSet1': 'Hardware Set 1',
    'hwSet2': 'Hardware Set 2'
  };
  const hwCollectionName = hwSetMapping[hwSet];

  try {
    const response = await fetch(`/api/hardware/${action}/${hwCollectionName}/${quantity}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      fetchResources(); // Refresh resource data
    } else {
      console.error(`Failed to ${action} hardware`);
    }
  } catch (error) {
    console.error('Failed to update resources', error);
  }
};


  return (
      <Paper style={{ margin: '20px', padding: '20px' }}>
    <Typography variant="h5" gutterBottom>Resource Management</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1">HWSet1</Typography>
        <Stack spacing={2}>
          <Typography>Capacity: {hwResources.hwSet1.capacity}</Typography>
          <Typography>Available: {hwResources.hwSet1.available}</Typography>
          <TextField label="Checkout Quantity HWSet1" value={hwSet1Checkout} onChange={e => setHwSet1Checkout(e.target.value)} type="number" fullWidth />
          <Button variant="contained" color="primary" onClick={() => updateResources('hwSet1', 'checkout', hwSet1Checkout)}>Check-out HWSet1</Button>
          <TextField label="Check-in Quantity HWSet1" value={hwSet1Checkin} onChange={e => setHwSet1Checkin(e.target.value)} type="number" fullWidth />
          <Button variant="contained" color="primary" onClick={() => updateResources('hwSet1', 'checkin', hwSet1Checkin)}>Check-in HWSet1</Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1">HWSet2</Typography>
        <Stack spacing={2}>
          <Typography>Capacity: {hwResources.hwSet2.capacity}</Typography>
          <Typography>Available: {hwResources.hwSet2.available}</Typography>
          <TextField label="Checkout Quantity HWSet2" value={hwSet2Checkout} onChange={e => setHwSet2Checkout(e.target.value)} type="number" fullWidth />
          <Button variant="contained" color="primary" onClick={() => updateResources('hwSet2', 'checkout', hwSet2Checkout)}>Check-out HWSet2</Button>
          <TextField label="Check-in Quantity HWSet2" value={hwSet2Checkin} onChange={e => setHwSet2Checkin(e.target.value)} type="number" fullWidth />
          <Button variant="contained" color="primary" onClick={() => updateResources('hwSet2', 'checkin', hwSet2Checkin)}>Check-in HWSet2</Button>
        </Stack>
      </Grid>
    </Grid>
  </Paper>
  );
};

export default ResourceManagement;
