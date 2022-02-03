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

import { getStudentByAssigned, getDocsByCollection, saveQuizStudent, saveQuizRecord, getQuizStudent } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import Quiz from 'react-quiz-component';


const style = {
  gridcontainer: {
    display: "flex",
    fontWeight: "bold",
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

  const [quizData, setQuizData] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [duration, setDuration] = useState('')
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


  useEffect(() => {
    if (Object.keys(user.currentUser).length !== 0) {
      getStudentList()
    }
  }, [user]);
  // useEffect(() => {
  //   getStudentList()
  // }, []);

  const renderCustomResultPage = (obj) => {
    const data = result.length !== 0 ? result : obj
    // console.log(data.userInput[0])
    // console.log(obj)
    saveQuiz(data)
    return (
      <>
        <Typography variant='h6' sx={{ fontWeight: "bold" }}>
          You have completed the quiz. You got {data.numberOfCorrectAnswers} out of {data.numberOfQuestions} questions.
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
                  variant={answer === data.userInput[index] ? 'contained' : 'outlined'}
                  color={data.userInput[index] === item.correctAnswer ? 'success' : 'error'}
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
      quizId: params.quizId
    }
    getQuizStudent(studentData).then(item => {
      setQuizQuestions({ questions: item.questions })
      // setQuizQuestions(item.questions)
      setQuizTitle(item.title)
      setDueDate(new Date(item.dueDate.seconds * 1000).toLocaleDateString())
      setInstruction(item.instruction)
      setIsDone(item.isDone)
      setResult(item.result ? item.result : [])
      setStudentName(item.students)
    })
  }

  const saveQuiz = (result) => {
    const studentData = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      students: studentName,
      title: quizTitle,
      questions: [...quizQuiestions.questions],
      duration: duration,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      subject: subject,
      quizId: params.quizId,
      studentId: user.currentUser.uid,
      result: result
    }
    saveQuizStudent(studentData)
    saveQuizRecord(studentData)
  }


  return (
    <Studentdrawer headTitle={quizTitle} classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid container>
            <Grid container>
              <TextField
                label='Quiz Title'
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

              />
            </Grid>
            <TextField
              variant="filled"
              multiline
              placeholder="Please enter direction"
              value={instruction}
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
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={style.gridcontainer} justifyContent='space-between' >
          {result.length !== 0 ?
            renderCustomResultPage()
            :
            quizQuiestions &&
            <Quiz
              quiz={quizQuiestions}
              showDefaultResult={false}
              customResultPage={renderCustomResultPage}

            />
          }
        </Grid>
      </Box>
    </Studentdrawer>
  )
}
