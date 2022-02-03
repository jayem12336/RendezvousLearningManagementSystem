import React, {useEffect, useState} from 'react';
import {joinClass, getUser, getDocsByCollection} from '../../../../../utils/firebaseUtil';
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

export default function JoinClass({ isJoinClassOpen, toggleJoinClass, handleOpenJoinClass, userId }) {
    // const [userId, setUserId] = useState('');
    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState('')


    // useEffect(() => {
    //     getUser().then(user => {
    //         if(user){
    //             setUserId(user.uid)
    //         } 
    //     })
    //   }, []);

    const hanldeJoinClass = () => {
        if(classCode === ''){
            setError('Please input class code')
        }else {
            joinClass('createclass', classCode, userId ).then(() => {
                setClassCode('')
                handleOpenJoinClass()
            })
        }
        
    }

    const handleChangeClassCode = (e) => {
        setClassCode(e.target.value)
        
    }

      console.log(userId)

    return (
        <div>
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
