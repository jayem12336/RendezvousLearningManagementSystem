import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import Studentdrawer from '../../classdrawer/ClassDrawerStudent';
import { Timestamp } from 'firebase/firestore';

import { getStudentByAssigned, getDocsByCollection, saveExamStudent, saveExamRecord, getExamStudent } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import Quiz from 'react-quiz-component';

const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1000,
    '.react-quiz-container': {
      width: '100%'
    }
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
    width: 'auto',
    marginLeft: 5,
  },
  btnStyleFooter: {
    width: '100%',
    marginTop: 12,
    fontWeight: "bold"
  },
  addBtncontainer: {
    display: "flex",
    marginTop: 5,
    maxWidth: 1000
  },
  inputText: {
    fontWeight: 'bold'
  },
}


export default function QuizDetail() {
  const setQuizResult = (obj) => {
    //
  }

  const [quizData, setQuizData] = useState([])
  const [userId, setUserId] = useState('');
  // const [quizQuiestions, setQuizQuestions] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [students, setStudents] = useState([])
  const [duration, setDuration] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [subject, setSubject] = useState('')
  const [quizTitle, setQuizTitle] = useState('')
  const [quizQuiestions, setQuizQuestions] = useState(null)
  const [instruction, setInstruction] = useState('')
  const [result, setResult] = useState([])
  const [isDone, setIsDone] = useState(false)


  const params = useParams()
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const id = (uuidv4().slice(-8));


  useEffect(() => {
    if (Object.keys(user.currentUser).length !== 0) {
      getStudentList()
    }
  }, [user]);


  const renderCustomResultPage = (obj) => {
    const data = result.length !== 0 ? result : obj
    saveQuiz(data)
    return (
      <>
        <Typography variant='h6' sx={{ fontWeight: "bold" }}>
          You have completed the exam. You got {data.numberOfCorrectAnswers} out of {data.numberOfQuestions} questions.
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: "bold" }}>
          You scored {data.correctPoints} out of {data.totalPoints}.
        </Typography>

        {data.questions.map((item, index) =>
          <Grid container sx={style.gridcontainer} justifyContent='space-between'>
            <Grid container xs={12}>
              <Typography variant='p' sx={{ fontWeight: "bold" }}>
                {item.question}
              </Typography>
            </Grid>
            {item.answers.map((answer, i) =>
              <Grid container xs={12} style={{ marginTop: 8 }}>
                <Button
                  variant={answer == data.userInput[index] ? 'contained' : 'outlined'}
                  color={data.userInput[index] == item.correctAnswer ? 'success' : 'error'}
                  disbaled
                >
                  {answer}
                </Button>
              </Grid>
            )}
            <Grid container xs={12} style={{ marginTop: 8 }}>
              <Typography variant='p' sx={{ fontWeight: "bold" }}>
                Correct answer : {item.correctAnswer}
              </Typography>
            </Grid>
            <Grid container xs={12} style={{ marginTop: 8 }}>
              <Typography variant='p' sx={{ fontWeight: "bold" }}>
                Points : {item.point}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid item sx={{ marginTop: 0.5 }}>
          <Button
            variant="contained"
            // disabled={announcementContent ? false : true} 
            style={style.btnStyleFooter}
            onClick={() => history.push(`/studentclassroomdetail/${params.id}`)}
          >
            Go To Class Dashboard
          </Button>
        </Grid>
      </>
    )
  }

  const getStudentList = () => {
    // getDocsByCollection('users').then(data => {
    //   const students = data.filter(item => item.isTeacher === false).map(item => {
    //     let studentArr = []
    //     studentArr = {label:item.displayName, value:item.ownerId}
    //     return studentArr
    //   })
    //   const studentsRaw = data.filter(item => item.isTeacher === false)
    //   setStudents(studentsRaw)
    //   setStudentsList(students)
    // })
    getStudentByAssigned(params.id).then(item => {
      const students = item.students.filter(item => item.isJoin === true).map(item => {
        let studentArr = []
        studentArr = { label: item.displayName, value: item.ownerId }
        return studentArr
      })
      setStudentsList(students)
    })
    getDocsByCollection('createclass').then(data => {
      data.filter(item => item.classCode === params.id).map(item => {
        setSubject(item.subject)
      })

    })
    // getDocsByCollection('quiz').then(data => {
    //   data.filter(item => item.quizId === params.quizId).map(item => {
    //     setQuizQuestions({questions:item.questions})
    //     setQuizTitle(item.title)
    //     setDueDate(item.dueDate)
    //     setInstruction(item.instruction)
    //   })
    // })
    const studentData = {
      classCode: params.id,
      studentId: user.currentUser.uid,
      examId: params.examId
    }
    getExamStudent(studentData).then(item => {
      // setQuizQuestions({questions:item.questions})
      setQuizQuestions({
        questions: item.questions, "appLocale": {
          "startQuizBtn": "Start Exam",
        }
      })
      // setQuizQuestions(item.questions)
      setQuizTitle(item.title)
      setDueDate(new Date(item.dueDate.seconds * 1000).toLocaleString())
      setStartDate(new Date(item.startDate.seconds * 1000).toLocaleString())
      setInstruction(item.instruction)
      setIsDone(item.isDone)
      setResult(item.result ? item.result : [])
      setStudentName(item.students)
    })
  }

  const getQuiz = () => {
    getDocsByCollection('quiz')
      .then(item => {
        // const data = item.filter(item => item.classCode === params.id)
        setQuizData(item)
      })
  }

  // const addQuestion = () => {
  //   let questions = {
  //     question:'',
  //     item: 0,
  //     choiceOne:'',
  //     choiceTwo:'',
  //     choiceThree:'',
  //     choiceFour:'',
  //     answerKey:''
  //   }

  //   setQuizQuestions(quizQuiestions => [...quizQuiestions, questions])
  // }

  // const handleQuizChange = (e, index) => {
  //   const questionList = [...quizQuiestions];
  //   questionList[index][e.target.name] = e.target.value;
  //   setQuizQuestions(questionList);
  // }

  const saveQuiz = (result) => {
    const studentData = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      students: studentName,
      title: quizTitle,
      questions: [...quizQuiestions.questions],
      duration: duration,
      created: Timestamp.now(),
      dueDate: new Date(dueDate),
      startDate: new Date(startDate),
      subject: subject,
      examId: params.examId,
      studentId: user.currentUser.uid,
      result: result
    }
    saveExamStudent(studentData)
    saveExamRecord(studentData)
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStudentName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const setDate = (e) => {
    setDueDate(e)
  }

  const handleDuration = (e) => {
    setDuration(e.target.value)
  }

  return (
    <Studentdrawer headTitle={quizTitle} classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>

          <Grid container>
            <Grid container>
              <TextField
                label='Exam Title'
                variant="outlined"
                sx={{ marginRight: 2, marginBottom: 2 }}
                value={quizTitle}
                disabled
                onChange={(e) => setQuizTitle(e.target.value)}
                InputProps={{
                  sx: style.inputText
                }}
                InputLabelProps={{
                  sx: style.inputText
                }}
              />
              {/* <FormControl sx={{ width: 500 }}>
                  <InputLabel id="select-student-label">Assign Student</InputLabel>
                  <Select
                    labelId="select-student-label"
                    multiple
                    value={studentName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Assign Student" />}
                  >
                    {studentsList.map((name) => (
                      <MenuItem
                        key={name.value}
                        value={name.value}
                        name={name.value}
                        // style={getStyles(name, personName, theme)}
                      >
                        {name.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              {/* <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    label="Due Date"
                    value={dueDate}
                    disabled
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider> */}
              <TextField
                variant="filled"
                disabled
                value={dueDate}
                InputProps={{
                  sx: style.inputText
                }}
                InputLabelProps={{
                  sx: style.inputText
                }}
              // value={announcementContent}
              // onChange={handleAnnoucement}

              />
            </Grid>
            <TextField
              variant="filled"
              multiline
              placeholder="Please enter direction"
              value={instruction}
              // onChange={handleAnnoucement}
              fullWidth
              disabled
              minRows={5}
              InputProps={{
                sx: style.inputText
              }}
              InputLabelProps={{
                sx: style.inputText
              }}
            />
            <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
              {/* <Grid item>
                  <IconButton sx={style.iconStyle}>
                    <AddToDriveIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <FileUploadIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <InsertLinkIcon />
                  </IconButton>
                  <IconButton sx={style.iconStyle}>
                    <YouTubeIcon />
                  </IconButton>
                </Grid> */}
              {/* <Grid item sx={{ marginTop: 0.5 }}>
                  <Button 
                    style={style.btnStyle} 
                    // onClick={cancelAnnouncement}
                  > 
                    cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    // disabled={announcementContent ? false : true} 
                    style={style.btnStyle}
                    // onClick={saveAnnoucement}
                  > 
                    Save
                  </Button>
                </Grid> */}
            </Box>
          </Grid>
        </Grid>
        {/* {quizData && quizBody() } */}

        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          {result.length !== 0 ?
            renderCustomResultPage()
            :
            quizQuiestions &&
            <Quiz
              quiz={quizQuiestions}
              showDefaultResult={false}
              // onComplete={setQuizResult}
              customResultPage={renderCustomResultPage}
            />
          }
        </Grid>



      </Box>
    </Studentdrawer>
  )
}
