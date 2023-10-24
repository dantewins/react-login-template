import { useState } from "react";
import { Link as Redirect, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Typography, Box, TextField, Grid, Link, Button } from "@mui/material";

const initalValues = {
    email: ""
};
const validateOnChange = true;

const ForgotPasswordForm = ({ forgotPassword, setLoading }) => {
    const [values, setValues] = useState(initalValues);
    const [errors, setErrors] = useState(initalValues);
    const navigate = useNavigate();

    const onChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });

        if (validateOnChange) {
            validate({ [event.target.name]: event.target.value });
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
                setLoading(true);

                const response = await forgotPassword({
                    email: values.email
                });

                setLoading(false);

                Swal.fire({
                    title: "Sent!",
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: "Ok!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login");
                    }
                });
            } catch (err) {
                setLoading(false);

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

    return(
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            autoComplete="off"
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography
                        component="h2"
                        variant="h6"
                        sx={{ textAlign: "center" }}
                    >
                        Don't worry, just enter your email address associated with your
                        account and you'll be able to get your account back in no time
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={onChange}
                        autoFocus
                        {...(errors.email && { error: true, helperText: errors.email })}
                    />
                </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Send Email
            </Button>
            <Grid container justifyContent="center">
                <Grid item>
                    <span>
                        <Typography variant="body2" display="inline">
                            Clicked by mistake?
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

export default ForgotPasswordForm;