import React, { useState} from 'react';
import {joinClass} from '../../../../../utils/firebaseUtil';
import {
    Box,
    Button,
    Grid,
    TextField,
    Snackbar,
    Alert
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
}

export default function JoinClass({ isJoinClassOpen, toggleJoinClass, userId,student }) {

    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)
    const hanldeJoinClass = () => {
        
        if(classCode === ''){
            setError('Please input class code')
        }else {
            joinClass('createclass', classCode, student ).then(item => {
                console.log(item)
                setClassCode('')
                setOpen(true)
                toggleJoinClass()
            })
            .catch((error) => {
                setError('No existing class')
            });
        }
    }

    const handleChangeClassCode = (e) => {
        setClassCode(e.target.value)
        
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false)
      };

      console.log(userId)

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                open={open}
                onClose={handleClose}
                message="I love snacks"
            >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
                Request Sent
            </Alert>
            </Snackbar>
            <Dialog
                open={isJoinClassOpen}
                onClose={toggleJoinClass}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Join Class"}
                </DialogTitle>
                <DialogContent>
                    <Box component={Grid} container justifyContent="center" sx={style.formContainer}>
                        <TextField 
                            variant="outlined" 
                            placeholder="Class Code" 
                            sx={style.textfieldStyle} 
                            value={classCode}
                            onChange ={e => handleChangeClassCode(e)}
                            error={error? true : false}
                            helperText={error}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={toggleJoinClass}>
                        Back
                    </Button>
                    <Button onClick={hanldeJoinClass} autoFocus>
                        Join Class
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
