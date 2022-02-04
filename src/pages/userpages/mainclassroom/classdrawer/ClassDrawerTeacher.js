import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { LinearProgress } from '@mui/material';
import { useSelector } from "react-redux";
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileViewTeachersDrawer from './MobileViewTeachersDrawer';


//React Router Dom
import { Link } from 'react-router-dom'

//Material Icons
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import ListAltIcon from '@mui/icons-material/ListAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GradingIcon from '@mui/icons-material/Grading';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import { getUser } from '../../../../utils/firebaseUtil';

import LogoDash from '../../../../assets/img/png/LogoUserDash.png'

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const style = {
    logoStyle: {
        height: "100%",
        width: "auto",
        paddingRight: 10
    },
    textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    iconStyle: {
        fontSize: 30
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 600
    },
    listHover: {
        '&:hover': {
            color: "#fff",
            backgroundColor: '#35D6C9',
            borderRadius: 2,
        }
    },
    listItemStyle: {
        height: 46
    },
}

export default function TeacherDrawer(props) {

    const { user } = useSelector((state) => state);

    const theme = useTheme();
    const matchMD = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(true);

    const [loading, setLoading] = useState(true)
    const [isTeacher, setIsTeacher] = useState(false)

    const { classUser } = useSelector((state) => state);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (classUser) {
            setLoading(false);
        }
        if (Object.keys(user.currentUser).length !== 0) {
            getUser().then(data => {
                data.map(item => {
                    setIsTeacher(item.isTeacher)
                })
            })
        }
    }, [classUser, user])

    /*
    const handleLogOut = () => {
        if (user) {
            dispatch(logoutInitiate());
            history.push('/');
        }
    } */

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={matchMD ? false : open}>
                <Toolbar>
                    {matchMD ? <MobileViewTeachersDrawer props={props.classCode} /> :
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </>
                    }
                    <Grid container justifyContent="flex-start">
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
                            {/* {classUser.classData.className} */}
                            {props.headTitle}
                            {/* test */}
                        </Typography>
                    </Grid>
                </Toolbar>
                {props.loading ?
                    (
                        <LinearProgress />
                    ) :
                    (
                        ""
                    )}
            </AppBar>
            {matchMD ? "" :
                <>
                    <Drawer variant="permanent" open={matchMD ? false : open}>
                        <DrawerHeader>
                            <Box component={Grid} sx={{ height: 110, marginBottom: 1 }}>
                                <img
                                    src={LogoDash}
                                    alt="Rendezvous Logo"
                                    style={style.logoStyle}
                                />
                            </Box>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>

                        <Divider sx={{ display: open === true ? 'block' : 'none' }} />

                        <List sx={{ paddingLeft: 1, paddingRight: 1 }}>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/classannouncement/${props.classCode}`}
                                    sx={{
                                        marginTop: open === true ? 4 : -5, height: 46
                                    }}
                                >
                                    <ListItemIcon> <ListAltIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Announcement
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/classroomdetail/${props.classCode}`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <LibraryBooksIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Classwork
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>

                            {/* <ListItem
                          button
                          component={Link}
                          to={`/classroom`}
                      >
                          <ListItemIcon> <AssessmentIcon color="primary" /></ListItemIcon>
                          <ListItemText>Classroom</ListItemText>
                      </ListItem> */}
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/studentgrade/${props.classCode}`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <GradingIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Grades
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>

                            {/* <ListItem
                          button
                          component={Link}
                          to={`/laboratory`}
                      >
                          <ListItemIcon> <AssessmentIcon color="primary" /></ListItemIcon>
                          <ListItemText>Laboratory</ListItemText>
                      </ListItem> */}
                            {/* <ListItem
                          button
                          component={Link}
                          to={`/classjoinmeet/${classUser.classData.classCode}`}
                      >
                          <ListItemIcon> <DuoIcon color="primary" /></ListItemIcon>
                          <ListItemText>Meeting</ListItemText>
                      </ListItem> */}
                            {/* <ListItem
                          button
                          component={Link}
                          to={`/classpeople/${classUser.classData.classCode}`}
                      >
                          <ListItemIcon> <PeopleIcon color="primary" /></ListItemIcon>
                          <ListItemText>People</ListItemText>
                      </ListItem> */}
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/classjoinmeet/${props.classCode}`}
                                    sx={style.listItemStyle}

                                >
                                    <ListItemIcon> <PhotoCameraFrontIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Meeting
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/studentlist/${props.classCode}`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <PeopleAltIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            People
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/classsetting/${props.classCode}`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <SettingsIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Settings
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={'/classroom'}
                                    sx={style.listItemStyle}
                                // onClick={() => history.goBack()}
                                >
                                    <ListItemIcon> <ExitToAppIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Back
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                        </List>
                    </Drawer>
                </>
            }
            <Box component="main" sx={{
                flexGrow: 1, p: {
                    xs: 1, md: 4
                }
            }}>
                {props.children}
            </Box>
        </Box>
    );
}
