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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';

//React Router Dom
import { Link } from 'react-router-dom'

//Material Icons
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { logoutInitiate } from '../../../../redux/actions/userAction';
import { getUser } from '../../../../utils/firebaseUtil';
import LogoDash from '../../../../assets/img/png/LogoUserDash.png'
import MobileViewClassDrawer from './MobileViewClassDrawer';

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
    //helper
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
    logoStyle: {
        height: "100%",
        width: "auto",
        paddingRight: 10
    },
    textStyle: {
        fontSize: 18,
        fontWeight: 650,
    },
    iconStyle: {
        fontSize: 30,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 600
    }
}

export default function MiniDrawer(props) {

    const dispatch = useDispatch();
    const history = useHistory();
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
                if (data) {
                    data.map(item => {
                        setIsTeacher(item.isTeacher)
                    })
                }

            })
        }
    }, [classUser, user])

    console.log(classUser);

    const handleLogOut = () => {
        if (user) {
            dispatch(logoutInitiate(user, history));

        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={matchMD ? false : open}>
                <Toolbar sx={{ height: 70 }}>
                    {matchMD ? <MobileViewClassDrawer /> :
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
                        <Typography sx={style.headerTitle} noWrap component="div">
                            {/* {classUser.classData.className} */}
                            {props.headTitle}
                            {/* test */}
                        </Typography>
                    </Grid>
                </Toolbar>
                {loading ?
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
                                    to={`/profile`}
                                    sx={{
                                        marginTop: open === true ? 4 : -5, height: 46
                                    }}
                                >
                                    <ListItemIcon> <PersonIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Profile
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={isTeacher ? `/classroom` : `/studentclassroom`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <MeetingRoomIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Classroom
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
                                    to={`/calendar`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <CalendarTodayIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Calendar
                                        </Typography>
                                    </ListItemText>
                                </ListItem></Box>

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
                                    to={`/files`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <InsertDriveFileIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Files
                                        </Typography>
                                    </ListItemText>
                                </ListItem>

                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/about`}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <InfoIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            About
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>
                            <Box sx={style.listHover}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={'/'}
                                    onClick={() => handleLogOut()}
                                    sx={style.listItemStyle}
                                >
                                    <ListItemIcon> <ExitToAppIcon color="primary" sx={style.iconStyle} /></ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={style.textStyle}>
                                            Logout
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </Box>

                        </List>
                    </Drawer>
                </>
            }
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {props.children}
            </Box>
        </Box>
    );
}
