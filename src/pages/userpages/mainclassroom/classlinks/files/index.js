import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';

import {
    Typography,
    Box,
    Grid,
    Button,
    LinearProgress,
    Link
} from '@mui/material';

import Classdrawer from '../../classdrawer/ClassDrawer';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useSelector } from 'react-redux';

import { getDocsByCollection } from '../../../../../utils/firebaseUtil'



const style = {
    gridcontainer: {
        display: "flex",
        padding: 2,
        borderColor: (theme) => theme.palette.primary.main,
        maxWidth: 1200
    },
    gridcontainerClass: {
        display: "flex",
        padding: 2,
        cursor: 'pointer',
        marginTop: -3
    },
    main: {
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
    },
    iconStyle: {
        color: (theme) => theme.palette.primary.main,
        margin: 0.5
    },
    btnStyle: {
        borderRadius: 20,
        fontSize: 20,
        width: 150,
        marginRight: 2,
        marginBottom: 4,
        textTransform: 'none',
        color: (theme) => theme.colors.textColor,
        backgroundColor: (theme) => theme.palette.primary.main,
        '&:hover': {
            backgroundColor: "#3e857f",
            boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
        },
    },
    textStyle: {
        paddingLeft: 2,
        fontSize: 20,
        fontWeight: 400
    },
    linkStyle: {
        cursor: 'pointer',
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 600
    },
    imgStyle: {
        height: 300,
        width: 300,

    },
    imgContainer: {
        width: 200
    },
    txtContainer: {
        width: 500
    },
    headerClass: {
        backgroundColor: '#4BAEA6',
        width: '112%',
        marginLeft: -2,
        height: 70,
        marginTop: -2,
        paddingTop: 2
    }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Files() {

    const [loading, setLoading] = useState(true)
    const [fileList , setFileList] = useState([])

    const { user } = useSelector((state) => state);

    useEffect(() => {
        if (Object.keys(user.currentUser).length !== 0) {
            getFileList()
            setLoading(false)
        }
    }, [user]);

    const getFileList = () => {
        getDocsByCollection('files').then(data => {
          const dataFile = data.filter(item => item.ownerId === user.currentUser.uid).map(item => {
            return item
          })
          setFileList(dataFile)
        })
      }

    return (
        <Classdrawer headTitle='Files' loading={loading}>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Box component={Grid} container justifyContent="flex-start">
                        <Box component={Grid} container justifyContent="center" sx={{ marginBottom: 2 }}>
                            <Typography variant="h4"> Files </Typography>
                        </Box>
                        <TableContainer component={Paper} justifyContent="center" sx={{marginTop: 10}}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell sx={{ backgroundColor: '#4BAEA6', fontWeight: 'bold', fontSize: 20, color: 'white', width: '40%'}}>File Name</TableCell>
                                    <TableCell sx={{ backgroundColor: '#4BAEA6', fontWeight: 'bold', fontSize: 20, color: 'white', width: '30%' }}>Created Date</TableCell>
                                    <TableCell sx={{ backgroundColor: '#4BAEA6', fontWeight: 'bold', fontSize: 20, color: 'white', width: '40%' }}>Category</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    
                                        {fileList && fileList.map(item => 
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%'}}>
                                            <Link style={{marginTop: 12}} href={item.url} underline="none">
                                                {item.name}
                                            </Link>
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%'}}>{new Date(item.createdDate.seconds * 1000).toLocaleDateString()}</StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '30%'}}>{item.category}</StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        {/* <StyledTableCell component="th" scope="row">
                                            01/21/2021 01.00PM
                                        </StyledTableCell>
                                        <StyledTableCell align="start">Word.docs</StyledTableCell> */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Box>
        </Classdrawer >
    )
}
