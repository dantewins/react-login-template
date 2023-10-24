import { Navigate } from "react-router-dom";
import { Avatar, CssBaseline, Box, Typography, Container } from '@mui/material';

import ResponsiveBox from "./ResponsiveBox";
import SignupForm from "./SignupForm";
import useAuth from '../Hooks/useAuth';
import axios from "../Api/axios";

const Signup = () => {
    const { auth } = useAuth();

    const signup = async (user) => {
        return await axios.post("/auth/signup", user, {
            headers: {
                "Content-type": "application/json",
            }
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
                        Create your account
                    </Typography>
                    <SignupForm signup={signup}></SignupForm>
                </ResponsiveBox>
            </Container>)
            : <Navigate to="/" replace />
    );
}

export default Signup;