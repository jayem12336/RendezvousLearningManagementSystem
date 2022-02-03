import React, { useState } from 'react';

import {
    IconButton,
    List,
    Drawer,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    Divider,
    Grid,
    Typography,
    Link,
    Button
} from '@mui/material';

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router';

import { Link as ReactLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import FlagIcon from '@mui/icons-material/Flag';

import { logoutInitiate } from '../../../../redux/actions/userAction';


import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';


const style = {
    menuIconContainer: {
        flexGrow: 1,
    },
    icons: {
        fontSize: '1.8rem',
        marginTop: "7px",
        marginLeft: "15px",
        marginRight: "20px"
    },
    iconStyle: {
        color: "white",
        fontSize: 30,
        marginTop: 1,
        marginLeft: -1,
        marginRight: 1
    },
    logoStyle: {
        height: "100%",
        width: "auto",
        paddingRight: 10
    },
    textStyle: {
        fontSize: 18,
        color: '#000000',
        fontWeight: 700,
        marginTop: .5
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
};

export default function MobileViewDrawer() {

    const { user } = useSelector((state) => state);

    const dispatch = useDispatch();

    const history = useHistory();

    const [openDrawer, setOpenDrawer] = useState(false);

    
    const handleLogOut = () => {
        if (user) {
            dispatch(logoutInitiate(user ,history));
            
        }
    }

    return (
        <Box >
            <Drawer
                anchor='left'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <Box sx={{ height: "100%" }}>
                    <List sx={{ marginTop: 10 }}>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/profile`}
                        >
                            <ListItemIcon>
                                <PersonIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Profile
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/classroom`}
                        >
                            <ListItemIcon>
                                <MeetingRoomIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Classroom
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/calendar`}
                        >
                            <ListItemIcon>
                                <CalendarTodayIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Calendar
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/files`}
                        >
                            <ListItemIcon>
                                <ArticleIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Files
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/about`}
                        >
                            <ListItemIcon>
                                <InfoIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        About
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={'/'}
                            onClick={() => handleLogOut()}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Logout
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
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
