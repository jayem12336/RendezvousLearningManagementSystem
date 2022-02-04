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
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

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
    marginBottom: 12,
    fontWeight: 'bold'
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

export default function ClassQuiz() {

  const [quizData, setQuizData] = useState([])
  const [userId, setUserId] = useState('');
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [students, setStudents] = useState([])
  const [duration, setDuration] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
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
    answers: [],
    correctAnswer: "",
    messageForCorrectAnswer: "Correct answer. Good job.",
    messageForIncorrectAnswer: "Incorrect answer. Please try again.",
    explanation: "",
    point: ""
  }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

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
      setLoading(false)
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
    setError('')
    setLoading(true)
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
    if (
      quizQuiestions.length === 0 &&
      addQuestion[0].question === "" ||
      addQuestion[0].answers.length === 0 ||
      addQuestion[0].correctAnswer === "" ||
      addQuestion[0].point === ""
    ) {
      setError('please create a question')
      setLoading(false)
    } else {
      addQuestion.map(item => {
        setQuizQuestions(quizQuiestions => [...quizQuiestions, item])
        setAddQuestion([{
          question: "",
          questionType: "text",
          questionPic: "",
          answerSelectionType: "single",
          answers: [],
          correctAnswer: "",
          messageForCorrectAnswer: "Correct answer. Good job.",
          messageForIncorrectAnswer: "Incorrect answer. Please try again.",
          explanation: "",
          point: ""
        }])
      })
      setLoading(false)
    }


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

  const handleEditQuizChange = (e, index) => {
    const questionList = [...quizQuiestions];
    questionList[index][e.target.name] = e.target.value;
    // setAddQuestion(questionList)
    setQuizQuestions(questionList)
  }

  const handleEditAnswerChange = (e, index) => {
    const questionList = [...quizQuiestions];
    questionList.map(item => {
      item.answers[index] = e.target.value
    })
    setQuizQuestions(questionList)
  }

  const saveQuiz = () => {
    setLoading(true)
    let lastQuestion = {}
    addQuestion.map(item => {
      lastQuestion = item
    })
    const data = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      title: quizTitle,
      students: studentName,
      questions: [...quizQuiestions, lastQuestion],
      duration: duration,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      subject: subject,
      quizId: params.quizId,
      instruction: instruction,
      startDate: Timestamp.fromDate(new Date(startDate))
    }
    if (
      quizTitle === '' ||
      dueDate === '' ||
      instruction === ''
    ) {
      setError('please input details')
      setLoading(false)
    } else if (
      quizQuiestions.length === 0 &&
      addQuestion[0].question === "" ||
      addQuestion[0].answers.length === 0 ||
      addQuestion[0].correctAnswer === "" ||
      addQuestion[0].point === ""
    ) {
      setError('please input details')
      setLoading(false)
    } else {
      createClassDoc('quiz', params.quizId, data).then(() => {
        studentName.map(student => {
          const studentData = {
            ownerId: user.currentUser.uid,
            classCode: params.id,
            students: studentName,
            title: quizTitle,
            questions: [...quizQuiestions, lastQuestion],
            duration: duration,
            startDate: Timestamp.fromDate(new Date(startDate)),
            created: Timestamp.now(),
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            subject: subject,
            quizId: params.quizId,
            studentId: student,
            instruction: instruction,
            isDone: false,
          }
          saveQuizStudent(studentData)
        })
        setLoading(false)
        setOpen(true)
        const timeout = setTimeout(() => {
          history.push(`/classroomdetail/${params.id}`)
        }, 2000)
        return () => clearTimeout(timeout)

      })
    }

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

  const onStartDate = (e) => {
    setStartDate(e)
  }

  const handleDuration = (e) => {
    setDuration(e.target.value)
  }

  const onDeleteQuestion = (e, index) => {
    const newList = quizQuiestions.filter((value, i) => i !== index)
    setQuizQuestions(newList)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  const quizBody = () => (
    <>
      {quizQuiestions && quizQuiestions.map((item, index) =>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid xs={12} container justifyContent='flex-end' >
            <Grid item>
              <Button
                variant="contained"
                style={style.btnStyle}
                color="error"
                fullWidth={false}
                onClick={(e) => onDeleteQuestion(e, index)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <TextField
              label='Question'
              variant="outlined"
              fullWidth
              sx={{ marginRight: 2, marginBottom: 2, fontWeight: 'bold' }}
              name='question'
              value={item.question}
              // disabled
              onChange={(e) => handleEditQuizChange(e, index)}
              InputProps={{
                sx: style.inputText
              }}
            />
          </Grid>
          <Grid xs={12} container direction='column'>
            {item.answers && item.answers.map((item, i) => (
              <Grid container alignItems="center">
                {/* <Typography sx={{marginRight: 2}}>a.)</Typography> */}
                <TextField
                  label={`Answer ${index + 1}`}
                  variant="outlined"
                  sx={{ marginRight: 2, marginBottom: 2, }}
                  name={`answers${index}`}
                  value={item}
                  // disabled
                  onChange={(e) => handleEditAnswerChange(e, i)}
                  InputProps={{
                    sx: style.inputText
                  }}
                />
              </Grid>
            ))
            }
          </Grid>
          <Grid container xs={12}>
            <FormControl sx={{ width: 500, marginBottom: 2 }}>
              <InputLabel id="select-student-label" sx={{ fontWeight: 'bold', color: 'black' }}>Answer key</InputLabel>
              <Select
                labelId="select-student-label"
                value={item.correctAnswer}
                name='correctAnswer'
                onChange={(e) => handleEditQuizChange(e, index)}
                input={<OutlinedInput name='correctAnswer' id="select-multiple-chip" label="Answer key" />}
                sx={{ fontWeight: 'bold', color: 'black' }}
              >
                {item.answers.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    sx={{ fontWeight: 'bold', color: 'black' }}
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
              name='answerKey'
              // disabled
              value={item.correctAnswer}
              onChange={(e) => handleQuizChange(e, index)}
            /> */}
            {/* <Typography sx={{ marginTop: 2 }}>{item.body}</Typography> */}
          </Grid>
          <Grid container alignItems="center">
            <TextField
              label='Points'
              variant="outlined"
              sx={{ marginRight: 2, marginBottom: 2 }}
              name='point'
              type='number'
              // disabled
              value={item.point}
              onChange={(e) => handleEditQuizChange(e, index)}
              InputProps={{
                sx: style.inputText
              }}
              InputLabelProps={{
                sx: style.inputText
              }}
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
      {addQuestion && addQuestion.map((item, index) =>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid xs={12} item>
            <TextField
              label='Question'
              variant="outlined"
              fullWidth
              sx={{ marginRight: 2, marginBottom: 2 }}
              name='question'
              value={item.question}
              onChange={(e) => handleQuizChange(e, index)}
              InputProps={{
                sx: style.inputText
              }}
              InputLabelProps={{
                sx: style.inputText
              }}
            />
          </Grid>
          <Grid xs={12} container direction='column'>
            {item.answers && item.answers.map((item, i) => (
              <Grid container alignItems="center">
                {/* <Typography sx={{marginRight: 2}}>a.)</Typography> */}
                <TextField
                  label={`Answer ${i + 1}`}
                  variant="outlined"
                  sx={{ marginRight: 2, marginBottom: 2 }}
                  name='answer'
                  // value={item}
                  onChange={(e) => onAnswerChange(e, i, item)}
                  InputProps={{
                    sx: style.inputText
                  }}
                  InputLabelProps={{
                    sx: style.inputText
                  }}
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
              <InputLabel id="select-student-label" sx={{ fontWeight: 'bold' }}>Answer key</InputLabel>
              <Select
                labelId="select-student-label"
                value={item.correctAnswer}
                onChange={(e) => handleQuizChange(e, index)}
                input={<OutlinedInput name='correctAnswer' id="select-multiple-chip" label="Answer key" />}
                sx={{ color: 'black', fontWeight: 'bold' }}
              >
                {item.answers.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    sx={{ color: 'black', fontWeight: 'bold' }}
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
              sx={{ marginRight: 2, marginBottom: 2 }}
              name='point'
              type='number'
              value={item.point}
              onChange={(e) => handleQuizChange(e, index)}
              error={error ? true : false}
              helperText={error}
              InputProps={{
                sx: style.inputText
              }}
              InputLabelProps={{
                sx: style.inputText
              }}
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
    <Teacherdrawer headTitle='Create Quiz' classCode={params.id} loading={loading}>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        open={open}
        onClose={handleClose}
        message="I love snacks"
      // key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
          Successfully Created Quiz
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5, paddingBottom: 10 }}>

        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          <Grid container>
            <Grid container justifyContent="center" sx={{ marginBottom: 5 }}>
              <Typography variant="h4" >Create Quiz</Typography>
            </Grid>
            <Grid container>
              <TextField
                placeholder="Title"
                fullWidth
                label='Quiz Title'
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                InputProps={{
                  sx: style.inputText
                }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="select-student-label">Assign Student</InputLabel>
                <Select
                  labelId="select-student-label"
                  multiple
                  value={studentName}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Assign Student" />}
                  sx={{ fontWeight: 'bold', color: 'black' }}
                >
                  {studentsList.map((name) => (
                    <MenuItem
                      key={name.value}
                      value={name.value}
                      name={name.value}
                      sx={{ fontWeight: 'bold', color: 'black' }}
                    // style={getStyles(name, personName, theme)}
                    >
                      {name.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid container spacing={5}>
                <Grid item>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DateTimePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => onStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                      InputProps={{
                        sx: style.inputText
                      }}
                      InputLabelProps={{
                        sx: { color: 'black', fontWeight: 'bold' }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DateTimePicker
                      label="Due Date"
                      value={dueDate}
                      onChange={(newValue) => setDate(newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                      InputProps={{
                        sx: style.inputText
                      }}
                      InputLabelProps={{
                        sx: { color: 'black', fontWeight: 'bold' }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

            </Grid>
            <TextField
              variant="filled"
              multiline
              placeholder="Please enter direction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              // value={announcementContent}
              // onChange={handleAnnoucement}
              fullWidth
              minRows={5}
              error={error ? true : false}
              helperText={error}
              InputProps={{
                sx: style.inputText
              }}
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
              <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 2, fontWeight: 'bold' }} onClick={saveQuiz}>Create Quiz</Button>
              <Button variant="contained" style={{ width: 130, height: 45, marginLeft: 10, fontWeight: 'bold' }} onClick={() => history.goBack()}>Cancel</Button>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {matchMD ?
              <>
                <Grid container justifyContent="flex-end" sx={{ marginBottom: { xs: -30, md: -8 } }}>
                  <Button variant="contained" style={{ width: 130, height: 38, marginLeft: 2, fontWeight: 'bold' }} onClick={saveQuiz}>Create Quiz</Button>
                  <Button variant="contained" style={{ width: 130, height: 38, marginLeft: 10, fontWeight: 'bold' }} onClick={() => history.goBack()}>Cancel</Button>
                </Grid>
              </> : ""
            }
          </Box>
        </Grid>


      </Box>

    </Teacherdrawer>
  )
}