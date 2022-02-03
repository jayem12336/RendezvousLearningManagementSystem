import React, { useState , useEffect} from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import {getUser} from '../../../../../utils/firebaseUtil'

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

import CreateClass from './CreateClass';
import JoinClass from './JoinClass';

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

export default function ClassList() {

  const history = useHistory();
  const { user } = useSelector((state) => state);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isTeacher, setIsTeacher] = useState(false)
  const [studentData, setStudentData] = useState({})

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const [classroom, setClassroom] = useState([]);

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

  //Create Activity Dialog
  const [createActivityOpen, setCreateActivityOpen] = useState(false);

  const handleCreateActivityOpen = () => {
      handleClose();
      setCreateActivityOpen(!createActivityOpen);
  }

  //Create Lab Dialog
  const [createLabOpen, setCreateLabOpen] = useState(false);

  const handleCreateLabOpen = () => {
      handleClose();
      setCreateLabOpen(!createLabOpen);
  }

  //Create Quiz Dialog
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  const handleCreateQuizOpen = () => {
      handleClose();
      setCreateQuizOpen(!createQuizOpen);
  }

  //Create Exam Dialog
  const [createExamOpen, setCreateExamOpen] = useState(false);

  const handleCreateExamOpen = () => {
      handleClose();
      setCreateExamOpen(!createExamOpen);
  }

  //Load classrooms
  useEffect(() => {
     
    if(Object.keys(user.currentUser).length !== 0){
        getClassData()
        getUser().then(data => {
            data.map(item => {
                setIsTeacher(item.isTeacher)
                setStudentData(item)
            })
            
        })
      }
    
    
  }, [user]);

