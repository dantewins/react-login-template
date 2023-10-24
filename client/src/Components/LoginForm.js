import { useState } from "react";
import { Link as Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import { Typography, Box, TextField, Button, Grid, Link } from "@mui/material";

const initalValues = {
    email: "",
    password: ""
};
const validateOnChange = true;

const LoginForm = ({ login }) => {
    const { setAuth } = useAuth();
    const [values, setValues] = useState(initalValues);
    const [errors, setErrors] = useState(initalValues);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                const response = await login({
                    email: values.email,
                    password: values.password
                });

                if (response.data?.accessToken) {
                    setAuth({
                        role: response.data.role,
                        username: response.data.username,
                        accessToken: response.data.accessToken
                    });
                }
            } catch (err) {
                if (err.response) {
                    Swal.fire({
                        title: "Operation Failed!",
                        text: err.response.data.message ? err.response.data.message : err.response.data,
                        icon: "error",
                        confirmButtonText: "Ok!",
                    });
                }
            }
        }
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors };

        if ("email" in fieldValues) {
            temp.email = fieldValues.email
                ? /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
                    fieldValues.email
                )
                    ? ""
                    : "This email is not valid."
                : "This field is required.";
        }
        if ("password" in fieldValues) {
            temp.password = fieldValues.password ? "" : "This field is required.";
        }
        setErrors({
            ...temp,
        });

        if (fieldValues === values) {
            return Object.values(temp).every((x) => x === "");
        }
    };

    const onChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });

        if (validateOnChange) {
            validate({ [event.target.name]: event.target.value });
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            autoComplete="off"
        >
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={onChange}
                value={values.email}
                autoFocus
                {...(errors.email && { error: true, helperText: errors.email })}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={onChange}
                value={values.password}
                {...(errors.password && { error: true, helperText: errors.password })}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                Login
            </Button>
            <Grid container justifyContent="center">
                <Grid item>
                    <span>
                        <Typography variant="body2" display="inline">
                            Don't have an account?
                        </Typography>
                        <Link variant="body2" underline="none" component={Redirect} to="/sign-up" ml={1}>
                            Sign up
                        </Link>
                    </span>
                </Grid>
                <Grid item mt={1}>
                    <span>
                        <Typography variant="body2" display="inline">
                            Forgot your password?
                        </Typography>
                        <Link variant="body2" underline="none" component={Redirect} to="/forgot-password" ml={1}>
                            Click here
                        </Link>
                    </span>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginForm;