import React, { useState } from 'react';

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';

const style = {
    //helper,
    marginTop: {
        marginTop: 3
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: 'center'
    },
    formContainer: {
        padding: 3
    },
    titleStyle: {
        fontSize: 25,
        fontWeight: 450
    },
    buttonRecover: {
        backgroundColor: (theme) => theme.colors.colorsuccess,
        color: (theme) => theme.colors.textColor,
        "&:hover": {
            backgroundColor: (theme) => theme.colors.colorsuccess,
            color: (theme) => theme.colors.textColor,
        }
    },
    backBtn: {
        padding: 2
    }

}

export default function Forgot() {

    const [values, setValues] = useState({
        email: ''
    })

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const forgotBtn = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, values.email)
            .then(() => {
                // Password reset email sent!
                // ..
                alert("Password reset email sent!");
                values.email('');
            })
            .catch((error) => {
                const errorMessage = error.message;
                // ..
                alert(errorMessage);
            })
    }

    return (
        <Box sx={style.container}>
            <Grid boxShadow={12} sx={style.formContainer} >
                <Grid container justifyContent="center">
                    <Typography sx={style.titleStyle}>Forgot Your Rendezvous Account</Typography>
                </Grid>
                <Grid container justifyContent="flex-start ">
                    <Typography variant="capstion" sx={style.marginTop}>Enter Your Email to Recover your Account</Typography>
                </Grid>
                <Grid container justifyContent="center">
                    <TextField
                        placeholder="Enter email"
                        onChange={handleChange('email')}
                        sx={style.marginTop}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                        size="medium"

                    />
                </Grid>
                <Grid container justifyContent="center">
                    <Button
                        variant="outlined"
                        sx={{ ...style.marginTop, ...style.buttonRecover }}
                        fullWidth
                        onClick={forgotBtn}
                    >
                        Recover
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
