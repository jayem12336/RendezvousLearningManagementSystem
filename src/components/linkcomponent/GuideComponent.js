import React from 'react'

import {
    Box,
    Typography,
    Grid,
    Paper
} from '@mui/material';

import CardContent from '@mui/material/CardContent';

const style = {
    //helper
    textAlignStyle: {
        textAlign: 'center',
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 500,
        color: (theme) => theme.palette.primary.main,
        fontWeight: "bold"
    },
    descriptStyle: {
        fontSize: 18,
        fontWeight: 200,
        color: 'black'
    },

    section1: {
        padding: "100px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 1800
    },
    cardStyle: {
        maxWidth: 345,
        height: 350,
        marginTop: 10,
    },
    imgStyle: {
        height: 200,
        width: 200
    }
}

export default function GuideComponent() {
    return (
        <Box component={Grid} container justifyContent="center" id="Guide">
            <Box sx={style.section1}>
                <Box component={Grid} container justifyContent="center">
                    <Typography variant="h2">Guide</Typography>
                </Box>
                <Box component={Grid} container justifyContent="center" sx={{ padding: 2 }}>
                    <Grid sm item>
                        <Grid container justifyContent="center">
                            <Paper sx={style.cardStyle}>
                                <Grid container justifyContent="center" sx={{ marginTop: -3 }}>
                                    <img src={'assets/img/find.png'} alt="message" style={style.imgStyle} />
                                </Grid>
                                <CardContent>
                                    <Typography gutterBottom sx={{ ...style.textStyle, ...style.textAlignStyle }}>
                                        Find your Classroom
                                    </Typography>
                                    <Typography variant="body2" sx={{ ...style.textAlignStyle, ...style.descriptStyle }}>
                                        To connect with your instructor and see all your assigned task in a specific space.
                                    </Typography>
                                </CardContent>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid sm item>
                        <Grid container justifyContent="center">
                            <Paper sx={style.cardStyle}>
                                <Grid container justifyContent="center" sx={{ marginTop: -2 }}>
                                    <img src={'assets/img/join.png'} alt="message" style={style.imgStyle} />
                                </Grid>
                                <CardContent>
                                    <Typography gutterBottom sx={{ ...style.textStyle, ...style.textAlignStyle }}>
                                        Join meeting
                                    </Typography>
                                    <Typography variant="body2" sx={{ ...style.textAlignStyle, ...style.descriptStyle }}>
                                        To keep you connected and know the latest topic
                                    </Typography>
                                </CardContent>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid sm item>
                        <Grid container justifyContent="center">
                            <Paper sx={style.cardStyle}>
                                <Grid container justifyContent="center" sx={{ marginTop: -5 }}>
                                    <img src={'assets/img/monitor.png'} alt="message" style={style.imgStyle} />
                                </Grid>
                                <CardContent>
                                    <Typography gutterBottom sx={{ ...style.textStyle, ...style.textAlignStyle }}>
                                        Monitor your students
                                    </Typography>
                                    <Typography variant="body2" sx={{ ...style.textAlignStyle, ...style.descriptStyle }}>
                                        To guide and teach them to be creative and resourceful to learn. Rendezvous can give it all to you.
                                    </Typography>
                                </CardContent>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box >
        </Box >
    )
}
