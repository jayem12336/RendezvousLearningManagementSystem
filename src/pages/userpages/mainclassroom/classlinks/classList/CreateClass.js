import React, { useState } from 'react';

import {
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { v4 as uuidv4 } from 'uuid';

import { db } from '../../../../../utils/firebase';
import { setDoc, doc } from '@firebase/firestore';
import {createClassDoc} from '../../../../../utils/firebaseUtil'


import { useSelector } from "react-redux";

const style = {
    formContainer: {
        flexDirection: "column",
    },
    textfieldStyle: {
        border: 'none',
        marginTop: 2,
        width: 300
    },
    inputText: {
        fontWeight: 'bold'
    },
    btnStyle: {
        fontWeight: "bold"
    }
}

export default function CreateClass({ isClassOpen, toggleClass,displayName }) {
    const id = (uuidv4().slice(-8));


    const [className, setClassName] = useState("");
    const [Section, setSection] = useState("");
    const [Room, setRoom] = useState("");
    const [Subject, setSubject] = useState("");

    const { user } = useSelector((state) => state);

    const createClass = () => {
        if (className === "" || Section === "" || Room === "" || Subject === "") {
            alert("please fill up the following fields")
        }
        else {
            
            // const docRef = doc(db, "createclass", id);
            const payload = {
                className: className,
                section: Section,
                room: Room,
                subject: Subject,
                ownerEmail: user.currentUser.email,
                ownerName: displayName,
                ownerId: user.currentUser.uid,
                classCode: id,
                students: [],
                isDeleted: false,
                isArchived: false
            };
            // await setDoc(docRef, payload);
            createClassDoc('createclass',id,payload)
            toggleClass();
        }
    }

    return (
        <div>
            <Dialog
                open={isClassOpen}
                onClose={toggleClass}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Create Class"}
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                        <TextField
                            variant="outlined"
                            placeholder="Class Name"
                            sx={style.textfieldStyle}
                            onChange={(e) => setClassName(e.target.value)}
                            InputProps={{
                                sx: style.inputText
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Section"
                            sx={style.textfieldStyle}
                            onChange={(e) => setSection(e.target.value)}
                            InputProps={{
                                sx: style.inputText
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Subject Code"
                            sx={style.textfieldStyle}
                            onChange={(e) => setSubject(e.target.value)}
                            InputProps={{
                                sx: style.inputText
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Room"
                            sx={style.textfieldStyle}
                            onChange={(e) => setRoom(e.target.value)}
                            InputProps={{
                                sx: style.inputText
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={toggleClass} sx={style.btnStyle}>
                        Back
                    </Button>
                    <Button onClick={createClass} autoFocus sx={style.btnStyle}>
                        Create Class
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
