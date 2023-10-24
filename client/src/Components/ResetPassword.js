import { Navigate } from "react-router-dom";
import { Avatar, CssBaseline, Box, Typography, Container, Grid, Link } from '@mui/material';

import ResponsiveBox from "./ResponsiveBox";
import ResetPasswordForm from "./ResetPasswordForm";
import useAuth from '../Hooks/useAuth';
import axios from "../Api/axios";

import { useState, useEffect, useRef } from "react";
import { useParams, Link as Redirect } from "react-router-dom";

const ResetPassword = () => {
    const { auth } = useAuth();
    const params = useParams();
    const [valid, setValid] = useState(null);
    const effectRan = useRef(false);

    const resetPassword = async (data) => {
        return await axios.post("/auth/reset-password", data, {
            headers: {
                "Content-type": "application/json",
            }
        });
    };

    useEffect(() => {
        const validateUrl = async () => {
            try {
                const response = await resetPassword({ token: params?.token, purpose: 0 });
                setValid(response?.status === 203 ? true : false);
            } catch (err) {
                setValid(false);
            }
        };

        if (effectRan.current === true) {
            validateUrl();
        }

        return () => {
            effectRan.current = true;
        };
        //eslint-disable-next-line
    }, []);

    return (
        !auth?.accessToken ?
            (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, width: 64, height: 64 }} src="../logo.png" />
                    </Box>
                    <ResponsiveBox>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: "bold", textAlign: 'center' }}>
                            Reset Password
                        </Typography>
                        {
                            valid !== null ?
                                valid ?
                                    <ResetPasswordForm resetPassword={resetPassword} token={params?.token}></ResetPasswordForm>
                                    : <>
                                        <Typography
                                            mt={3}
                                            component="h2"
                                            variant="h6"
                                            sx={{ textAlign: "center" }}
                                        >
                                            This reset password link is either expired or invalid
                                        </Typography>
                                        <Grid container justifyContent="center" mt={2}>
                                            <Grid item>
                                                <span>
                                                    <Typography variant="body2" display="inline">
                                                        Go back to
                                                    </Typography>
                                                    <Link variant="body2" underline="none" component={Redirect} to="/login" ml={1}>
                                                        Log in
                                                    </Link>
                                                </span>
                                            </Grid>
                                        </Grid>
                                    </>
                                : ""
                        }
                    </ResponsiveBox>
                </Container>)
            : <Navigate to="/" replace />
    );
}

export default ResetPassword