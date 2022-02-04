import React, { useState } from 'react'

import {
    Box,
    Typography,
    Grid,
    Switch,
    FormControlLabel,
    InputAdornment,
    IconButton,
    Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { createUser, getDocsByCollection, createDoc } from '../../utils/firebaseUtil'

import Container from '@mui/material/Container';
import Input from '../../components/Input';
// import {validPhone} from '../../utils/validations'

import NavBar from '../../components/navbarcomponent/NavBar'
import NewFooter from '../../components/linkcomponent/NewFooter';
import { loginInitiate, loginSuccess, registerInitiate } from '../../redux/actions/userAction';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


import { Helmet } from 'react-helmet';
import logohelmet from '../../assets/img/png/logoforhelmet.png';

import Stack from '@mui/material/Stack';
// import MuiAlert from '@mui/material/Alert';

import Snackbar from '@mui/material/Snackbar';

const style = {
    marginTopButton: {
        marginTop: 3
    },
    marginStyle: {
        marginTop: 1
    },
    root: {
        padding: "80px 20px",
    },
    menuLink: {
        fontSize: "1.2rem",
        marginLeft: 2,
        "&:hover": {
            color: theme => theme.palette.secondary.main,
        }
    },
    section1: {
        padding: "150px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    headingStyle1: {
        marginTop: "-10px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: {
            xs: "1rem",
            sm: "1.2rem",
            md: "1.5rem",
        },
        fontFamily: "ComicSans"
    },
    labelStyle: {
        fontSize: 20
    },
    btnColor: {
        backgroundColor: (theme) => theme.colors.buttonColor,
        color: (theme) => theme.colors.textColor,
        "&:hover": {
            backgroundColor: (theme) => theme.colors.buttonColor,
            color: (theme) => theme.colors.navButtonHover,
        }
    },
    margin: {
        marginTop: {
            xs: -10,
            md: 1
        },
        maxWidth: 600
    },
    registerContainer: {
        marginTop: {
            xs: 15,
            sm: 12,
            md: 0
        },
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
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
            md: 600,
        },
    },
}


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

