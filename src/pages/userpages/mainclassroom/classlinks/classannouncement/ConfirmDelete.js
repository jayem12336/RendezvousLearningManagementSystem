import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useParams } from 'react-router-dom';


const style = {
    formContainer: {
        flexDirection: "column",
    },
    textfieldStyle: {
        border: 'none',
        marginTop: 2,
        width: 300
    },
    btnStyle: {
        fontWeight: "bold"
    }
}

export default function ConfirmDelete({ isOpen, handleCloseConfirm, confirmDeleteItem, userId }) {
    // const [userId, setUserId] = useState('');
    const [classCode, setClassCode] = useState('');

    const params = useParams()


    // useEffect(() => {
    //     getUser().then(user => {
    //         if(user){
    //             setUserId(user.uid)
    //         } 
    //     })
    //   }, []);

    const handleChangeClassCode = (e) => {
        setClassCode(e.target.value)

    }

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: "bold" }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                        <Typography sx={{ fontWeight: "bold" }}>Are you sure you want to delete this announcement? There is no turning back!!!</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseConfirm} sx={style.btnStyle}>
                        No I Changed My Mind
                    </Button>
                    <Button color='error' onClick={confirmDeleteItem} autoFocus sx={style.btnStyle}>
                        Yes Delete This Announcement!!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
