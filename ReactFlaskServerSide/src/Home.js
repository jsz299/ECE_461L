import './Home.css';
import { Container, TextField, Button, Typography, Grid } from "@mui/material";
import React, { useState } from "react";


function Home() {
// Initialize state
    const [loginUserID, setLoginUserID] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [username, setUsername] = useState('');
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // Login logic here
    };


    // Handlers for updating the state based on user input
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleUserIDChange = (e) => setUserID(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Handler for pressing submit
    const handleSubmit = async (e) => {
        // Prevent form from actually submitting without a chance to validate or process input before submitting it to the server
        e.preventDefault(); 

        // Combine user input into a single object
        const userInfo = {
            username,
            userID,
            password,
        };

        // Send the information to the Flask API
        const response = await fetch('/createaccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });

        const data = await response.json();
        // Handle the response data as needed
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>Login</Typography>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={loginUserID}
                            onChange={(e) => setLoginUserID(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary">Login</Button>
                    </form>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>Create Account</Typography>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={userID}
                            onChange={handleUserIDChange}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;

// Below is example code from Professor 

// function Home() {
//     const [firstName, setFirstName] = useState("")
//     const [lastName, getLastName] = useState("")
//
//     const onClick = async(e) => {
//
//     console.log("Button was clicked")
//
//     const requestOptions = {
//         method: "GET"
//     }
//
//
//
//         await fetch("/firstname/", {
//             method: "POST",
//             headers: {"Content-Type" : "application/json"},
//             //mode: "cors",
//             body: JSON.stringify({'firstname':firstName})
//         })
//
//     await fetch("/lastname/", requestOptions)
//         .then(response => response.json())
//         .then(data => getLastName(data.lastname))
//         .then(console.log(lastName));
//     }


//   return (
//     <div className="Home">
//         <h2>Name Finder</h2>
//         <label>
//             Please enter my first name:
//             <br />
//             <input value={firstName} name="firstName" onChange={e => setFirstName(e.target.value)} />
//             <button onClick={onClick}>Submit</button>
//         </label>
//
//         <br />
//
//         <p><strong>{lastName}</strong></p>
//     </div>
//   );
// }