import { Navigate } from "react-router-dom";
import { Avatar, CssBaseline, Box, Typography, Container, Divider, Button } from '@mui/material';

import ResponsiveBox from "./ResponsiveBox";
import LoginForm from './LoginForm';
import useAuth from '../Hooks/useAuth';
import axios from "../Api/axios";

const Login = () => {
    const { auth } = useAuth();

    const login = async (user) => {
        return await axios.post("/auth/login", user, {
            headers: {
                "Content-type": "application/json"
            },
            withCredentials: true
        });
    };

    return (
        !auth?.accessToken ?
            (<Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, width: 64, height: 64 }} src="logo.png" />
                </Box>
                <ResponsiveBox>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", textAlign: 'center' }}>
                        Welcome back
                    </Typography>
                    <LoginForm login={login}></LoginForm>
                </ResponsiveBox>
                <Divider light sx={{ marginTop: 2, fontSize: 13 }}>OR</Divider>
                <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="outlined" fullWidth>Continue with Google</Button>
                </Box>
            </Container>)
            : <Navigate to="/" replace />
    );
}

export default Login;