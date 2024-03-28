import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import Project from './Project'; // Assuming you have a separate Project component

const Projects = () => {
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
        const response = await fetch(`/api/projects/${username}`);
        const data = await response.json();
        setProjects(data.projects); // Set the projects state with fetched data
    };


    useEffect(() => {
        fetchProjects(); // Call the function inside useEffect
    }, []);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmitProject = async () => {
        const loggedInUsername = localStorage.getItem('username')
      const projectInfo = {
        username: loggedInUsername,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        projectId: document.getElementById('projectID').value,
      };

      await fetch(`/create_project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: projectInfo.name, description: projectInfo.description, projectID: projectInfo.projectId, username: projectInfo.username }),
      });

      handleClose(); // Close the dialog

        await fetch(`/create_project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: projectInfo.name, description: projectInfo.description, projectID: projectInfo.projectId, username: projectInfo.username }),
        }).then(response => {
        if(response.ok) {
          fetchProjects(); // Refresh projects list
          handleClose(); // Close the dialog
        } else {
          console.error('Failed to create project');
        }
      });
    };




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
      <div style={{padding: 20}}>
          <Typography variant="h4" gutterBottom>
              Projects
          </Typography>
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'center'
          }}>
              {projects.map((project, index) => (
                  <Project
                      key = {index}
                      name = {project.projectName}
                      hwSet1 = {'50/100'}
                      hwSet2 = {'20/100'}
                      members = {project.members}
                  />
              ))}
          </div>
          <Button variant="outlined" onClick={handleClickOpen}>Create Project</Button>
          <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Create a New Project</DialogTitle>
              <DialogContent>
                  <TextField autoFocus margin="dense" id="name" label="Project Name" type="text" fullWidth/>
                  <TextField margin="dense" id="description" label="Description" type="text" fullWidth/>
                  <TextField margin="dense" id="projectID" label="Project ID" type="text" fullWidth/>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSubmitProject}>Submit</Button>
              </DialogActions>
          </Dialog>
      </div>
  );
};

export default Projects;
