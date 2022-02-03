import React, { useEffect, useState } from 'react';
import { getDocsByCollection } from '../../utils/firebaseUtil'

import {
    Box,
    Button,
    Typography,
    Grid,
    Link
} from '@mui/material';

import NavBar from '../navbarcomponent/NavBar';

import { Link as ReactLink } from 'react-router-dom';

const style = {
    //helper
    marginTop3: {
        marginTop: 3
    },
    marginLeft1: {
        marginLeft: {
            xs: 1,
            sm: 5,
        }
    },
    root: {
        backgroundColor: (theme) => theme.palette.background.default,
    },
    menuLink: {
        fontSize: "1.2rem",
        marginLeft: 2,
        "&:hover": {
            color: (theme) => theme.palette.secondary.main,
        }
    },
    headingStyle1: {
        textAlign: "center",
        fontWeight: 700,
        fontSize: {
            xs: "1.0rem",
            sm: "1.2rem",
            md: "2.8rem",
        },
        fontFamily: "ComicSans"
    },
    subtitle1: {
        textAlign: "center",
        fontSize: {
            xs: "1rem",
            sm: "1.2rem",
            md: "1.5rem",
        },
    },
    userImage: {
        height: {
            xs: 200,
            sm: 250
        },
        width: {
            xs: 200,
            sm: 250
        },
    },
    images: {
        height: 400
    },
    columnContainer: {
        display: "flex",
        justifyContent: "center",
        padding: 5,
        h2: {
            textAlign: "center",
            fontSize: {
                xs: "2rem",
                sm: "2.2rem",
                md: "2.5rem",
            },
            color: (theme) => theme.colors.textColor
        }
    },
    homeContainer: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex'
    },
    //helper
    marginStyle: {
        margin: {
            xs: 3,
            sm: 6,
            md: 10
        },
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
        padding: "150px 0px",
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
            md: 500,
        },
        width: {
            xs: 300,
            sm: 500,
            md: 700,
        },
    },
    title: {
        fontSize: 40,
        fontWeight: "bold"
    },
    titleContainer: {
        paddingTop: {
            xs: 0,
            sm: 0,
            md: 10
        },
        paddingLeft: {
            xs: 0,
            sm: 0,
            md: 10
        },
        paddingRight: {
            xs: 0,
            sm: 0,
            md: 10
        },
        textAlign: 'center'
    },
    text: {
        marginTop: 0.5,
        fontSize: 20,
        color: 'black'
    },
    textContainer: {
        marginTop: 2,
        flexDirection: 'column',
        textAlign: 'center'
    },
    button: {
        height: 50,
        width: 180,
        borderRadius: 20,
        backgroundColor: '#FFBD1F',
        color: '#000000',
        fontSize: 18,
        fontWeight: 600
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
        display: 'flex',
    },
    imgContainer: {
        padding: {
            xs: 0,
            sm: 5,
            md: 10
        },
    },
    section2container: {
        flexDirection: {
            md: 'row',
            sm: 'column',
            xs: 'column'
        },
        display: 'flex',
        width: {
            md: '1000px'
        }
    },
    section2: {
        padding: {
            xs: "100px 0px",
            md: "150px 0px"
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '100%',
        backgroundColor: '#4BAEA6',
    },
    textsection2: {
        fontSize: 45,
        fontWeight: 500,
        color: '#fff'
    },
    linkStyle: {
        textDecoration: "none",
        marginRight: 2,
        marginTop: 0.5,
    },
}

export default function HomeComponent() {

    const [users, setUsers] = useState(0)
    const [classRooms, setClassRooms] = useState(0)

    useEffect(() => {
        getDocsByCollection('users').then(item => {
            setUsers(item.length)
        })
        getDocsByCollection('createclass').then(item => {
            setClassRooms(item.length)
        })
    }, []);
    return (
        <Box id="Home">
            <NavBar />
            <Box sx={style.section1}>
                <Box sx={style.homeContainer}>
                    <Box sx={style.marginStyle}>
                        <Box component={Grid} container justifyContent="center" sx={style.titleContainer}>
                            <Typography sx={style.title}>Learning never exhausts the mind</Typography>
                        </Box>
                        <Box component={Grid} container justifyContent="flex-start" sx={style.textContainer}>
                            <Typography sx={style.text}>Rendezvous aims to create an innovative e-learning environment for the teachers and students</Typography>
                        </Box>
                        <Box component={Grid} container justifyContent="center" sx={style.buttonContainer}>
                            <Link component={ReactLink} to="/login" sx={style.linkStyle}>
                                <Button
                                    variant='contained'
                                    sx={style.button}
                                >
                                    START NOW
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                    <Box sx={style.imgContainer}>
                        <Box component={Grid} container justifyContent="center" alignItems="center">
                            <Box
                                component="img"
                                src={"assets/img/section1.png"}
                                alt="imagecontact"
                                sx={style.imgStyle}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={style.section2}>
                <Box component={Grid} justifyContent="space-between" sx={style.section2container}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={style.textsection2}>{users} Users</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', marginTop: { sm: 10, xs: 10, md: 0 } }}>
                        <Typography sx={style.textsection2}>{classRooms} Classrooms</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
