import { useState } from "react";
import { Link as Redirect, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Typography, Box, Checkbox, TextField, FormControlLabel, FormHelperText, Grid, Button, Link } from "@mui/material";

const initalValues = {
    username: "",
    email: "",
    password: "",
    checkbox: "",
};
const validateOnChange = true;

const SignupForm = ({ signup }) => {
    const [values, setValues] = useState(initalValues);
    const [errors, setErrors] = useState(initalValues);
    const navigate = useNavigate();

    const validate = (fieldValues = values) => {
        let temp = { ...errors };

        if ("username" in fieldValues) {
            temp.username = fieldValues.username ? "" : "This field is required.";
        }
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
            temp.password = fieldValues.password
                ? fieldValues.password.length >= 8
                    ? ""
                    : "Password must be than 8 characters or greater."
                : "This field is required.";
        }
        if ("checkbox" in fieldValues) {
            temp.checkbox = fieldValues.checkbox
                ? ""
                : "You must argee to our Terms & Conditions and Privacy Policy to signup.";
        }
        setErrors({
            ...temp,
        });

        if (fieldValues === values) {
            return Object.values(temp).every((x) => x === "");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                const response = await signup({
                    username: values.username,
                    email: values.email,
                    password: values.password
                });

                Swal.fire({
                    title: "Registered!",
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: "Ok!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login");
                    }
                });
            } catch (err) {
                Swal.fire({
                    title: "Operation Failed!",
                    text: err.response.data.message
                        ? err.response.data.message
                        : err.response.data,
                    icon: "error",
                    confirmButtonText: "Ok!",
                });
                console.log(err);
            }
        }
    };

    const onChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.name === "checkbox" ? event.target.checked : event.target.value,
        });

        if (validateOnChange) {
            validate({ [event.target.name]: event.target.name === "checkbox" ? event.target.checked : event.target.value });
        }
    };

    return (
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            autoComplete="off"
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        onChange={onChange}
                        autoFocus
                        {...(errors.username && { error: true, helperText: errors.username })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={onChange}
                        {...(errors.email && { error: true, helperText: errors.email })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={onChange}
                        {...(errors.password && {
                            error: true,
                            helperText: errors.password,
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                name="checkbox"
                                id="checkbox"
                                onChange={onChange}
                            />
                        }
                        label="By signing up you are agreeing to our Terms & Conditions and Privacy Policy."
                    />
                    <FormHelperText error>{errors.checkbox}</FormHelperText>
                </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
            </Button>
            <Grid container justifyContent="center">
                <Grid item>
                    <span>
                        <Typography variant="body2" display="inline">
                            Already have an account?
                        </Typography> 
                        <Link variant="body2" underline="none" component={Redirect} to="/login" ml={1}>
                            Log in
                        </Link>
                    </span>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SignupForm;