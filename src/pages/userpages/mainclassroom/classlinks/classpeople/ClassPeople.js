import React from 'react';

import {
    Typography,
    Box,
    Grid,
    Button
} from '@mui/material';


import Classdrawer from '../../classdrawer/ClassDrawer';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

function createData(name, email, classtype) {
    return { name, email, classtype };
}

const rows = [
    createData('aldrin guillermo', 'aldrin@yopmail.com', 'Teacher'),
    createData('nico bronoso', 'nico@yopmail.com', 'Student'),
    createData('jomari aquino', 'joms@yopmail.com', 'Student'),
    createData('jarvis mariano', 'jarvs@yopmail.com', 'Student'),
    createData('jerick aguado', 'jerick@yopmail.com', 'Student'),
];

export default function ClassJoinMeet() {

    return (
        <Classdrawer>
            <Box component={Grid} container justifyContent="flex-start" sx={{ padding: 5 }}>
                <Grid container justifyContent="center" alignItems="center" sx={{ margin: 5 }}>
                    <Typography variant="h3"> People </Typography>
                </Grid>
                <TableContainer component={Paper} justifyContent="center">
                    <Table sx={{ minWidth: 300 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="right">Class</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell align="left">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                                    <StyledTableCell align="right">{row.classtype}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button variant="contained" color="error">
                                            Remove
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Classdrawer>
    )
}
