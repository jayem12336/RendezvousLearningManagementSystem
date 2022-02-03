import React, { useState , useEffect} from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import {getUser, getDocsByCollection} from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector} from 'react-redux';


import {
    Typography,
    Box,
    Grid,
    Button,
    Menu,
    MenuItem
} from '@mui/material';

import Classdrawer from '../../classdrawer/ClassDrawer';
import AssignmentIcon from '@mui/icons-material/Assignment';


import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

import CreateActivityDialog from '../classwork/CreateActivityDialog';
import CreateQuizDialog from '../classwork/CreateQuizDialog';
import CreateExamDialog from '../classwork/CreateExamDialog';
import CreateLabDialog from '../classwork/CreateLabDialog';

const style = {
    gridcontainer: {
        display: "flex",
        marginTop: 5,
        padding: 2,
        maxWidth: 900,
        borderBottom: 0.5,
        borderColor: (theme) => theme.palette.primary.main
    },
    gridcontainerClass: {
      display: "flex",
      boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
      marginTop: 5,
      padding: 2,
      maxWidth: 1000
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
        marginTop: -2,
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
        paddingLeft: 2
    },
    imgStyle: {
        height: 300,
        width: 300
    },
    imgContainer: {
        width: 200
    },
    txtContainer: {
        width: 500
    }
}

export default function LabList() {

  const history = useHistory();
  const { user } = useSelector((state) => state);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isTeacher, setIsTeacher] = useState(false)

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const [labList, setLabList] = useState([]);

  //Create Class Dialog
  const [classOpen, setClassOpen] = useState(false);

  const handleOpenClass = () => {
      setClassOpen(!classOpen);
  }

  //Join Class Dialog
  const [joinClassOpen, setOpenJoinClass] = useState(false);

  const handleOpenJoinClass = () => {
      setOpenJoinClass(!joinClassOpen);
  }

  //Load classrooms
  useEffect(() => {
     
    if(Object.keys(user.currentUser).length !== 0){
        getLabData()
        getUser().then(data => {
            data.map(item => {
                setIsTeacher(item.isTeacher)
            })
        })
      }
    
    
  }, [user]);

  const getLabData = () => {
    getDocsByCollection('laboratory').then(item => {
      const data = item.filter(item => item.ownerId === user.currentUser.uid)
      setLabList(data)
    })
  }

  const classroomBody = () => {
    return (
      <Box component={Grid} container justifyContent="center" >
      {labList && labList.map(item => 
        <Grid container sx={style.gridcontainerClass} >
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
            <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>{item.title}</Typography>
            {/* <MoreHorizIcon sx={{ marginTop: 0.5, cursor: 'pointer' }} onClick={handleClick} />
            <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    marginTop: -1
                }}
            >
              <MenuItem>
                Unenroll
              </MenuItem>
            </Menu> */}
          </Grid>
          <Grid container xs={12} direction='column'>
          <Typography>{new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
    
          </Grid>
          
        
          <Grid xs={12} justifyContent='flex-end' container>
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ marginTop: 2 }}
                onClick={() => history.push(`/laboratory/${item.classCode}`)}
            >
                Open Laboratory
            </Button>
          </Grid>
        </Grid>
      )}
      </Box>
    )
  }

    return (
        <Classdrawer>
            {/* <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Grid item>                       
                        <Button variant="outlined"
                            sx={style.btnStyle}
                            id="fade-button"
                            aria-controls="fade-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={() => history.push()}
                        > Create</Button>
                    </Grid>
                </Grid>
            </Box> */}
            {labList ?
              <Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
                  {classroomBody()}
              </Box>
              :
              <Box component={Grid} container justifyContent="center" alignItems="center" sx={{ paddingTop: 5, flexDirection: "column" }}>
                <Box component={Grid} container justifyContent="center" sx={style.imgContainer}>
                    <Box component="img" src={bgImage} alt="Animated Computer" sx={style.imgStyle} />
                </Box>
                <Box component={Grid} container justifyContent="center" sx={style.txtContainer}>
                    <Typography sx={style.linkStyle}>
                        This is where you'll see classrooms.
                    </Typography>
                    <Typography sx={style.linkStyle}>
                        You can join class, see activities and check available quiz
                    </Typography>
                </Box>
              </Box>
            }
        </Classdrawer >
    )
}
