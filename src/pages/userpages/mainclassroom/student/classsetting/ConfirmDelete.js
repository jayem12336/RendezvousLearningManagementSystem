import React from 'react';

import {
    Box,
    Button,
    Grid,
    Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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

export default function ConfirmDelete({ isOpen, handleCloseConfirm, confirmDelete, userId }) {
  
    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: "bold" }}>
                    Confirm Dropping Out
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                        <Typography sx={{ fontWeight: "bold" }}>Are you sure you want to drop to this class? There is no turning back!!!</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseConfirm} sx={style.btnStyle}>
                        No I Changed My Mind
                    </Button>
                    <Button color='error' onClick={confirmDelete} autoFocus sx={style.btnStyle}>
                        Yes Drop Me!!!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
