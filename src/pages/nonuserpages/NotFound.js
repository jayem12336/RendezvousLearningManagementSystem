import React from 'react';

import {
    Box,
    Grid,
    Typography,
    Button
} from '@mui/material'

import { useHistory } from 'react-router-dom';

const style = {
    wrapper: {
        padding: '150px 0'
    },
    textTitle: {
        fontSize: {
            xs: 80,
            md: 150,
        },
        fontWeight: 700
    },
    textSecond: {
        fontSize: 25,
        fontWeight: 700,
        paddingTop: 2
    },
    container: {
        width: 500,
    },
    textThird: {
        textAlign: 'center',
        paddingTop: 5,
        fontSize: 18
    },
    btnback: {
        marginTop: 5,
        backgrounColor: '#4BAEA6',
        borderRadius: 100,
        width: 180,
        height: 40
    }
}

export default function NotFound() {

    const history = useHistory();
    return (
        <Box sx={style.wrapper} component={Grid} container justifyContent="center" alignItems="center">
            <Box sx={style.container} component={Grid} container justifyContent="center">
                <Typography sx={style.textTitle}> Oops ! </Typography>
                <Typography sx={style.textSecond}> 404 - PAGE NOT FOUND </Typography>
                <Typography sx={style.textThird}> This page you are looking for might have been removed had its name changed or is temporarily unavailable </Typography>
                <Button variant="contained" sx={style.btnback} onClick={() => history.goBack()}> Go Back </Button>
            </Box>
        </Box>
    )
}
