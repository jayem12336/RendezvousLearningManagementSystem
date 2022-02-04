import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser } from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';


import {
    Typography,
    Box,
    Grid,
    Button,
    CircularProgress
} from '@mui/material';

import Classdrawer from '../../classdrawer/ClassDrawer';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

import CreateActivityDialog from '../classwork/CreateActivityDialog';
import CreateQuizDialog from '../classwork/CreateQuizDialog';
import CreateExamDialog from '../classwork/CreateExamDialog';
import CreateLabDialog from '../classwork/CreateLabDialog';

import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

const style = {
    gridcontainer: {
        display: "flex",
        padding: 2,
        borderBottom: 3,
        borderColor: (theme) => theme.palette.primary.main
    },
    gridcontainerClass: {
        display: "flex",
        padding: 2,
        marginTop: -3
    },
    main: {
        display: "flex",
        alignItems: "center",
    },
    iconStyle: {
        color: (theme) => theme.palette.primary.main,
        margin: 0.5
    },
    btnStyle: {
        borderRadius: 20,
        fontSize: 20,
        width: 150,
        marginRight: 2,
        marginBottom: 4,
        fontWeight: "bold",
        textTransform: 'none',
        color: (theme) => theme.colors.textColor,
        backgroundColor: (theme) => theme.palette.primary.main,
        '&:hover': {
            backgroundColor: "#3e857f",
            boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
        },
    },
    textStyle: {
        paddingLeft: 2,
        fontSize: 20,
        fontWeight: 400
    },
    linkStyle: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold"
    },
    imgStyle: {
        height: 300,
        width: 300,

    },
    imgContainer: {
        width: 200
    },
    txtContainer: {
        width: 500
    },
    headerClass: {
        backgroundColor: '#4BAEA6',
        width: '112%',
        marginLeft: -2,
        height: 70,
        marginTop: -2,
        paddingTop: 2
    }
}