//   const getClassData =  () => {
//     const classCollection = collection(db, "createclass")
//     const q =  query(classCollection, where('students', "array-contains", user.currentUser.uid));
//     // const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//         setClassroom(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//         // setLoading(false);
//     }
//     )
//     return unsubscribe;
//   }
const getClassData =  () => {
    const classCollection = collection(db, "studentRecord", user.currentUser.uid, 'classroom')
    // const q =  query(classCollection, where('students', "array-contains", user.currentUser.uid));
    // const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid));
    const unsubscribe = onSnapshot(classCollection, (snapshot) => {
        console.log(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        setClassroom(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        // setLoading(false);
    }
    )
    return unsubscribe;
  }

  const redirectLab = (classCode) => {
    const classCollection = collection(db, "laboratory")
    const q =  query(classCollection, where('classCode', "==", classCode));
    // const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid));
    onSnapshot(q, (snapshot) => {
        snapshot.docs.map(doc => {
            if(doc.data().students.includes(user.currentUser.uid)){
                history.push(`/studentlaboratory/${classCode}`)
            }else {
                console.log('not available')
            }
        })
        // setClassroom(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        // setLoading(false);
    }
    )
  }

  console.log(isTeacher)

  const classroomBody = () => {
    return (
      <Box component={Grid} container justifyContent="center" >
      {classroom && classroom.map(item => 
        <Grid container sx={style.gridcontainerClass} >
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
            <Typography variant="h5" sx={style.linkStyle} onClick={() => history}>{item.className}</Typography>
            <MoreHorizIcon sx={{ marginTop: 0.5, cursor: 'pointer' }} onClick={handleClick} />
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
            </Menu>
          </Grid>
          <Grid container xs={12} direction='column'>
            <Typography variant="p" sx={{ marginTop: 1 }}>section: {item.section}</Typography>
            <Typography variant="p" sx={{ marginTop: 1 }}>subject: {item.subject}</Typography>
            <Typography variant="p" sx={{ marginTop: 1 }}>room: {item.room}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginTop: 1 }}>{item.ownerEmail}</Typography>
          </Grid>
        
          <Grid xs={12} justifyContent='flex-end' container>
            {isTeacher ?
                <>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ marginTop: 2, marginRight: 2 }}
                        onClick={() => history.push(`/classannouncement/${item.classCode}`)}
                    >
                        Create Announcment
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ marginTop: 2, marginRight: 2 }}
                        onClick={() => history.push(`/quiz/${item.classCode}`)}
                    >
                        Create Quiz
                    </Button>
                </>
                :
                <>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ marginTop: 2, marginRight: 2 }}
                        onClick={() => history.push(`/quiz/${item.classCode}`)}
                    >
                        Answer Quiz
                    </Button>
                </>
            }
          <Button 
                variant="contained" 
                color="primary" 
                sx={{ marginTop: 2 }}
                onClick={() => redirectLab(item.classCode)}
            >
                View Laboratory
            </Button>
          </Grid>
        </Grid>
      )}
      </Box>
    )
  }

  console.log(user)

    return (
        <Classdrawer>
            <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
                <Grid container sx={style.gridcontainer} justifyContent="space-between">
                    <Grid item>
                    <Button variant="outlined"
                        sx={style.btnStyle}
                        id="fade-button"
                        aria-controls="fade-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpenJoinClass}
                    > Join</Button>
                        {/* {isTeacher ?
                            <Button variant="outlined"
                                sx={style.btnStyle}
                                id="fade-button"
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleOpenClass}
                            > Create</Button>
                            :
                            <Button variant="outlined"
                                sx={style.btnStyle}
                                id="fade-button"
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleOpenJoinClass}
                            > Join</Button>
                        } */}
                        
                        {/* <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                            sx={{ marginTop: 1 }}
                        >
                            <MenuItem onClick={handleCreateActivityOpen} >
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Activity
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCreateLabOpen} >
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Laboratory
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCreateQuizOpen}>
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Quiz
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleCreateExamOpen}>
                                <AssignmentIcon />
                                <Typography sx={style.textStyle}>
                                    Exam
                                </Typography>
                            </MenuItem>
                        </Menu> */}
                    </Grid>
                    {/* <Grid item>
                        <Grid Container sx={{ marginTop: -1.5 }}>
                            <Button>
                                <DateRangeIcon />
                                <Typography sx={style.linkStyle}>
                                    Laboratory
                                </Typography>
                            </Button>
                            <Button>
                                <AddToDriveIcon />
                                <Typography sx={style.linkStyle}>
                                    Class Drive Folder
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Box>
            {classroom ?
              <Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
                  {classroomBody()}
              </Box>
              :
              <Box component={Grid} container justifyContent="center" alignItems="center" sx={{ paddingTop: 5, flexDirection: "column" }}>
                <Box component={Grid} container justifyContent="center" sx={style.imgContainer}>
                    <Box component="img" src={bgImage} alt="Animated Computer" sx={style.imgStyle} />
                </Box>
                <Box component={Grid} container justifyContent="center" sx={style.txtContainer}>
                    <Typography>
                        This is where you'll see classrooms.
                    </Typography>
                    <Typography>
                        You can join class, see activities and check available quiz
                    </Typography>
                </Box>
              </Box>
            }
           
            
            <CreateClass
                isClassOpen={classOpen}
                toggleClass={handleOpenClass}
            />
            <JoinClass
                isJoinClassOpen={joinClassOpen}
                toggleJoinClass={handleOpenJoinClass}
                handleOpenJoinClass={handleOpenJoinClass}
                userId={user.currentUser.uid}
                studentData={studentData}
            />
            <CreateActivityDialog
                isCreateActivityOpen={createActivityOpen}
                toggleCreateActivity={handleCreateActivityOpen}
            />
            <CreateLabDialog
                isCreateLabOpen={createLabOpen}
                toggleCreateLab={handleCreateLabOpen}
            />
            <CreateQuizDialog
                isCreateQuizOpen={createQuizOpen}
                toggleCreateQuiz={handleCreateQuizOpen}
            />
            <CreateExamDialog
                isCreateExamOpen={createExamOpen}
                toggleCreateExam={handleCreateExamOpen}
            />
        </Classdrawer >
    )
}
