import React from 'react'
import {
    Box,
    Grid,
    Container,
    Avatar,
    Typography,
    useMediaQuery,
    Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HashLink } from 'react-router-hash-link';

import Scroll from "react-scroll";
const ScrollLink = Scroll.Link;

const style = {
    avatarStyle: {
        height: 35,
        width: 35,
        backgroundColor: "#fff",
        marginRight: .6,
        color: "#FFBD1F",
        fontWeight: 620,
        fontSize: 30
    },
    fontStyle: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    btnLinks: {
        color: "#fff",
        '&:hover': {
            background: '#4877c2',
            color: (theme) => theme.colors.navButton,
        },
        display: 'inline-flex',
        alignItems: 'center',
    },
}

export default function Footer() {
    const theme = useTheme();
    const matchMD = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <footer>
            <Box sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                padding: {
                    xs: 3,
                    sm: 10,
                }
            }}
                id="Contact">
                <Container maxWidth="lg">
                    <Grid container spacing={matchMD ? 20 : 10}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: "flex", fontSize: 25 }}><Avatar sx={style.avatarStyle}>R</Avatar>endezvous</Box>
                            <Box component={Grid} container justifyContent="flex-start" sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    Rendezvous is a online learning management system to help teachers and students by creating new e-learning environment.
                                </Typography>
                            </Box>

                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Box sx={{ fontSize: 25 }}>Information</Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    <ScrollLink
                                        className="navy"
                                        smooth={true}
                                        duration={500}
                                        to="Guide"
                                    >
                                        <HashLink style={style.btnLinks} to="/#Guide">Guide</HashLink>
                                    </ScrollLink>
                                </Typography>
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    <ScrollLink
                                        className="navy"
                                        smooth={true}
                                        duration={500}
                                        to="About"
                                    >
                                        <HashLink style={style.btnLinks} to="/#About">About</HashLink>
                                    </ScrollLink>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Box sx={{ fontSize: 25 }}>Contact Us</Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    G-mail: rendezvous@gmail.com
                                </Typography>
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    Yahoo mail: rendezvous@yahoo.com
                                </Typography>
                            </Box>
                            <Box sx={{ paddingTop: 2 }}>
                                <Typography sx={style.fontStyle}>
                                    Phone:  09567960622
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            textAlign: "center",
                            paddingTop: {
                                xs: 5,
                                sm: 10,

                            },
                            paddingBottom: {
                                xs: 10,
                                sm: 0,

                            },
                            fontSize: 25
                        }}>
                        Rendezvous &reg; {new Date().getFullYear()}
                    </Box>
                </Container>
            </Box>
        </footer>
    )
}
