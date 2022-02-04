import React, { useState } from 'react';

import {
    IconButton,
    List,
    Drawer,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    Typography,
} from '@mui/material';

import { Link as ReactLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import ListAltIcon from '@mui/icons-material/ListAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GradingIcon from '@mui/icons-material/Grading';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';


const style = {
    menuIconContainer: {
        flexGrow: 1,
    },
    icons: {
        fontSize: '1.8rem',
        marginTop: "7px",
        marginLeft: "15px",
        marginRight: "20px",
        color: "#4BAEA6"

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

export default function MobileViewStudentDrawer({ props }) {

    const [openDrawer, setOpenDrawer] = useState(false);

    /*
    const handleLogOut = () => {
        if (user) {
            dispatch(logoutInitiate());
            history.push('/');
        }
    }*/

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
                            to={`/studentclassannouncement/${props}`}
                        >
                            <ListItemIcon>
                                <ListAltIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Announcement
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/studentclassroomdetail/${props}`}
                        >
                            <ListItemIcon>
                                <LibraryBooksIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Classwork
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/studentclassjoinmeet/${props}`}
                        >
                            <ListItemIcon>
                                <PhotoCameraFrontIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Meeting
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/classstudentlist/${props}`}
                        >
                            <ListItemIcon>
                                <PeopleAltIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        People
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={`/studentsetting/${props}`}
                        >
                            <ListItemIcon>
                                <SettingsIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Setting
                                    </Typography>
                                </ListItemText>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={ReactLink}
                            to={'/studentclassroom'}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon sx={style.icons} />
                                <ListItemText>
                                    <Typography sx={style.textStyle}>
                                        Back
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