export default function ClassList() {

    const history = useHistory();
    const { user } = useSelector((state) => state);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isTeacher, setIsTeacher] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(true)

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [classroom, setClassroom] = useState([]);

    //Create Class Dialog
    const [classOpen, setClassOpen] = useState(false);

    const handleOpenClass = () => {
        setClassOpen(!classOpen);
    }

    //Join Class Dialog
    const [joinClassOpen, setOpenJoinClass] = useState(false);

    const handleOpenJoinClass = () => {
        setOpenJoinClass(!joinClassOpen);
    }

    //Create Activity Dialog
    const [createActivityOpen, setCreateActivityOpen] = useState(false);

    const handleCreateActivityOpen = () => {
        handleClose();
        setCreateActivityOpen(!createActivityOpen);
    }

    //Create Lab Dialog
    const [createLabOpen, setCreateLabOpen] = useState(false);

    const handleCreateLabOpen = () => {
        handleClose();
        setCreateLabOpen(!createLabOpen);
    }

    //Create Quiz Dialog
    const [createQuizOpen, setCreateQuizOpen] = useState(false);

    const handleCreateQuizOpen = () => {
        handleClose();
        setCreateQuizOpen(!createQuizOpen);
    }

    //Create Exam Dialog
    const [createExamOpen, setCreateExamOpen] = useState(false);

    const handleCreateExamOpen = () => {
        handleClose();
        setCreateExamOpen(!createExamOpen);
    }

    //Load classrooms
    useEffect(() => {

        if (Object.keys(user.currentUser).length !== 0) {
            getClassData()
            getUser().then(data => {
                if (data) {
                    data.map(item => {
                        setIsTeacher(item.isTeacher)
                        setDisplayName(item.displayName)
                    })
                }

            })
        }


    }, [user]);

    const getClassData = () => {
        const classCollection = collection(db, "createclass")
        const q = query(classCollection, where('students', "array-contains", user.currentUser.uid));
        const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid), where("isDeleted", "==", false), where("isArchived", "==", false));
        const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
            setClassroom(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        }
        )
        return unsubscribe;
    }

    const classroomBody = () => {
        return (
            <Box component={Grid} container justifyContent="center">
                <Box component={Grid} container justifyContent="center">
                    <Grid container sx={style.gridcontainerClass}>
                        {classroom && classroom.map(item =>
                            <Box sx={{ width: 300, boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)', padding: 2, margin: 2, }}>
                                <Box sx={style.headerClass} key={item.id} container justifyContent="center">
                                    <Typography sx={style.linkStyle}>
                                        {item.className}
                                    </Typography>
                                </Box>
                                <Box sx={{ marginTop: 5 }}>
                                    <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold' }} >{item.section}</Typography>
                                    <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold' }}>{item.subject}</Typography>
                                    <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold' }}>{item.room}</Typography>
                                </Box>
                                <Box component={Grid} container justifyContent="center" sx={{ marginTop: 5 }}>
                                    <Button variant="contained" sx={{ backgroundColor: '#FFBD1F', fontWeight: "bold" }} onClick={() => history.push(`/classroomdetail/${item.classCode}`)}> Go inside </Button>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Box>
            </Box>
        )
    }

    return (
        <Classdrawer headTitle='Classroom'>
            <Helmet>
                <title>Teacher Dashboard</title>
                <link rel="Classroom Icon" href={logohelmetclass} />
            </Helmet>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Grid item>
                        <Button variant="outlined"
                            sx={style.btnStyle}
                            id="fade-button"
                            aria-controls="fade-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleOpenClass}
                        > Create Class</Button>
                        {/* {isTeacher ?
                            <Button variant="outlined"
                                sx={style.btnStyle}
                                id="fade-button"
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleOpenClass}
                            > Create</Button>
                            :
                            <Button variant="outlined"
                                sx={style.btnStyle}
                                id="fade-button"
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleOpenJoinClass}
                            > Join</Button>
                        } */}

                        {/* <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                            sx={{ marginTop: 1 }}
                        >
                            <MenuItem onClick={handleCreateActivityOpen} >
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Activity
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCreateLabOpen} >
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Laboratory
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCreateQuizOpen}>
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Quiz
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleCreateExamOpen}>
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Exam
                                </Typography>
                            </MenuItem>
                        </Menu> */}
                    </Grid>
                    {/* <Grid item>
                        <Grid Container sx={{ marginTop: -1.5 }}>
                            <Button>
                                <DateRangeIcon />
                                <Typography sx={style.linkStyle}>
                                    Laboratory
                                </Typography>
                            </Button>
                            <Button>
                                <AddToDriveIcon />
                                <Typography sx={style.linkStyle}>
                                    Class Drive Folder
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Box>
            {/* <Box sx={{ display: 'flex', widhth: '100%',height:'30em', justifyContent:'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box> */}
            {loading ?
                <Box sx={{ display: 'flex', widhth: '100%', height: '30em', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
                :
                classroom ?
                    <Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
                        {classroomBody()}
                    </Box>
                    :
                    <Box component={Grid} container justifyContent="center" alignItems="center" sx={{ paddingTop: 5, flexDirection: "column" }}>
                        <Box component={Grid} container justifyContent="center" sx={style.imgContainer}>
                            <Box component="img" src={bgImage} alt="Animated Computer" sx={style.imgStyle} />
                        </Box>
                        <Box component={Grid} container justifyContent="center" sx={style.txtContainer}>
                            <Typography>
                                This is where you'll see classrooms.
                            </Typography>
                            <Typography>
                                You can join class, see activities and check available quiz
                            </Typography>
                        </Box>
                    </Box>

            }


            <CreateClass
                isClassOpen={classOpen}
                toggleClass={handleOpenClass}
                displayName={displayName}
            />
            <JoinClass
                isJoinClassOpen={joinClassOpen}
                toggleJoinClass={handleOpenJoinClass}
                handleOpenJoinClass={handleOpenJoinClass}
                userId={user.currentUser.uid}
            />
            <CreateActivityDialog
                isCreateActivityOpen={createActivityOpen}
                toggleCreateActivity={handleCreateActivityOpen}
            />
            <CreateLabDialog
                isCreateLabOpen={createLabOpen}
                toggleCreateLab={handleCreateLabOpen}
            />
            <CreateQuizDialog
                isCreateQuizOpen={createQuizOpen}
                toggleCreateQuiz={handleCreateQuizOpen}
            />
            <CreateExamDialog
                isCreateExamOpen={createExamOpen}
                toggleCreateExam={handleCreateExamOpen}
            />
        </Classdrawer >
    )
}
