import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser } from '../../../../../utils/firebaseUtil'

import { useSelector } from 'react-redux';

import {
    Typography,
    Box,
    Grid,
    Link
} from '@mui/material';
import Image from '../../../../../assets/img/png/gmeet_image.png'

import { useParams } from 'react-router-dom';
import StudentDrawer from '../../classdrawer/ClassDrawerStudent';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';
const style = {
    gridcontainer: {
        maxWidth: 1100,
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

    const [title, setTitle] = useState('')

    const [isTeacher, setIsTeacher] = useState(false)

    const [meetingLink, setMeetingLink] = useState('')

    //Load classrooms
    useEffect(() => {

        if (Object.keys(user.currentUser).length !== 0) {
            getClassData()
            getMeeting()
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
            console.log("Document data:", docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

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
        }
        )
        return unsubscribe;
    }

    return (
        <StudentDrawer classCode={params.id} headTitle={title}>
            <Helmet>
                <title>Meeting</title>
                <link rel="Classroom Icon" href={logohelmetclass} />
            </Helmet>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container justifyContent="center" sx={style.gridcontainer}>
                    <Grid item sm>
                        <Grid container justifyContent="center" sx={style.gmeetContainer}>
                            <Grid Container>
                                <Typography sx={{ fontWeight: "bold" }}>Meeting Link :</Typography>
                                <Link href={meetingLink} target="_blank" underline="none" sx={{ fontWeight: "bold" }}>
                                    {meetingLink}
                                </Link>
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
        </StudentDrawer>
    )
}
