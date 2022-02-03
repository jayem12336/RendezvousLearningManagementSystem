import React from 'react'
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from "@mui/material";

import ScrollAnimation from "react-animate-on-scroll";

const style = {
    root: {
        backgroundColor: (theme) => theme.colors.base1,
    },
    //helper
    marginTop: {
        marginTop: 5,
    },
    textfieldStyle: {
        backgroundColor: (theme) => theme.colors.base1,
        color: 'black',
        border: 'none'
    },
    images: {
        width: {
            xs: 250,
            sm: 500,
            md: 600
        },
        height: {
            md: 400
        }
    },
    columnContainer: {
        padding: {
            xs: 5,
            sm: 8,
            md: 10
        }
    },
    headerTitle: {
        color: 'black',
        fontWeight: 350,
        fontSize: {
            xs: 30,
            md: 50
        }
    },
    section1: {
        padding: "100px 0px",
        width: 1800,
    },
    labelStyle: {
        fontSize: 20
    },
    btnSubmit: {

    }
}

export default function ContactComponent() {

    return (
        <Box component={Grid} container justifyContent="center" sx={style.root}>
            <Box sx={style.section1}>
                <ScrollAnimation animateIn='fadeIn'>
                    <Grid container justifyContent="center">
                        <Box component={Grid} container justifyContent="center">
                            <Typography sx={style.headerTitle}>
                                Contact Me
                            </Typography>
                        </Box>

                        <Grid sm item sx={style.columnContainer}>
                            <Box component="img" src="https://www.techrepublic.com/a/hub/i/r/2018/07/09/1aba83d0-c289-4a6b-bfef-3dcc38dcf509/resize/1200x/c166876c2a82cd9a482cac6e20f9b60f/istock-849858410-1.jpg"
                                alt="imagecontact"
                                sx={style.images}
                            />
                        </Grid>
                        <Grid sm item sx={style.columnContainer}>
                            <Grid container justifyContent="center">
                                <Typography variant="h4">Contact Us</Typography>
                            </Grid>
                            <Grid container justifyContent="center" alignItems="center" sx={{ flexDirection: "column" }}>
                                <Typography variant="subtitle1" sx={{textAlign:"center"}}>G-mail: rendezvous@gmail.com</Typography>
                                <Typography variant="subtitle1" sx={{textAlign:"center"}}>Yahoo mail: rendezvous@yahoo.com</Typography>
                                <Typography variant="subtitle1" sx={{textAlign:"center"}}>Phone: 09567960622</Typography>
                            </Grid>


                            <Grid container sx={{
                                marginTop: {
                                    xs: 2,
                                    sm: 3,
                                    md: 0
                                },
                                padding: {
                                    xs: 2,
                                    sm: 3,
                                    md: 5,
                                }
                            }}>

                            </Grid>
                        </Grid>
                    </Grid>
                </ScrollAnimation>
            </Box>
        </Box >
    )
}