export default function Register() {

    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = useState(false)

    const handleClick = () => {
        setOpen(true);
    };



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        isTeacher: false,
    });

    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)


    const history = useHistory();

    const handleChange = (e) => {
        if (e.target.name === 'isTeacher') {
            setValues({
                ...values,
                [e.target.name]: e.target.checked
            })
        } else {
            setValues({
                ...values,
                [e.target.name]: e.target.value
            })
        }

    }

    // const handleChange = (prop) => (event) => {
    //     setValues({ ...values, [prop]: event.target.value });
    // };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validateForm = () => {
        let isValid = true
        let error = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: ''
        }
        //validate first name
        if (!values.firstName) {
            error.firstName = 'Please enter firstname'
            isValid = false
        }

        //validate last name
        if (!values.lastName) {
            error.lastName = 'Please enter lastname'
            isValid = false
        }

        //validate email
        if (!values.email) {
            error.email = 'Please enter email'
            isValid = false
        }
        if (!values.phone) {
            error.phone = 'Please enter phone number'
            isValid = false
        }

        //validate password
        if (!values.password) {
            error.password = 'Please enter password'
            isValid = false
        }
        if (values.password !== values.confirmPassword) {
            error.password = 'Password is not matched'
            isValid = false
        }

        if(/^(09|\+639)\d{9}$/.test(values.phone) === false && /^[0-9]{8}$/.test(values.phone) === false || !values.phone) {
            error.phone = 'invalid phone number'
            isValid = false
        }

        //validate confirm password
        if (!values.confirmPassword) {
            error.confirmPassword = 'Please enter password'
            isValid = false
        }

        setError(error)
        return isValid
    }

    const signup = () => {

        if (validateForm()) {
            setLoading(true)
            const data = {
                displayName: values.firstName + ' ' + values.lastName,
                email: values.email,
                isTeacher: values.isTeacher,
                phone: values.phone
            }
            setValues({ ...values, errors: "Successfully Login", isLoading: true });

            // dispatch(loginInitiate(values.email, values.password, history));
            createUser(values.email, values.password, data).then(data => {
                createDoc('users', values).then(() => {
                })
                try {
                    const auth = getAuth();
                    signInWithEmailAndPassword(auth, values.email, values.password)
                        .then((userCredential) => {
                            // Signed in 
                            const user = userCredential.user;
                            dispatch(loginInitiate(values.email, values.password, history));
                            dispatch(loginSuccess(user));
                            window.sessionStorage.setItem('id', user.uid)
                            getDocsByCollection('users').then(data => {
                                data.filter(data => data.ownerId === user.uid).map(data => {
                                    setOpen({ open: true });
                                    window.sessionStorage.setItem('user', data.isTeacher)
                                    if (data.isTeacher) {

                                        history.push('/classroom')
                                    } else {

                                        history.push('/studentclassroom')
                                    }
                                    // if(data.isTeacher){
                                    // history.push('/classroom')
                                    // }else {
                                    // history.push('/studentclassroom')
                                    // }
                                })
                            })
                            //   history.push('/classroom');
                            // ...
                        })
                        .catch((error) => {
                            const errorMessage = error.message;
                            setValues({ ...values, errors: errorMessage, isLoading: false, password: "", confirmPassword: '' })
                            setOpenError({ open: true });
                            setLoading(false);
                        });

                } catch (err) {
                    console.error(err)
                }
            }).catch((err) => {
                const errorMessage = error.message;
                setValues({ ...values, errors: errorMessage, isLoading: false, password: "", confirmPassword: '' })
                setOpenError({ open: true });
                setLoading(false)
            });


            // createUser(values.email, values.password, data).then(() => {
            //     dispatch(loginInitiate(values.email, values.password, history));
            //     setTimeout(() => {
            //         if (data.isTeacher) {

            //             history.push('/classroom')
            //         } else {

            //             history.push('/studentclassroom')
            //         }
            //     }, 2000)
            // })
        }

    }

    return (
        <Container maxWidth disableGutters={true}>
            <Helmet>
                <title>Register</title>
                <link rel="Rendezous Icon" href={logohelmet} />
            </Helmet>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={3000}
                open={openError}
                onClose={handleCloseError}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {values.errors}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={3000}
                open={open}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {values.errors}
                </Alert>
            </Snackbar>
            <NavBar />
            <Box sx={style.section1}>
                <Box component={Grid} container justifyContent="center">
                    <Typography sx={{
                        fontSize: {
                            xs: 30,
                            sm: 40,
                            md: 50
                        },
                        marginBottom: {
                            xs: 2,
                            sm: 0,
                            md: 4
                        }
                    }}>Create Account</Typography>
                </Box>
                <Grid container justifyContent="center" sx={{ display: "flex" }}>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={"assets/img/signup_bg.png"}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                    <Box sx={style.registerContainer}>
                        <Box sx={style.margin}>
                            <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 3rem' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} spacing={3}>
                                        <Input
                                            label='Firstname'
                                            type='text'
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.firstName}
                                            name='firstName'
                                            errorMessage={error.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={6} spacing={3}>
                                        <Input
                                            label='Lastname'
                                            type='text'
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.lastName}
                                            name='lastName'
                                            errorMessage={error.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} spacing={3}>
                                        <Input
                                            label='Email'
                                            type='email'
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.email}
                                            name='email'
                                            errorMessage={error.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} spacing={3}>
                                        <Input
                                            label='Phone number'
                                            type='number'
                                            pattern={'[0-9]{16}'}
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.phone}
                                            name='phone'
                                            errorMessage={error.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} spacing={3}>
                                        <Input
                                            label='Password'
                                            type={values.showPassword ? 'text' : 'password'}
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.password}
                                            name='password'
                                            id="outlined-adornment-password"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {values.showPassword ?  <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            errorMessage={error.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} spacing={3}>
                                        <Input
                                            label='Confirm Password'
                                            type={values.showPassword ? 'text' : 'password'}
                                            onChange={e => handleChange(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && signup()}
                                            value={values.confirmPassword}
                                            name='confirmPassword'
                                            errorMessage={error.confirmPassword}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                    >
                                        <FormControlLabel
                                            sx={{ padding: '10px 0', }}
                                            control={
                                                <Switch
                                                    defaultChecked
                                                    checked={values.isTeacher}
                                                    onChange={e => handleChange(e)}
                                                    name='isTeacher'
                                                />
                                            }
                                            label={<Typography sx={{fontWeight: 'bold', fontSize: 18}}>{values.isTeacher ? "Teacher" : "Student"}</Typography>}
                                            />
                                        {/* <Button
                                            variant="contained"
                                            onClick={signup}
                                            sx={{ width: 150, borderRadius: 10 }}
                                        >
                                            Sign up
                                        </Button> */}
                                        <LoadingButton
                                            loading={loading}
                                            variant="contained"
                                            color='primary'
                                            onClick={signup}
                                            sx={{ width: 150, borderRadius: 10, fontWeight: "bold", marginTop: 1 }}
                                        >
                                            Sign up
                                        </LoadingButton>
                                        {/* <Typography noWrap component="div" sx={style.titleClass}>
                                            -- or --
                                        </Typography> */}
                                        {/* <Button
                                            variant="outlined"
                                            startIcon={<GoogleIcon />}
                                            sx={{ ...style.marginStyle, ...style.btnColor }}
                                            onClick={btnSignInWithGoogle}
                                        >
                                            Sign In With Google+
                                        </Button> */}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Box>



            {/* <Box 
                style={{border:'1px solid red'}} 
                display="flex" 
                justifyContent="space-around" 
                flexDirection="row" 
                alignItems="stretch" 
                padding={1}
            >
                <Grid 
                    container 
                    direction="row" 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={2}
                    xs={6}
                    style={{border:'1px solid red',height:'100vh'}}
                >
                    <Grid item xs={6}>
                        asdas
                    </Grid>
               </Grid>
                <Grid 
                    container 
                    direction="row" 
                    // justifyContent="center" 
                    // alignItems="center" 
                    spacing={2}
                    xs={6}
                    style={{border:'1px solid red'}}
                >
                    
                    <Grid item xs={6}>
                        <Input 
                            label = 'Firstname'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input 
                            label = 'Firstname'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input 
                            label = 'Firstname'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input 
                            label = 'Firstname'
                        />
                    </Grid>
                </Grid>
            
            </Box> */}

            {/* <Box sx={style.root}>
            <Grid container justifyContent="center">
                <Box sx={style.section1} boxShadow={12}>
                    <Typography variant="subtitle1" color="textPrimary" sx={style.headingStyle1}>
                        Sign Up
                    </Typography>
                    <img
                        src={logoRendezvous}
                        alt="Rendezvous Logo"
                        style={{ height: "100px", width: "100px", marginBottom: 5 }}
                    />
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
                        <TextField
                            placeholder="Full Name"
                            onChange={handleChange('displayName')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            size="medium"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
                        <TextField
                            placeholder="Email Address"
                            onChange={handleChange('email')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            size="medium"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
                        <TextField
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            placeholder="Password"
                            onChange={handleChange('password')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} fullWidth variant="outlined">
                        <TextField
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleChange('confirmPassword')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<ExitToAppIcon />}
                        sx={{ ...style.btnColor, ...style.marginTopButton }}
                        onClick={signup}
                    >
                        Sign up
                    </Button>
                    <Typography
                        variant="subtitle1"
                        sx={style.marginTopButton}
                    >
                        Already Have an account
                    </Typography>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            startIcon={<PersonAddIcon />}
                            sx={{ ...style.btnColor, ...style.marginTopButton }}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </Box>
            </Grid>
        </Box> */}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={3000}
                open={open}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Succesfully Register
                </Alert>
            </Snackbar>
            <NewFooter />
        </Container>
    )
}
