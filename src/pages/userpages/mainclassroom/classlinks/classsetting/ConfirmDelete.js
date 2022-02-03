import React, {useEffect, useState} from 'react';

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
}

export default function ConfirmDelete({ isOpen, handleCloseConfirm, confirmDelete, userId }) {
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

      console.log(userId)

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                      <Typography>Are you sure you want to delete this class? There is no turning back!!!</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseConfirm}>
                        No I Changed My Mind
                    </Button>
                    <Button color='error' onClick={confirmDelete} autoFocus>
                        Yes Delete This Class!!!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
