import { useState } from "react";
import { Link as Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { Typography, Box, TextField, Button, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const initalValues = {
    password: "",
    cPassword: ""
};
const validateOnChange = true;

const ResetPasswordForm = ({ resetPassword, token }) => {
    const navigate = useNavigate();

    const [values, setValues] = useState(initalValues);
    const [errors, setErrors] = useState(initalValues);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                const response = await resetPassword({
                    password: values.password,
                    token: token,
                    purpose: 1
                });

                Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: "Ok!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login");
                    }
                });
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

        if ("password" in fieldValues) {
            temp.password = fieldValues.password
                ? fieldValues.password.length >= 8
                    ? fieldValues.password === fieldValues.cPassword ? "" : "Passwords must be equal"
                    : "Password must be than 8 characters or greater."
                : "This field is required.";
        }
        if ("cPassword" in fieldValues) {
            temp.cPassword = fieldValues.cPassword
                ? fieldValues.cPassword.length >= 8
                    ? fieldValues.cPassword === fieldValues.password ? "" : "Passwords must be equal"
                    : "Password must be than 8 characters or greater."
                : "This field is required.";
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
            if (event.target.name === "password") {
                validate({ password: event.target.value, cPassword: values.cPassword });
            } else if (event.target.name === "cPassword") {
                validate({ password: values.password, cPassword: event.target.value });
            }
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
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={onChange}
                value={values.password}
                autoFocus
                {...(errors.password && { error: true, helperText: errors.password })}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="cPassword"
                label="Confirm Password"
                type="password"
                id="cPassword"
                onChange={onChange}
                value={values.cPassword}
                {...(errors.cPassword && { error: true, helperText: errors.cPassword })}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                Reset Password
            </Button>
            <Grid container justifyContent="center">
                <Grid item>
                    <span>
                        <Typography variant="body2" display="inline">
                            Remember your password?
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

export default ResetPasswordForm;