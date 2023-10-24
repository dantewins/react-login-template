import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, CssBaseline, Box, Typography, Container, CircularProgress, Modal } from '@mui/material';

import ResponsiveBox from "./ResponsiveBox";
import ForgotPasswordForm from "./ForgotPasswordForm";
import useAuth from '../Hooks/useAuth';
import axios from "../Api/axios";

const ForgotPassword = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);

    const forgotPassword = async (user) => {
        return await axios.post("/auth/forgot-password", user, {
            headers: {
                "Content-type": "application/json",
            }
        });
    };

    return (
        !auth?.accessToken ?
            (<>
                <Modal open={loading}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        textAlign: "center"
                    }}>
                        <CircularProgress size={100} />
                    </Box>
                </Modal>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, width: 64, height: 64 }} src="logo.png" />
                    </Box>
                    <ResponsiveBox>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", textAlign: 'center' }}>
                            Forgot Password
                        </Typography>
                        <ForgotPasswordForm forgotPassword={forgotPassword} setLoading={setLoading}></ForgotPasswordForm>
                    </ResponsiveBox>
                </Container>
            </>)
            : <Navigate to="/" replace />
    );
}

export default ForgotPassword