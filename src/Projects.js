import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Paper } from '@mui/material';
import Project from './Project';
import ResourceManagement from "./Resources"; // Assuming you have a separate Project component

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

    // const handleSubmitProject = async () => {
    //     const loggedInUsername = localStorage.getItem('username')
    //   const projectInfo = {
    //     username: loggedInUsername,
    //     name: document.getElementById('name').value,
    //     description: document.getElementById('description').value,
    //     projectId: document.getElementById('projectID').value,
    //   };
    //
    //   await fetch(`/create_project`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ name: projectInfo.name, description: projectInfo.description, projectID: projectInfo.projectId, username: projectInfo.username }),
    //   });
    //
    //   handleClose(); // Close the dialog
    //
    //     await fetch(`/create_project`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ name: projectInfo.name, description: projectInfo.description, projectID: projectInfo.projectId, username: projectInfo.username }),
    //     }).then(response => {
    //     if(response.ok) {
    //       fetchProjects(); // Refresh projects list
    //       handleClose(); // Close the dialog
    //     } else {
    //       console.error('Failed to create project');
    //     }
    //   });
    // };

    const handleSubmitProject = async () => {
        const loggedInUsername = localStorage.getItem('username');
        const projectInfo = {
            username: loggedInUsername,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            projectID: document.getElementById('projectID').value,
        };

        const response = await fetch(`/create_project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectInfo),
        });

        if(response.ok) {
            fetchProjects(); // This ensures the project list is updated immediately after a successful creation
            handleClose(); // Closes the dialog after submission
        } else {
            console.error('Failed to create project');
            // Potentially handle the error more gracefully here, alerting the user to the failure
        }
    };


  const handleJoinLeaveProject = (projectName) => {
    console.log(`${projectName} join/leave clicked`);
    // Logic to handle join/leave
  };


  // Additional state hooks for join project dialog
const [joinOpen, setJoinOpen] = useState(false);
const [projectIdToJoin, setProjectIdToJoin] = useState('');

// Function to handle opening the join project dialog
const handleOpenJoinDialog = () => setJoinOpen(true);

// Function to handle closing the join project dialog
const handleCloseJoinDialog = () => setJoinOpen(false);
  // Function to handle the join project submit action
const handleJoinProjectSubmit = async () => {
    const username = localStorage.getItem('username');
    await fetch('/join_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: projectIdToJoin, username: username }),
    });
    // Assume fetchProjects is a function that fetches updated project list
    fetchProjects();
    setJoinOpen(false);
};

  return (
      <div style={{padding: 20}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <Typography variant="h4">Projects</Typography>
              <div>
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
          <Button variant="outlined" onClick={handleOpenJoinDialog}>Join Project</Button>
          <Dialog open={joinOpen} onClose={handleCloseJoinDialog}>
              <DialogTitle>Join a Project</DialogTitle>
              <DialogContent>
                  <TextField
                      autoFocus
                      margin="dense"
                      id="joinProjectId"
                      label="Project ID"
                      type="text"
                      fullWidth
                      value={projectIdToJoin}
                      onChange={(e) => setProjectIdToJoin(e.target.value)}
                  />
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseJoinDialog}>Cancel</Button>
                  <Button onClick={handleJoinProjectSubmit}>Join</Button>
              </DialogActions>
          </Dialog>
              </div>
          </div>
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'center'
          }}>
              {projects.map((project, index) => (
                  <Project
                      key={index}
                      name={project.projectName}
                      members={project.members}
                  />
              ))}
          </div>
          <ResourceManagement/> {/* Use the Resource Management component */}
      </div>
  );
};

export default Projects;