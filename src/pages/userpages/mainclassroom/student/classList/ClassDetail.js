import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, acceptStudent, removeStudent, getDocsByCollection } from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';
import {
  Typography,
  Box,
  Grid,
  Button,
  Menu,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Snackbar,
  Alert
} from '@mui/material';

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';


import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import Studentdrawer from '../../classdrawer/ClassDrawerStudent';
import AssignmentIcon from '@mui/icons-material/Assignment';


import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

// import CreateActivityDialog from '../classwork/CreateActivityDialog';
// import CreateQuizDialog from '../classwork/CreateQuizDialog';
// import CreateExamDialog from '../classwork/CreateExamDialog';
// import CreateLabDialog from '../classwork/CreateLabDialog';

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
    // boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 900
  },
  gridcontainerCard: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 2,
    padding: 2,
    maxWidth: 900,
    cursor: 'pointer'
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
    paddingLeft: 0,
    fontWeight: "bold"
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

export default function ClassListDetail() {

  const history = useHistory();
  const { user } = useSelector((state) => state);
  const params = useParams()
  const id = (uuidv4().slice(-8));


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isTeacher, setIsTeacher] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [title, setTitle] = useState('')
  const [labList, setLabList] = useState([])
  const [quizList, setQuizList] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateMessage, setDateMessage] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [examList, setExamList] = useState([])
  const [assignmentList, setAssignmentList] = useState([])


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

    if (Object.keys(user.currentUser).length !== 0) {
      getClassData()
      getLabList()
      getQuizList()
      getExamList()
      getAssignmentList()
      getUser().then(data => {
        data.map(item => {
          setIsTeacher(item.isTeacher)
        })
      })
    }
  }, [user]);

  const getLabList = () => {
    const labCollection = collection(db, "createclass", params.id, "students", user.currentUser.uid, "laboratory")
    const qTeacher = query(labCollection, where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setLabList(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
    }
    )
    return unsubscribe;
  }

  const getQuizList = () => {
    const labCollection = collection(db, "quiz")
    const qTeacher = query(labCollection, where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setQuizList(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
    }
    )
    return unsubscribe;
  }

  const getExamList = () => {
    const labCollection = collection(db, "exam")
    const qTeacher = query(labCollection, where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setExamList(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
    }
    )
    return unsubscribe;
  }

  const getAssignmentList = () => {
    const assignCollection = collection(db, "assignment")
    const qTeacher = query(assignCollection, where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setAssignmentList(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
    }
    )
    return unsubscribe;
  }

  const getClassData = () => {
    const classCollection = collection(db, "createclass")
    const q = query(classCollection, where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClassroom(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
      snapshot.docs.map(doc => {
        setClassCode(doc.data().classCode)
        setTitle(doc.data().className)
      })
      // setLoading(false);
    }
    )
    return unsubscribe;
  }

  const reDirectQuiz = (quizClassId, quizId, startDate, dueDate) => {
    if (startDate.seconds >= Timestamp.now().seconds && dueDate.seconds > Timestamp.now().seconds) {
      setDateMessage('Quiz is not yet started')
      setOpenSnack(true)
    } else {
      if (dueDate.seconds <= Timestamp.now().seconds) {
        setOpenSnack(true)
        setDateMessage('Quiz end')
      } else {
        history.push(`/studentquizdetail/${quizClassId}/${quizId}`)
      }
    }
  }

  const reDirectExam = (examClassId, examId, startDate, dueDate) => {
    if (startDate.seconds >= Timestamp.now().seconds && dueDate.seconds > Timestamp.now().seconds) {
      setDateMessage('Exam is not yet started')
      setOpenSnack(true)
    } else {
      if (dueDate.seconds <= Timestamp.now().seconds) {
        setOpenSnack(true)
        setDateMessage('Exam end')
      } else {
        history.push(`/studentexamdetail/${examClassId}/${examId}`)
      }
    }
  }

  const reDirectLab = (labClassId, labId, startDate, dueDate) => {
    if (startDate.seconds >= Timestamp.now().seconds && dueDate.seconds > Timestamp.now().seconds) {
      setDateMessage('Laboratory is not yet started')
      setOpenSnack(true)
    } else {
      if (dueDate.seconds <= Timestamp.now().seconds) {
        setOpenSnack(true)
        setDateMessage('Laboratory end')
      } else {
        history.push(`/studentlaboratorydetail/${labClassId}/${labId}`)
      }
    }
  }

  const reDirectAssignment = (assignmentClassId, assignmentIdId, createdDate, dueDate) => {
    if (dueDate.seconds >= Timestamp.now().seconds) {
      history.push(`/studentassignmentdetail/${assignmentClassId}/${assignmentIdId}`)
    } else {
      setDateMessage('Assignment expired')
      setOpenSnack(true)
    }
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  };

  const classroomBody = () => {
    return (
      classroom && classroom.map(item =>
        <>
          <Box component={Grid} container justifyContent="center" >

            <Grid container sx={style.gridcontainerClass} >
              <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Classroom name : {item.className}</Typography>
              </Grid>
              <Grid container xs={12} direction='column'>
                <Typography variant="p" sx={{ marginTop: 1, fontWeight: "bold" }}>section: {item.section}</Typography>
                <Typography variant="p" sx={{ marginTop: 1, fontWeight: "bold" }}>subject: {item.subject}</Typography>
                <Typography variant="p" sx={{ marginTop: 1, fontWeight: "bold" }}>room: {item.room}</Typography>
              </Grid>
            </Grid>

          </Box>

          <Box component={Grid} container justifyContent="center" >
            <Box sx={{maxWidth: 900}}>
              <Grid container sx={style.gridcontainerClass} style={{ padding: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assignment List</Typography>
              </Grid>
              {assignmentList.length !== 0 ? assignmentList.map(item =>
                <Grid container sx={style.gridcontainerCard} onClick={() => reDirectAssignment(item.classCode, item.assignmentId, item.created, item.dueDate)}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Assignment name : {item.title}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>created: {new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>due date: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()} {new Date(item.dueDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                </Grid>
              ) :
                <Grid container sx={style.gridcontainerCard}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>No Available Assignment{item.title}</Typography>
                  </Grid>
                </Grid>
              }
              <Grid container sx={style.gridcontainerClass}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Laboratory List</Typography>
              </Grid>

              {labList.length !== 0 ? labList.map(item =>
                <Grid container sx={style.gridcontainerCard} onClick={() => reDirectLab(item.classCode, item.labId, item.startDate, item.dueDate)}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Laboratory name : {item.title}</Typography>
                    <Typography variant="p" sx={style.linkStyle} onClick={() => null}>Score : {item.score ? item.score : 0}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>created: {new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
                    {/* <Typography variant="p" sx={{ marginTop: 1 }}>No. of student: {item.students.length !== 0 ? item.students.length : 0}</Typography> */}
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>due date: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()} {new Date(item.dueDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                </Grid>
              ) :
                <Grid container sx={style.gridcontainerCard}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>No Available Laboratory{item.title}</Typography>
                  </Grid>
                </Grid>
              }

              <Grid container sx={style.gridcontainerClass} style={{ padding: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quiz List</Typography>
              </Grid>

              {quizList.length !== 0 ? quizList.map(item =>
                <Grid container sx={style.gridcontainerCard} onClick={() => reDirectQuiz(item.classCode, item.quizId, item.startDate, item.dueDate)}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Quiz name : {item.title}</Typography>
                    <Typography variant="p" sx={style.linkStyle} onClick={() => null}>Score : {item.result ? `${item.result.correctPoints} / ${item.result.totalPoints} ` : 'not available'}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>start date: {new Date(item.startDate.seconds * 1000).toLocaleDateString()} {new Date(item.startDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>due date: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()} {new Date(item.dueDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.startDate.seconds >= Timestamp.now().seconds && item.dueDate.seconds > Timestamp.now().seconds && 'Quiz is not yet started'}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.dueDate.seconds <= Timestamp.now().seconds && 'Quiz end'}</Typography>
                  </Grid>
                </Grid>
              ) :
                <Grid container sx={style.gridcontainerCard}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>No Available Quiz{item.title}</Typography>
                  </Grid>
                </Grid>
              }

              <Grid container sx={style.gridcontainerClass} style={{ padding: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Exam List</Typography>
              </Grid>

              {examList.length !== 0 ? examList.map(item =>
                <Grid container sx={style.gridcontainerCard} onClick={() => reDirectExam(item.classCode, item.examId, item.startDate, item.dueDate)}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>Exam name : {item.title}</Typography>
                    <Typography variant="p" sx={style.linkStyle} onClick={() => null}>Score : {item.result ? `${item.result.correctPoints} / ${item.result.totalPoints} ` : 'not available'}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>start date: {new Date(item.startDate.seconds * 1000).toLocaleDateString()} {new Date(item.startDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>due date: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()} {new Date(item.dueDate.seconds * 1000).toLocaleTimeString()}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.startDate.seconds >= Timestamp.now().seconds && item.dueDate.seconds > Timestamp.now().seconds && 'Exam is not yet started'}</Typography>
                  </Grid>
                  <Grid container xs={12} direction='column'>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.dueDate.seconds <= Timestamp.now().seconds && 'Exam end'}</Typography>
                  </Grid>
                </Grid>
              ) :
                <Grid container sx={style.gridcontainerCard}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                    <Typography variant="h5" sx={style.linkStyle} onClick={() => null}>No Available Exam{item.title}</Typography>
                  </Grid>
                </Grid>
              }

            </Box>
          </Box>

        </>
      )
    )
  }

  return (
    <Studentdrawer classCode={classCode} headTitle={title} loading={loading}>
      <Helmet>
        <title>Student Class Work</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        open={openSnack}
        onClose={handleCloseSnack}
        message="I love snacks"
      // key={vertical + horizontal}
      >
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: '100%', fontWeight: "bold" }}>
          {dateMessage}
        </Alert>
      </Snackbar>
      {classroom ?
        <Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
          {classroomBody()}
        </Box>
        :
        !loading &&
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


      {/* <CreateClass
                isClassOpen={classOpen}
                toggleClass={handleOpenClass}
            /> */}
      <JoinClass
        isJoinClassOpen={joinClassOpen}
        toggleJoinClass={handleOpenJoinClass}
        handleOpenJoinClass={handleOpenJoinClass}
        userId={user.currentUser.uid}
      />
      {/* <CreateActivityDialog
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
            /> */}
    </Studentdrawer >
  )
}
