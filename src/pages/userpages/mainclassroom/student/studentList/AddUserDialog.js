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
}

export default function AddUserDialog({ isAddUserOpen, toggleUser }) {

    const addUser = () => {

    }

    return (
        <div>
            <Dialog
                open={isAddUserOpen}
                onClose={toggleUser}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Add Student"}
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                        <TextField
                            variant="outlined"
                            placeholder="E-mail"
                            sx={style.textfieldStyle}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={toggleUser}>
                        Back
                    </Button>
                    <Button onClick={addUser} autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
