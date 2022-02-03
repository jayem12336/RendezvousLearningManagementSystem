import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, acceptStudent, removeStudent, getDocsByCollection, unenrollStudent } from '../../../../../utils/firebaseUtil'
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
import { useHistory } from 'react-router';

import ConfirmDelete from './ConfirmDelete'

import StudentDrawer from '../../classdrawer/ClassDrawerStudent';
const style = {
    gridcontainer: {
        maxWidth: 1200,
    },
    btnStyle: {
        marginTop: 2,
        fontSize: 16,
        width: 100,
        height: 35,
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
        border: "1px solid grey",
        marginTop: 5,
        maxWidth: 400,
        borderRadius: 2
    }
}

export default function ClassSetting() {

    const params = useParams()

    const { user } = useSelector((state) => state);

    const [classCode, setClassCode] = useState('')

    const [classroom, setClassroom] = useState([]);

    const [title, setTitle] = useState('')

    const [isTeacher, setIsTeacher] = useState(false)

    const [openDeleteSnack, setOpenDeleteSnack] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [studentData, setStudentData] = useState({})

    const history = useHistory();

    //Load classrooms
    useEffect(() => {

        if (Object.keys(user.currentUser).length !== 0) {
            getClassData()
            getUser().then(data => {
                data.map(item => {
                    setIsTeacher(item.isTeacher)
                })
            })
        }


    }, [user]);

    const getClassData = () => {
        const classCollection = collection(db, "createclass")
        const q = query(classCollection, where('classCode', "==", params.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setClassroom(
                snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            );
            snapshot.docs.map(doc => {
                setClassCode(doc.data().classCode)
                setTitle(doc.data().className)
            })
            // setLoading(false);
        }
        )
        return unsubscribe;
    }

    const onDeleteClass = () => {
        unenrollStudent(user.currentUser.uid, params.id, classCode, studentData).then(() => {
            setOpenDeleteSnack(true)
            setTimeout(() => {
                history.push('/studentclassroom')
            }, 2000)

        })
    }

    const handleCloseConfirm = () => {
        setIsOpen(false)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDeleteSnack(false)
    };

    return (
        <StudentDrawer classCode={params.id} headTitle={title}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                open={openDeleteSnack}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
                    Successfully Unenrolled
                </Alert>
            </Snackbar>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container justifyContent="center" sx={style.gridcontainer}>
                    <Grid item sm>
                        <Grid container sx={style.settingsContainer} justifyContent="flex-start">
                            <Grid container justifyContent="center">
                                <Typography sx={{ fontWeight: "bold" }}>Class Code</Typography>
                            </Grid>
                            <Grid container justifyContent="center" sx={{ marginTop: 1, paddingLeft: 5, paddingRight: 5 }}>
                                <Input
                                    value={params.id}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center"
                            sx={{
                                marginTop: 4,
                                marginLeft: {
                                    xs: -3,
                                    md: -6
                                },
                            }}>
                            <Button variant="contained" color="error"
                                sx={{
                                    width: {
                                        xs: 120,
                                        md: 180
                                    },
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    marginLeft: 5
                                }}
                                onClick={() => setIsOpen(true)}
                            >UNENROLL CLASSROOM</Button>
                            {/* <Button variant="contained" color="warning"
                                sx={{
                                    marginLeft: 1,
                                    width: {
                                        xs: 120,
                                        md: 160
                                    },
                                    fontSize: 12
                                }}
                            >ARCHIVE CLASSROOM</Button> */}
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
        </StudentDrawer >
    )
}
