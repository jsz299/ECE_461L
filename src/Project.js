import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Typography, Box } from '@mui/material';

const Project = ({ name, members, onJoinLeave }) => {
  const [joined, setJoined] = useState(false);


  const handleJoinLeave = () => {
    setJoined(!joined);
    onJoinLeave(name);
  };

  return (
    <Card variant="outlined" sx={{ margin: 2 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Use Box components to group items and apply flex as needed */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          {/* Map over the members array to list each member */}
          {members.map((member, index) => (
            <Typography key={index} color="text.secondary">
              {member}
            </Typography>
          ))}
        </Box>

        {/*<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>*/}
        {/*  <Typography variant="body2">*/}
        {/*    HWSet1: {hwSet1}*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="body2">*/}
        {/*    HWSet2: {hwSet2}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}

        {/*<Button*/}
        {/*  variant="contained"*/}
        {/*  color={joined ? "secondary" : "primary"}*/}
        {/*  onClick={handleJoinLeave}*/}
        {/*>*/}
        {/*  {joined ? "Leave" : "Join"}*/}
        {/*</Button>*/}
      </CardContent>
    </Card>
  );
};

export default Project;
