import React from 'react';

import {
    Typography,
    Box,
    Grid,
} from '@mui/material';

import Classdrawer from '../../classdrawer/ClassDrawer';
import Logo from '../../../../../assets/img/png/LogoUserDash.png'

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

const style = {
    gridcontainer: {
        display: "flex",
        padding: 2,
        borderColor: (theme) => theme.palette.primary.main,
        maxWidth: 900
    },
    gridcontainerClass: {
        display: "flex",
        padding: 2,
        cursor: 'pointer',
        marginTop: -3,
    },
    main: {
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
    },
    iconStyle: {
        color: (theme) => theme.palette.primary.main,
        margin: 0.5
    },
    btnStyle: {
        borderRadius: 20,
        fontSize: 20,
        width: 150,
        marginRight: 2,
        marginBottom: 4,
        textTransform: 'none',
        color: (theme) => theme.colors.textColor,
        backgroundColor: (theme) => theme.palette.primary.main,
        '&:hover': {
            backgroundColor: "#3e857f",
            boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
        },
    },
    textStyle: {
        paddingLeft: 2,
        fontSize: 20,
        fontWeight: 400
    },
    linkStyle: {
        cursor: 'pointer',
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 600
    },
    imgStyle: {
        height: 300,
        width: 300,

    },
    imgContainer: {
        width: 200
    },
    txtContainer: {
        width: 500
    },
    headerClass: {
        backgroundColor: '#4BAEA6',
        width: '112%',
        marginLeft: -2,
        height: 70,
        marginTop: -2,
        paddingTop: 2
    }
}

export default function About() {

    return (
        <Classdrawer headTitle='About'>
            <Helmet>
                <title>About</title>
                <link rel="Calendar Icon" href={logohelmetclass} />
            </Helmet>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Grid>
                        <Box
                            component="img"
                            src={Logo}
                            alt="imagecontact"
                            sx={style.imgStyle}
                        />
                    </Grid>
                    <Grid sx={{ width: { xs: 300, md: 500, }, marginTop: { xs: 10, md: 15, } }}>
                        <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>Rendezvous is a online platform for new normal education and provide user friendly environment for students and teacher</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Grid>
                        <Box
                            component="img"
                            src={"assets/img/section1.png"}
                            alt="imagecontact"
                            sx={style.imgStyle}
                        />
                    </Grid>
                    <Grid>
                        <Box
                            component="img"
                            src={"assets/img/login_bg.png"}
                            alt="imagecontact"
                            sx={style.imgStyle}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Classdrawer >
    )
}
