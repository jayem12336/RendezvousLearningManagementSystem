import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser, updateLabScore, saveLabStudent, updateAssignScore } from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import {
  Typography,
  Box,
  Grid,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Collapse, InputAdornment,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';

import { styled } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';


import { useParams } from 'react-router-dom';

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';

import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

// import CreateClass from './CreateClass';
// import JoinClass from './JoinClass';

const style = {
  gridcontainer: {
    display: "flex",
    marginTop: 5,
    padding: 2,
    maxWidth: 1100,
    borderBottom: 0.5,
    borderColor: (theme) => theme.palette.primary.main
  },
  gridcontainerClass: {
    display: "flex",
    // boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1100
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
    paddingLeft: 0
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
    width: '100%'
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

export default function StudentList() {

  const history = useHistory();
  const { user } = useSelector((state) => state);
  const params = useParams()

  const [isTeacher, setIsTeacher] = useState(false)
  const [classCode, setClassCode] = useState('')

  const [classroom, setClassroom] = useState([]);
  const [students, setStudents] = useState([])
  const [title, setTitle] = useState('')
  const [quizList, setQuizList] = useState([])
  const [labList, setLabList] = useState([])
  const [edit, setEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [examList, setExamList] = useState([])
  const [assignmentList, setAssignmentList] = useState([])


  //Load classrooms
  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getClassData()
      getUser().then(data => {
        data.map(item => {
          setIsTeacher(item.isTeacher)
        })
      })
      getStudentQuizData()
      getStudentLabData()
      getStudentExamData()
      getStudentAssignmentData()
    }


  }, [user]);

  const getStudentQuizData = () => {
    const studentQuizCollection = collection(db, "studentRecord")
    onSnapshot(studentQuizCollection, (snapshot) => {
      setQuizList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getStudentExamData = () => {
    const studentQuizCollection = collection(db, "studentRecord")
    onSnapshot(studentQuizCollection, (snapshot) => {
      setExamList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getStudentLabData = () => {
    const studentLabCollection = collection(db, "studentRecord")
    onSnapshot(studentLabCollection, (snapshot) => {
      setLabList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getStudentAssignmentData = () => {
    const studentLabCollection = collection(db, "studentRecord")
    onSnapshot(studentLabCollection, (snapshot) => {
      setAssignmentList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const onChangeLabScore = (e, i, index) => {
    const lab = [...labList];
    lab[index].laboratory[i].score = e.target.value;
    // setAddQuestion(questionList)
    setLabList(lab)

    // return () => clearTimeout(timeout)

  }

  const onChangeAssignScore = (e, i, index) => {
    const assign = [...assignmentList];
    assign[index].assignment[i].score = e.target.value;
    // setAddQuestion(questionList)
    setAssignmentList(assign)

    // return () => clearTimeout(timeout)

  }
  const saveLabScore = (e, i, index) => {
    const lab = [...labList];
    if (e.key === 'Enter') {
      const timeout = setTimeout(() => {
        updateLabScore(lab[index].laboratory[i], i)
        setOpen(true)
      }, 250)
    }
    // const timeout = setTimeout(() => {
    //   updateLabScore(lab[index].laboratory[i], i)
    //   setOpen(true)
    // }, 250)

  }

  const saveAssignScore = (e, i, index) => {
    const assign = [...assignmentList];
    if (e.key === 'Enter') {
      const timeout = setTimeout(() => {
        updateAssignScore(assign[index].assignment[i], i)
        setOpen(true)
      }, 250)
    }
    // const timeout = setTimeout(() => {
    //   updateLabScore(lab[index].laboratory[i], i)
    //   setOpen(true)
    // }, 250)

  }

  const getClassData = () => {
    const classCollection = collection(db, "createclass")
    const qTeacher = query(classCollection, where('ownerId', "==", user.currentUser.uid), where('classCode', "==", params.id));
    const unsubscribe = onSnapshot(qTeacher, (snapshot) => {
      setClassroom(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
      snapshot.docs.map(doc => {
        setClassCode(doc.data().classCode)
        setTitle(doc.data().className)
        setStudents(doc.data().students.filter(item => item.isJoin === true))
      })

      // setLoading(false);
    }
    )
    return unsubscribe;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  const renderLab = (laboratory, index) => (
    Object.keys(laboratory).filter(key => params.id === laboratory[key].classCode).map(key => (
      <TableRow>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black', width: '40%' }}>
          {laboratory[key].title}
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          <TextField
            id="input-with-icon-textfield"
            label="Score"
            value={laboratory[key].score}
            onChange={(e) => onChangeLabScore(e, key, index)}
            onKeyDown={(e) => saveLabScore(e, key, index)}
            // onMouseLeave={(e) => saveLabScore(e, key, index)}
            disabled={!edit ? false : true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditOutlinedIcon
                    onClick={() => setEdit(!edit)}
                  />
                </InputAdornment>
              ),
              sx: { fontWeight: 'bold', fontSize: 15, color: 'black' }
            }}
            InputLabelProps={{
              sx: { fontWeight: 'bold', fontSize: 15 }
            }}
            variant="standard"
          />
        </TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: 15 }}
            onClick={() => history.push(`/viewlab/${params.id}/${laboratory[key].labId}/${laboratory[key].studentId}`)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ))
  )

  const renderAssignment = (assignment, index) => (
    assignment && Object.keys(assignment).filter(key => params.id === assignment[key].classCode).map(key => (
      <TableRow>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black', width: '40%' }}>
          {assignment[key].title}
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          <TextField
            id="input-with-icon-textfield"
            label="Score"
            value={assignment[key].score}
            onChange={(e) => onChangeAssignScore(e, key, index)}
            onKeyDown={(e) => saveAssignScore(e, key, index)}
            // onMouseLeave={(e) => saveLabScore(e, key, index)}
            disabled={!edit ? false : true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditOutlinedIcon
                    onClick={() => setEdit(!edit)}
                  />
                </InputAdornment>
              ),
              sx: { fontWeight: 'bold', fontSize: 15, color: 'black' }
            }}
            InputLabelProps={{
              sx: { fontWeight: 'bold', fontSize: 15 }
            }}
            variant="standard"
          />
        </TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: 15 }}
            onClick={() => history.push(`/viewassignment/${params.id}/${assignment[key].assignmentId}/${assignment[key].studentId}`)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ))
  )

  const renderQuiz = (quiz, index) => (
    Object.keys(quiz).filter(key => params.id === quiz[key].classCode).map(key => (
      <TableRow>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {quiz[key].title}
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {new Date(quiz[key].dueDate.seconds * 1000).toLocaleDateString()}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {quiz[key].result.correctPoints} / {quiz[key].result.totalPoints}
        </TableCell>
      </TableRow>
    ))
  )

  const renderExam = (exam, index) => (
    Object.keys(exam).filter(key => params.id === exam[key].classCode).map(key => (
      <TableRow>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {exam[key].title}
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {new Date(exam[key].dueDate.seconds * 1000).toLocaleDateString()}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
          {exam[key].result.correctPoints} / {exam[key].result.totalPoints}
        </TableCell>
      </TableRow>
    ))
  )

  /*
  const handleAccept = (classCode, userId, classData, studentData) => {
    acceptStudent('createclass', classCode, classData, studentData)
  }

  const handleRemove = (classCode, userId, studentData) => {
    removeStudent('createclass', classCode, userId, studentData)
  } */

  const classroomBody = () => {
    return (
      <Box component={Grid} container justifyContent="center" >
        {classroom && classroom.map(item =>
          <Grid container sx={style.gridcontainerClass} >
            {/* <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginTop: 1 }}>{item.ownerEmail}</Typography>
          </Grid> */}
            <Grid item xs={12}>
              <Grid container justifyContent='center'>
                <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: 30, marginBottom: 4 }}>Student Grade</Typography>
              </Grid>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700, margin: 0 }} aria-label="customized table">
                  <TableHead>
                    <TableRow >
                      <TableCell sx={{ backgroundColor: '#4BAEA6', fontWeight: 'bold', fontSize: 20, color: 'white' }}>Grades</TableCell>
                      {/* <StyledTableCell align="left">Email</StyledTableCell> */}
                      {/* <StyledTableCell align="center">Action</StyledTableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    {students && students.map((row) => (
                      <>
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>Name of Student: {row.displayName}</Typography>
                          </StyledTableCell>
                        </StyledTableRow>
                        <TableRow key={row.name}>
                          <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box sx={{ padding: 1 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
                                Quiz
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Quiz Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '30%' }}>Due Date</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Score</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {quizList && quizList.map((item, index) => (
                                    item.id === row.ownerId &&
                                    renderQuiz(item.quiz ? item.quiz : [], index)
                                  ))}
                                  {/* {quizList && quizList.map(item => (
                                    item.quiz && item.quiz.filter(item => item.studentId === row.ownerId).map(data => (
                                      <TableRow>
                                        <TableCell component="th" scope="row">
                                          {data.title}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(data.dueDate.seconds * 1000).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                          {data.result.correctPoints} / {data.result.totalPoints}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ))} */}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableRow>
                        <TableRow key={row.name}>
                          <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box sx={{ padding: 1 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
                                Exam
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Exam Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '30%' }}>Due Date</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Score</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {examList && examList.map((item, index) => (
                                    item.id === row.ownerId &&
                                    renderExam(item.exam ? item.exam : [], index)
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableRow>
                        <TableRow key={row.name}>
                          <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box sx={{ padding: 1 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
                                Laboratory
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Lab Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '30%' }}>Score</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>View Lab</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {labList && labList.map((item, index) => (
                                    item.id === row.ownerId &&
                                    renderLab(item.laboratory, index)
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableRow>
                        <TableRow key={row.name}>
                          <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box sx={{ padding: 1 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
                                Assignment
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>Assignment Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '30%' }}>Score</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 17, color: 'black', width: '40%' }}>View Assignment</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {assignmentList && assignmentList.map((item, index) => (
                                    item.id === row.ownerId &&
                                    renderAssignment(item.assignment, index)
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Box>
    )
  }

  return (
    <Teacherdrawer classCode={params.id} headTitle={title}>
      <Helmet>
        <title>Class Grade</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        open={open}
        onClose={handleClose}
        message="I love snacks"
      // key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
          Score Updated!
        </Alert>
      </Snackbar>
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
            <Typography sx={style.linkStyle}>
              This is where you'll see classrooms.
            </Typography>
            <Typography sx={style.linkStyle}>
              You can join class, see activities and check available quiz
            </Typography>
          </Box>
        </Box>
      }
    </Teacherdrawer >
  )
}