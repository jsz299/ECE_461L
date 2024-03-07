import React from 'react';
import { Typography } from '@mui/material';
import Project from './Project'; // Assuming you have a separate Project component

const Projects = () => {
  // Dummy data for demonstration purposes
  const projectsData = [
    { name: "Project Name 1", hwSet1: "50/100", hwSet2: "0/100" },
    { name: "Project Name 2", hwSet1: "50/100", hwSet2: "0/100" },
    { name: "Project Name 3", hwSet1: "0/100", hwSet2: "0/100" },
  ];

  const handleJoinLeaveProject = (projectName) => {
    console.log(`${projectName} join/leave clicked`);
    // Logic to handle join/leave
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {projectsData.map((project, index) => (
          <Project
            key={index}
            name={project.name}
            hwSet1={project.hwSet1}
            hwSet2={project.hwSet2}
            onJoinLeave={handleJoinLeaveProject}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
