import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, acceptStudent, removeStudent, getDocsByCollection, saveMeeting } from '../../../../../utils/firebaseUtil'

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
import Image from '../../../../../assets/img/png/gmeet_image.png'
import OutlinedInput from '@mui/material/OutlinedInput';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import { useParams } from 'react-router-dom';
import TeacherDrawer from '../../classdrawer/ClassDrawerTeacher';
const style = {
    gridcontainer: {
        maxWidth: 1100,
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
            md: 500
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
    }
}

export default function ClassJoinMeet() {

    const params = useParams()

    const { user } = useSelector((state) => state);

    const [classCode, setClassCode] = useState('')

    const [classroom, setClassroom] = useState([]);

    const [isTeacher, setIsTeacher] = useState(false)

    const [meetingLink, setMeetingLink] = useState('')
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')

    //Load classrooms
    useEffect(() => {

        if (Object.keys(user.currentUser).length !== 0) {
            getMeeting()
            getClassData()
            getUser().then(data => {
                data.map(item => {
                    setIsTeacher(item.isTeacher)
                })
            })
        }


    }, [user]);

    const getMeeting = async () => {
        const docRef = doc(db, "meeting", params.id)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setMeetingLink(docSnap.data().meetingLink)
        } else {
            // doc.data() will be undefined in this case
        }
    }

    const getClassData = () => {
        const classCollection = collection(db, "createclass")
        const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid), where('classCode', "==", params.id));
        const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
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

    const onSaveMeeting = () => {
        saveMeeting(params.id, meetingLink).then(() => {
            setOpen(true)
        })

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    };

    return (
        <TeacherDrawer classCode={classCode} headTitle={title}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                open={open}
                onClose={handleClose}
                message="I love snacks"
            // key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
                    Successfully saved meeting
                </Alert>
            </Snackbar>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container justifyContent='center'>
                    <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: 30, marginBottom: 2 }}>Class Meeting</Typography>
                </Grid>
                <Grid container justifyContent="center" sx={style.gridcontainer}>
                    <Grid item sm>
                        <Grid container justifyContent="center" sx={style.gmeetContainer}>
                            <Grid Container>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>Enter link meet here</Typography>
                                    <OutlinedInput
                                        value={meetingLink}
                                        type='url'
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        id="outlined-adornment-password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <DriveFileRenameOutlineIcon />
                                            </InputAdornment>
                                        }
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </FormControl>

                            </Grid>
                            <Grid container justifyContent="center">
                                <Button
                                    variant="contained"
                                    sx={style.btnStyle}
                                    onClick={onSaveMeeting}
                                >Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container sx={style.imageContainer}>
                            <Box
                                component="img"
                                src={Image}
                                alt="Gmeet Image"
                                sx={style.imgStyle}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </TeacherDrawer >
    )
}
