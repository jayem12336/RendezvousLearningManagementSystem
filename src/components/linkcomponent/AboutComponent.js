import React from 'react'
import {
    Box,
    Button,
    Typography,
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material';
import aboutImage from '../../assets/img/png/gmeet_image.png'

const style = {
    //helper
    marginStyle: {
        margin: {
            xs: 3,
            sm: 6,
            md: 10
        }
    },
    textAlignStyle: {
        textAlign: 'center',
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 500,
        color: (theme) => theme.palette.primary.main
    },
    descriptStyle: {
        fontSize: 18,
        fontWeight: 200
    },

    section1: {
        padding: "70px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    cardStyle: {
        maxWidth: 345,
        height: 420,
        marginTop: 10,
    },
    imgStyle: {
        height: {
            xs: 200,
            sm: 300,
            md: 600,
        },
        width: {
            xs: 300,
            sm: 500,
            md: 700,
        },
    },
    columnContainer: {
        display: "flex",
        justifyContent: "center",
        padding: 5
    },
    title: {
        fontSize: 40,
        fontWeight: "bold"
    },
    titleContainer: {
        flexDirection: 'column',
        display: 'flex',
    },
    text: {
        marginTop: 0.5,
        fontSize: 20
    },
    textContainer: {
        marginTop: 2,
        maxWidth: 500
    },
    button: {
        height: 50,
        width: 180,
        borderRadius: 20,
    },
    buttonContainer: {
        marginTop: 3,
    },
    aboutContainer: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
    },
    imgContainer: {
        padding: {
            xs: 0,
            sm: 5,
            md: 10
        },
    }
}

export default function AboutComponent() {

    const theme = useTheme();
    const matchMD = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box>
            <Box sx={style.section1} id="About">
                <Box sx={style.aboutContainer}>
                    <Box sx={style.marginStyle}>
                        <Box component={Grid} container justifyContent="flex-start" sx={style.titleContainer}>
                            <Typography sx={style.title}>About Rendezvous</Typography>
                        </Box>

                        <Box component={Grid} container justifyContent="flex-start" sx={style.textContainer}>
                            <Typography sx={style.text}> Rendezvous: A Learning Management Platform for Education is an online platform website for the students and teachers that adopting the new learning platform for education that features laboratory that will be used specially for ICT students.</Typography>
                        </Box>
                    </Box>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={aboutImage}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
