import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    AppBar,
    Toolbar,
    Grid,
    useMediaQuery,
    Link
} from '@mui/material';

import { Link as ReactLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import Scroll from "react-scroll";

import { useTheme } from '@mui/material/styles';

// import logoRendezvous from '../../assets/img/jpg/RendezvousNewLogo.jpg';

import SideDrawer from './drawercomponent/SideDrawer';

const ScrollLink = Scroll.Link;

const style = {
    accountButton: {
        fontSize: '18px',
        width: 120,
        height: 40,
        backgroundColor: '#FFBD1F',
        textTransform: 'none',
        marginLeft: 1,
        fontWeight: "bold",
        color: '#000000',
        // color: (theme) => theme.colors.navButton,
        '&:hover': {
            color: "#fff",
            backgroundColor: '#FFBD1F',
        },
        borderRadius: 10,
    },
    logoStyle: {
        height: "100%",
        width: "auto",
    },
    title: {
        fontSize: '25px',
        marginLeft: 1,
        color: (theme) => theme.colors.navButton
    },
    menuLinks: {
        marginLeft: 8,
        '&:hover': {
            background: '#4877c2',
            color: (theme) => theme.colors.navButton,
        }
    },
    linkStyle: {
        textDecoration: "none",
        marginRight: 2,
        marginTop: 0.5,
    },
    btnLinks: {
        marginLeft: 15,
        fontSize: '22px',
        width: 'auto',
        textDecoration: 'none',
        color: "#fff",
        fontWeight: 500,
        '&:hover': {
            background: '#4877c2',
            color: (theme) => theme.colors.navButton,
        },
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 8px',
        lineHeight: '1.75'
    },
    linkContainer: {
        justifyContent: 'end',
        flexGrow: {
            xs: '1',
            sm: '1',
            md: '0'
        },
    },
    toolbarStyle: {
        padding: {
            xs: 1,
            sm: 1,
            md: 2
        },
        height: 35,
        width: 1300,
        justifyContent: {
            xs: 'space-between',
            sm: 'space-between'
        }
    },
    appBarTransparent: {
        height: 90,
    },
    appBarSolid: {
        backgroundColor: 'rgba(67, 129, 168)',
    }
}

export default function NavBar() {

    const [navBackground, setNavBackground] = useState('appBarTransparent');

    const theme = useTheme();

    const matchMD = useMediaQuery(theme.breakpoints.up('md'));

    const navRef = React.useRef();
    navRef.current = navBackground

    useEffect(() => {
        const handleScroll = () => {
            const show = window.scrollY > 310
            if (show) {
                setNavBackground('appBarSolid');
            } else {
                setNavBackground('appBarTransparent');
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <Box component={Grid} container justifyContent="center">
            <AppBar position="fixed" elevation={0} style={style.appBarTransparent}>
                <Grid container justifyContent="center">
                    <Toolbar sx={style.toolbarStyle}>
                        <Link href="#">
                            <img
                                src={'assets/img/logo.png'}
                                alt="Rendezvous Logo"
                                style={style.logoStyle}
                            />
                        </Link>
                        <Box component="span" style={style.linkContainer} />
                        {!matchMD ? <SideDrawer /> :
                            <>
                                <Box component="span" sx={{ flexGrow: 1 }} align="right" >
                                    <Grid container justifyContent="center" style={style.linkContainer}>
                                        <ScrollLink
                                            className="navy"
                                            smooth={true}
                                            duration={500}
                                            to="Home"
                                        >
                                            {/* <Button sx={style.btnLinks} >
                                                Home
                                            </Button> */}
                                            <HashLink style={style.btnLinks} to="/#Home">Home</HashLink>
                                        </ScrollLink>
                                        <ScrollLink
                                            className="navy"
                                            smooth={true}
                                            duration={500}
                                            to="Guide"
                                        >
                                            {/* <Button sx={style.btnLinks} > */}
                                            <HashLink style={style.btnLinks} to="/#Guide">Guide</HashLink>

                                            {/* </Button> */}
                                        </ScrollLink>
                                        <ScrollLink
                                            className="navy"
                                            smooth={true}
                                            duration={500}
                                            to="About"
                                        >
                                            {/* <Button sx={style.btnLinks} >
                                                About
                                            </Button> */}
                                            <HashLink style={style.btnLinks} to="/#About">About</HashLink>
                                        </ScrollLink>
                                        <ScrollLink
                                            className="navy"
                                            smooth={true}
                                            duration={500}
                                            to="Contact"
                                        >
                                            {/* <Button sx={style.btnLinks} >
                                                Contact
                                            </Button> */}
                                            <HashLink style={style.btnLinks} to="/#Contact">Contact</HashLink>
                                        </ScrollLink>

                                        <Grid item style={{ display: 'flex', marginLeft: 8 }}>
                                            <Link component={ReactLink} to="/login" sx={style.linkStyle}>
                                                <Button variant='contained' sx={style.accountButton}>
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link component={ReactLink} to="/register" sx={style.linkStyle}>
                                                <Button variant='contained' sx={style.accountButton} >
                                                    Sign up
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        }
                    </Toolbar>
                </Grid>
            </AppBar>
        </Box>
    )
}
