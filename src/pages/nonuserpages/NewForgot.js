import React, { useState } from 'react'

import {
    Box,
    Button,
    Typography,
    Grid,
    Container,
} from '@mui/material';

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Input from '../../components/Input'
import NavBar from '../../components/navbarcomponent/NavBar'
import NewFooter from '../../components/linkcomponent/NewFooter';

import { Helmet } from 'react-helmet';
import logohelmet from '../../assets/img/png/logoforhelmet.png';

const style = {
    //helper
    marginTopButton: {
        marginTop: 2
    },
    marginStyle: {
        marginTop: 1
    },
    margin: {
        marginTop: {
            xs: -10,
            md: 1
        },
        maxWidth: 700
    },
    section1: {
        padding: "150px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    loginContainer: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
    },
    btnStyle: {
        height: 50,
        width: 200,
        fontSize: 23,
        borderRadius: 100,
        textTransform: 'none',
        marginTop: 3,
        backgroundColor: '#FFBD1F'
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 2,
        marginLeft: 1
    },
    imgContainer: {
        padding: {
            xs: 0,
            sm: 5,
            md: 5
        },
    },
    imgStyle: {
        height: {
            xs: 200,
            sm: 300,
            md: 500,
        },
        width: {
            xs: 300,
            sm: 500,
            md: 700,
        },
    },
}

export default function NewForgot() {

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
        <Container maxWidth disableGutters={true}>
            <Helmet>
                <title>Forgot</title>
                <link rel="Rendezous Icon" href={logohelmet} />
            </Helmet>
            <NavBar />
            <Box sx={style.section1}>
                <Box component={Grid} container justifyContent="center">
                    <Typography sx={{ fontSize: { xs: 30, md: 50 } }}>Forgot Password</Typography>
                </Box>
                <Box sx={style.loginContainer}>
                    <Box sx={style.margin}>
                        <Grid container style={{
                            padding: "150px 80px",
                            marginTop: {
                                xs: 0,
                                md: 30
                            }
                        }} justifyContent='center' spacing={4}>
                            <Grid item xs={12} spacing={3}>
                                <Typography sx={style.textStyle}>Email</Typography>
                                <Input
                                    type='text'
                                    value={values.email}
                                    onChange={handleChange('email')}
                                    name='Email'
                                // errorMessage={error.firstName}
                                />
                            </Grid>
                            <Grid container justifyContent="center">
                                <Button
                                    variant="contained"
                                    // onClick={signup}
                                    onClick={forgotBtn}
                                    sx={style.btnStyle}
                                >
                                    Send Email
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={"assets/img/login_bg.png"}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <NewFooter />
        </Container>
        // <Box sx={style.root}>
        //     <Grid container justifyContent="center">    
        //         <Box sx={style.section1} boxShadow={12}>
        //             <Typography variant="subtitle1" color="textPrimary" sx={style.headingStyle1}>
        //                 Sign in to your Rendezvous Account
        //             </Typography>
        //             <img
        //                 src={logoRendezvous}
        //                 alt="Rendezvous Logo"
        //                 style={{ height: "100px", width: "100px" }}
        //             />
        //             {/* <Button
        //                 variant="outlined"
        //                 startIcon={<GoogleIcon />}
        //                 sx={{ ...style.marginStyle, ...style.btnColor }}
        //                 onClick={btnSignInWithGoogle}
        //             >
        //                 Sign In With Google+
        //             </Button> */}
        //             <Typography
        //                 variant="subtitle1"
        //                 sx={style.marginStyle}
        //             >
        //                 OR
        //             </Typography>
        //             <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
        //                 <TextField
        //                     id="input-with-icon-textfield"
        //                     variant="outlined"
        //                     placeholder="Email Address"
        //                     onChange={handleChange('email')}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <EmailIcon />
        //                             </InputAdornment>
        //                         ),
        //                     }}
        //                     size="medium"
        //                 />
        //             </FormControl>
        //             <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
        //                 <TextField
        //                     id="outlined-adornment-password"
        //                     type={values.showPassword ? 'text' : 'password'}
        //                     value={values.password}
        //                     placeholder="Password"
        //                     onChange={handleChange('password')}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <LockIcon />
        //                             </InputAdornment>
        //                         ),
        //                         endAdornment: (
        //                             <InputAdornment position="end">
        //                                 <IconButton
        //                                     aria-label="toggle password visibility"
        //                                     onClick={handleClickShowPassword}
        //                                     onMouseDown={handleMouseDownPassword}
        //                                     edge="end"
        //                                 >
        //                                     {values.showPassword ? <VisibilityOff /> : <Visibility />}
        //                                 </IconButton>
        //                             </InputAdornment>
        //                         )
        //                     }}
        //                     InputLabelProps={{
        //                         sx: style.labelStyle
        //                     }}
        //                 />
        //             </FormControl>
        //             <Grid container justifyContent='flex-end'>
        //                 <Link to="/forgot" style={{ textDecoration: 'none' }}>
        //                     <Typography
        //                         sx={style.forgotStyle}
        //                     >

        //                         Forgot Password?
        //                     </Typography>
        //                 </Link>
        //             </Grid>
        //             <Button
        //                 variant="outlined"
        //                 startIcon={<ExitToAppIcon />}
        //                 sx={{ ...style.marginStyle, ...style.btnColor }}
        //                 onClick={btnSignIn}
        //             >
        //                 Sign In
        //             </Button>
        //             <Typography
        //                 variant="subtitle1"
        //                 sx={style.marginTopButton}
        //             >

        //                 Don't have an Accoount
        //             </Typography>
        //             <Link to="/register" style={{ textDecoration: 'none' }}>
        //                 <Button
        //                     variant="outlined"
        //                     startIcon={<PersonAddIcon />}
        //                     sx={{ ...style.btnColor, ...style.marginTopButton }}
        //                 >
        //                     Register New Account
        //                 </Button>
        //             </Link>
        //         </Box>
        //     </Grid>
        // </Box>

    )
}
