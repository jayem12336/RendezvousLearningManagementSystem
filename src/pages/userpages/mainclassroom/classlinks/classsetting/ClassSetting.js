import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, acceptStudent, removeStudent, unenrollStudent, deleteClass, archiveClass } from '../../../../../utils/firebaseUtil'
import Input from '../../../../../components/Input';

import { useSelector } from 'react-redux';

import {
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Classdrawer from '../../classdrawer/ClassDrawer';
import Image from '../../../../../assets/img/png/bginside.png'
import OutlinedInput from '@mui/material/OutlinedInput';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import { useParams } from 'react-router-dom';
import TeacherDrawer from '../../classdrawer/ClassDrawerTeacher';
import { useHistory } from 'react-router';
import ConfirmDelete from './ConfirmDelete'

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';


const style = {
    gridcontainer: {
        maxWidth: 1200,
    },
    btnStyle: {
        marginTop: 2,
        fontSize: 16,
        width: 100,
        height: 35,
        fontWeight: "bold",
        color: "black",
        backgroundColor: "#A5CF92",
        '&:hover': {
            backgroundColor: "#3e857f",
            boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
        },
    },
    imgStyle: {
        height: {
            xs: 300,
            sm: 400,
            md: 500
        },
        width: {
            xs: 300,
            sm: 400,
            md: 600
        },

    },
    gmeetContainer: {
        boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
        marginTop: 5,
        padding: 2,
        maxWidth: 350
    },
    imageContainer: {
        marginTop: {
            xs: 10,
            sm: 0,
            md: 5
        },
    },
    settingsContainer: {
        display: "flex",
        padding: 2,
        boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
        marginTop: 5,
    },
    classInfoContainer: {
        display: "flex",
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
        marginTop: 5,
    }
}

export default function ClassSetting() {

    const params = useParams()

    const { user } = useSelector((state) => state);

    const [classCode, setClassCode] = useState('')

    const [classroom, setClassroom] = useState([]);

    const [isTeacher, setIsTeacher] = useState(false)

    const [openDeleteSnack, setOpenDeleteSnack] = useState(false)
    const [openArchiveSnack, setOpenArchiveSnack] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [room, setRoom] = useState('')
    const [section, setSection] = useState('')
    const [subject, setSubject] = useState('')
    const [isTeacherName, setIsTeacherName] = useState(false)

    const history = useHistory();

    //Load classrooms
    useEffect(() => {

        if (Object.keys(user.currentUser).length !== 0) {
            getClassData()
            getUser().then(data => {
                data.map(item => {
                    setIsTeacher(item.isTeacher)
                    setIsTeacherName(item.displayName)
                })
            })
        }


    }, [user]);

    const getClassData = () => {
        const classCollection = collection(db, "createclass")
        const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid), where('classCode', "==", params.id));
        const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
            setClassroom(
                snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            );
            snapshot.docs.map(doc => {
                setTitle(doc.data().className)
                setClassCode(doc.data().classCode)
                setSection(doc.data().section)
                setRoom(doc.data().room)
                setSubject(doc.data().subject)
            })
            // setLoading(false);
        }
        )
        return unsubscribe;
    }

    const onArchived = () => {
        archiveClass(params.id).then(() => {
            setOpenArchiveSnack(true)
            setTimeout(() => {
                history.push('/classroom')
            }, 2000)
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenArchiveSnack(false);
        setOpenDeleteSnack(false)
    };

    const handleCloseConfirm = () => {
        setIsOpen(false)
    }

    const onDeleteClass = () => {
        setIsOpen(false)
        deleteClass(params.id).then(() => {
            setOpenDeleteSnack(true)
            classroom.map(item => {
                item.students.map(data => {
                    unenrollStudent(data.ownerId, params.id).then(() => {
                        setOpenDeleteSnack(true)
                        setTimeout(() => {
                            history.push('/classroom')
                        }, 2000)
                    })
                })

            })

            // setTimeout(() => {
            //     history.push('/classroom')
            // }, 2000)
        })
    }

    return (
        <TeacherDrawer classCode={classCode} headTitle={title}>
            <Helmet>
                <title>Settings</title>
                <link rel="Classroom Icon" href={logohelmetclass} />
            </Helmet>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                open={openDeleteSnack}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
                    Successfully Deleted Class
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                open={openArchiveSnack}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
                    Successfully Archived Class
                </Alert>
            </Snackbar>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container justifyContent='center'>
                    <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: 30, marginBottom: 2 }}>Class Settings</Typography>
                </Grid>
                <Grid container justifyContent="center" sx={style.gridcontainer}>
                    <Grid item sm sx={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                        <Grid container sx={style.classInfoContainer} justifyContent="center">
                            <Grid container justifyContent="center">
                                <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>Class Information</Typography>
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ marginTop: 2 }}>
                                <Typography sx={{ fontWeight: "bold" }}>Teacher : {isTeacherName}</Typography>
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ marginTop: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>Class Name : {title}</Typography>
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ marginTop: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>Section : {section}</Typography>
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ marginTop: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>Subject Code : {subject}</Typography>
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ marginTop: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>Room : {room}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container sx={style.settingsContainer} justifyContent="flex-start">
                            <Grid container justifyContent="center">
                                <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>Class Code</Typography>
                            </Grid>
                            <Grid container justifyContent="center" sx={{ marginTop: 2, paddingLeft: 5, paddingRight: 5 }}>
                                <Input
                                    value={params.id}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                            <Button variant="contained" color="error"
                                sx={{
                                    width: {
                                        xs: 120,
                                        md: 160
                                    },
                                    fontWeight: "bold",
                                    fontSize: 12,
                                }}
                                onClick={() => setIsOpen(true)}
                            >DELETE CLASSROOM</Button>
                        </Grid>

                    </Grid>
                    <Grid item sm>
                        <Grid container sx={style.imageContainer}>
                            <Box
                                component="img"
                                src={Image}
                                alt="Class Setting Images"
                                sx={style.imgStyle}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <ConfirmDelete
                isOpen={isOpen}
                handleCloseConfirm={handleCloseConfirm}
                confirmDelete={onDeleteClass}
            />
        </TeacherDrawer >
    )
}
