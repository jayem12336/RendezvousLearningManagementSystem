import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import { useTheme } from '@mui/material/styles';

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import { Timestamp } from 'firebase/firestore';

import { getStudentByAssigned, getDocsByCollection, saveQuizStudent, createClassDoc } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import YouTubeIcon from '@mui/icons-material/YouTube';

const style = {
    gridcontainer: {
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
        width: 'auto',
        marginLeft: 5,
        marginBottom: 12
    },
    addBtncontainer: {
      display: "flex",
      marginTop: 5,
      maxWidth: 1000
  },
}

export default function ClassQuiz() {

  const [quizData, setQuizData] = useState([])
  const [userId, setUserId] = useState('');
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [students, setStudents] = useState([])
  const [duration, setDuration] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [subject, setSubject] = useState('')
  const [quizTitle, setQuizTitle] = useState('')
  const [instruction, setInstruction] = useState('')
  const [answer, setAnswer] = useState([''])
  const [quizQuiestions, setQuizQuestions] = useState([])
  const [addQuestion, setAddQuestion] = useState([{
    question: "",
    questionType: "text",
    questionPic: "",
    answerSelectionType: "single",
    answers: [''],
    correctAnswer: "",
    messageForCorrectAnswer: "Correct answer. Good job.",
    messageForIncorrectAnswer: "Incorrect answer. Please try again.",
    explanation: "",
    point: ""
  }])

  const theme = useTheme();

  const matchMD = useMediaQuery(theme.breakpoints.up('md'));

  const params = useParams()
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const id = (uuidv4().slice(-8));


  useEffect(() => {
    if (Object.keys(user.currentUser).length !== 0) {
      getStudentList()
    }
  }, [user]);
  // useEffect(() => {
  //   getStudentList()
  // }, []);

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
  }

  const getQuiz = () => {
    getDocsByCollection('quiz')
      .then(item => {
        // const data = item.filter(item => item.classCode === params.id)
        setQuizData(item)
      })
  }

  const quizAddQuestion = () => {
    // let questions = {
    //   question:'',
    //   item: 0,
    //   choiceOne:'',
    //   choiceTwo:'',
    //   choiceThree:'',
    //   choiceFour:'',
    //   answerKey:''
    // }
    // setAnswer([''])
    addQuestion.map(item => {
      setQuizQuestions(quizQuiestions => [...quizQuiestions, item])
      setAddQuestion([{
        question: "",
        questionType: "text",
        questionPic: "",
        answerSelectionType: "single",
        answers: [''],
        correctAnswer: "",
        messageForCorrectAnswer: "Correct answer. Good job.",
        messageForIncorrectAnswer: "Incorrect answer. Please try again.",
        explanation: "",
        point: ""
      }])
    })
    
    // setAnswer([''])
    // let questions = {
    //   question: "",
    //   questionType: "text",
    //   questionPic: "",
    //   answerSelectionType: "single",
    //   answers: [''],
    //   correctAnswer: "",
    //   messageForCorrectAnswer: "Correct answer. Good job.",
    //   messageForIncorrectAnswer: "Incorrect answer. Please try again.",
    //   explanation: "",
    //   point: ""
    // }
    // setQuizQuestions(quizQuiestions => [...quizQuiestions, questions])
    
  }

  const addAnswer = (item, index) => {
    let newAnswers = [...addQuestion]
    newAnswers[index].answers = [...newAnswers[index].answers, '']
    setAddQuestion(newAnswers)   
  }
  const onAnswerChange = (e, index, item) => {
    const answerList = [...answer]
    answerList[index] = e.target.value
    setAnswer(answerList)

    let newAnswers = [...addQuestion]
    newAnswers[0].answers[index] = e.target.value
    setAddQuestion(newAnswers)
  }

  // const handleQuizChange = (e, index) => {
  //   const questionList = [...quizQuiestions];
  //   questionList[index][e.target.name] = e.target.value;
  //   setQuizQuestions(questionList);
  // }
  const handleQuizChange = (e, index) => {
    const questionList = [...addQuestion];
    questionList[index][e.target.name] = e.target.value;
    setAddQuestion(questionList)
  }

  const saveQuiz = () => {
    const data = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      title: quizTitle,
      students: studentName,
      questions: quizQuiestions,
      duration: duration,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      subject: subject,
      quizId: params.quizId,
      instruction: instruction

    }
    createClassDoc('quiz', params.quizId, data).then(() => {
      studentName.map(student => {
        const studentData = {
          ownerId: user.currentUser.uid,
          classCode: params.id,
          students: studentName,
          title: quizTitle,
          questions: quizQuiestions,
          duration: duration,
          created: Timestamp.now(),
          dueDate: Timestamp.fromDate(new Date(dueDate)),
          subject: subject,
          quizId: params.quizId,
          studentId: student,
          instruction: instruction
        }
        saveQuizStudent(studentData)
      })
      const timeout = setTimeout(() => {
        history.push(`/classroomdetail/${params.id}`)
      }, 2000)
      return () => clearTimeout(timeout)

    })
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

  console.log(quizQuiestions)
  console.log(answer)
  console.log('addQuestion', addQuestion)

  const quizBody = () => (
    <>
      {quizQuiestions && quizQuiestions.map((item,index) => 
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid xs={12} item>
            <TextField 
              label='Question' 
              variant="outlined" 
              fullWidth
              sx={{marginRight: 2, marginBottom: 2}}
              name='question'
              value={item.question}
              disabled
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
          <Grid xs={12} container direction='column'>
            {item.answers && item.answers.map((item,i) => (
              <Grid container alignItems="center">
                {/* <Typography sx={{marginRight: 2}}>a.)</Typography> */}
                <TextField 
                  label={`Answer ${index + 1}`} 
                  variant="outlined" 
                  sx={{marginRight: 2, marginBottom: 2}}
                  name='answer'
                  value={item}
                  disabled
                  // onChange={(e) => onAnswerChange(e, i,item)}
                />
              </Grid>
            ))
            }
          </Grid>
          <Grid container xs={12}>
          <TextField 
              label='Answer Key' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='answerKey'
              disabled
              value={item.correctAnswer}
              onChange={(e) => handleQuizChange(e, index)}
            />
            {/* <Typography sx={{ marginTop: 2 }}>{item.body}</Typography> */}
          </Grid>
          <Grid container alignItems="center">
            <TextField 
              label='Points' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='point'
              type='number'
              disabled
              value={item.point}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
        
          {/* <Grid xs={12} justifyContent='flex-end' container>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ marginTop: 2 }}
              onClick={(e) => handleQuizChange(e, index)}
            >
              Delete
            </Button>
          </Grid> */}
        </Grid>
      )}
      {addQuestion && addQuestion.map((item,index) => 
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid xs={12} item>
            <TextField 
              label='Question' 
              variant="outlined" 
              fullWidth
              sx={{marginRight: 2, marginBottom: 2}}
              name='question'
              value={item.question}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
          <Grid xs={12} container direction='column'>
            {item.answers && item.answers.map((item,i) => (
              <Grid container alignItems="center">
                {/* <Typography sx={{marginRight: 2}}>a.)</Typography> */}
                <TextField 
                  label={`Answer ${i + 1}`} 
                  variant="outlined" 
                  sx={{marginRight: 2, marginBottom: 2}}
                  name='answer'
                  // value={item}
                  onChange={(e) => onAnswerChange(e, i,item)}
                />
              </Grid>
            ))
            }
          </Grid>
          <Grid xs={12} container direction='column'>
            <Button 
              variant="contained" 
              style={style.btnStyle} 
              onClick={() => addAnswer(item, index)}
            > 
              Add Answer
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: 500, marginBottom: 2 }}>
              <InputLabel id="select-student-label">Answer key</InputLabel>
              <Select
                labelId="select-student-label"
                value={item.correctAnswer}
                onChange={(e) => handleQuizChange(e, index)}
                input={<OutlinedInput name='correctAnswer' id="select-multiple-chip" label="Answer key" />}
              >
                {item.answers.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    // style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          {/* <TextField 
              label='Answer Key' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='correctAnswer'
              value={item.answerKey}
              onChange={(e) => handleQuizChange(e, index)}
            /> */}
            {/* <Typography sx={{ marginTop: 2 }}>{item.body}</Typography> */}
          </Grid>
          <Grid container alignItems="center">
            <TextField 
              label='Points' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='point'
              type='number'
              value={item.point}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
        
          {/* <Grid xs={12} justifyContent='flex-end' container>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ marginTop: 2 }}
              onClick={(e) => handleQuizChange(e, index)}
            >
              Delete
            </Button>
          </Grid> */}
        </Grid>
      )}
    </>
  )

  return (
    <Teacherdrawer headTitle='Create Quiz' classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid container>
            <Typography>Title</Typography>
            <Grid container>
              <TextField
                placeholder="Please Title"
                fullWidth
                label='Quiz Title'
                variant="outlined"
                sx={{ marginRight: 2, marginBottom: 2 }}
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
              </FormControl>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                />
              </LocalizationProvider>
            </Grid>
            <TextField
              variant="filled"
              multiline
              placeholder="Please enter direction"
              // value={announcementContent}
              // onChange={handleAnnoucement}
              fullWidth
              minRows={5}
            />
            <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">

              {/*  <Grid item>
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
              </Grid>
             */}

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

        {matchMD ?
          ""
          :
          <>
            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
              <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 2 }} onClick={saveQuiz}>Create Quiz</Button>
              <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 10 }}>Cancel</Button>
            </Grid>
          </>
        }
        {quizData && quizBody()}

        <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
          {/* <Box sx={{display:'flex', alignItems:'center'}}>
          <TextField
            variant="outlined"
            placeholder="quiz duration"
            type="number"
            value={duration}
            onChange={handleDuration}
          />
          <Typography sx={{ marginLeft: 2 }}>minutes</Typography> 
          </Box> */}
          <Box sx={{display:'flex', alignItems:'center'}}>
            <Button 
              variant="contained" 
              style={style.btnStyle} 
              onClick={quizAddQuestion}
            > 
              Add Question
            </Button>
          </Box>
        </Grid>
        <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
          <Box sx={{display:'flex', alignItems:'center'}}>
            {matchMD ? 
              <>
                <Grid container justifyContent="flex-end" sx={{ marginBottom: { xs: -30, md: -8 } }}>
                  <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 2 }} onClick={saveQuiz}>Create Quiz</Button>
                  <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 10 }}>Cancel</Button>
                </Grid>
              </> : ""
            }
          </Box>
        </Grid>
        

      </Box>
    </Teacherdrawer>
  )
}
