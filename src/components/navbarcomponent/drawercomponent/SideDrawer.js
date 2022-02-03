import React, { useState } from 'react';

import {
    IconButton,
    List,
    Drawer,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    Grid,
    Typography,
    Link,
    Button
} from '@mui/material';

import { Link as ReactLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import Scroll from "react-scroll";

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const ScrollLink = Scroll.Link;

const style = {
    menuIconContainer: {
        flexGrow: 1,
    },
    icons: {
        fontSize: '1.7rem',
        marginTop: "7px",
        marginLeft: "15px",
        marginRight: "20px",
    },
    iconStyle: {
        color: "white",
        fontSize: 35,
        marginTop: 1,
      
    },
    logoStyle: {
        height: "100%",
        width: "auto",
        paddingRight: 10
    },
    textStyle: {
        fontSize: 20,
        color: '#000000',
        fontWeight: "bold"
    },
    linkStyle: {
        textDecoration: "none",
        marginRight: 2,
        marginTop: 0.5,
    },
    accountButton: {
        fontSize: '18px',
        width: 120,
        height: 40,
        backgroundColor: '#FFBD1F',
        fontWeight: "bold",
        textTransform: 'none',
        marginLeft: 1,
        color: '#000000',
        // color: (theme) => theme.colors.navButton,
        '&:hover': {
            color: "#fff",
            backgroundColor: '#FFBD1F',
        },
        borderRadius: 10,
    },
    btnLinks: {
        textDecoration: 'none',
        color: 'black'
    },
};

export default function DrawerComponent() {

    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <Box >
            <Drawer
                anchor='left'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}

            >
                <Box sx={{ backgroundColor: '#fff', height: "100%" }}>
                    <Box component={Grid} sx={{ backgroundColor: '#fff', height: 100, borderBottom: "1.5px solid #4BAEA6" }}>
                        <img
                            src={'assets/img/logo.png'}
                            alt="Rendezvous Logo"
                            style={style.logoStyle}
                        />
                    </Box>
                    <List>
                        <ScrollLink
                            className="navy"
                            smooth={true}
                            duration={500}
                            to="Home"
                        >
                            <ListItem
                                button
                            >
                                <ListItemIcon>
                                    <HomeIcon sx={style.icons} color="primary" />
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            <HashLink style={style.btnLinks} to="/#Home">Home</HashLink>
                                        </Typography>
                                    </ListItemText>
                                </ListItemIcon>
                            </ListItem>
                        </ScrollLink>
                        <ScrollLink
                            className="navy"
                            smooth={true}
                            duration={500}
                            to="Guide"
                        >
                            <ListItem
                                button
                            >
                                <ListItemIcon>
                                    <ContactMailIcon sx={style.icons} color="primary" />
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            <HashLink style={style.btnLinks} to="/#Guide">Guide</HashLink>
                                        </Typography>
                                    </ListItemText>
                                </ListItemIcon>
                            </ListItem>
                        </ScrollLink>
                        <ScrollLink
                            className="navy"
                            smooth={true}
                            duration={500}
                            to="About"
                        >
                            <ListItem
                                button
                            >
                                <ListItemIcon>
                                    <InfoIcon sx={style.icons} color="primary" />
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            <HashLink style={style.btnLinks} to="/#About">About</HashLink>
                                        </Typography>
                                    </ListItemText>
                                </ListItemIcon>
                            </ListItem>
                        </ScrollLink>
                        <ScrollLink
                            className="navy"
                            smooth={true}
                            duration={500}
                            to="Contact"
                        >
                            <ListItem
                                button
                            >
                                <ListItemIcon>
                                    <ContactPhoneIcon sx={style.icons} color="primary" />
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            <HashLink style={style.btnLinks} to="/#Contact">Contact</HashLink>
                                        </Typography>
                                    </ListItemText>
                                </ListItemIcon>
                            </ListItem>
                        </ScrollLink>
                        <ListItem>
                            <Link component={ReactLink} to="/login" sx={style.linkStyle}>
                                <Button variant='contained' sx={style.accountButton}>
                                    Log in
                                </Button>
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link component={ReactLink} to="/register" sx={style.linkStyle}>
                                <Button variant='contained' sx={style.accountButton} >
                                    Sign up
                                </Button>
                            </Link>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <IconButton
                sx={style.menuIconContainer}
                onClick={() => setOpenDrawer(!openDrawer)}
            >
                {!openDrawer ? <MenuIcon sx={style.iconStyle} /> : <MenuOpenIcon sx={style.iconStyle} />}
            </IconButton>
        </Box>
    )
}
