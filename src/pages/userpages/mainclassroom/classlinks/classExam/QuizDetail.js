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
} from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';


import DatePicker from '@mui/lab/DatePicker';
import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import { Timestamp } from 'firebase/firestore';

import { getStudentByAssigned, getDocsByCollection, saveExamStudent, createClassDoc } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import YouTubeIcon from '@mui/icons-material/YouTube';

import Quiz from 'react-quiz-component';


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
    marginBottom: 10,
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
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [subject, setSubject] = useState('')
  const [quizTitle, setQuizTitle] = useState('')
  const [quizQuiestions, setQuizQuestions] = useState([])
  const [instruction, setInstruction] = useState('')
  const [title, setTitle] = useState('')
  const [answer, setAnswer] = useState([''])
  const [addQuestion, setAddQuestion] = useState([])
  const [isStart, setIsStart] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [loading, setLoading] = useState(true)


  const params = useParams()
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const id = (uuidv4().slice(-8));


  useEffect(() => {
    if (Object.keys(user.currentUser).length !== 0) {
      getStudentList()
    }
  }, [user]);


  const getStudentList = () => {
    getDocsByCollection('exam').then(data => {
      data.filter(item => item.examId === params.examId).map(item => {
        // setQuizQuestions({questions:item.questions})
        setQuizTitle(item.title)
        setDueDate(item.dueDate && new Date(item.dueDate.seconds * 1000))
        setInstruction(item.instruction)
        setTitle(item.title)
        setQuizQuestions(item.questions)
        setStudentName(item.students)
        setStartDate(item.startDate && new Date(item.startDate.seconds * 1000))
        if (item.startDate.seconds <= Timestamp.now().seconds) {
          setIsStart(true)
        }
        if (item.dueDate.seconds <= Timestamp.now().seconds) {
          setIsEnd(true)
        }
        if (item.startDate.seconds <= Timestamp.now().seconds && item.dueDate.seconds > Timestamp.now().seconds) {
          setIsStart(true)
        } else {
          if (dueDate.seconds <= Timestamp.now().seconds) {
            setIsEnd(true)
          } else {
            setIsEnd(false)
          }
        }
      })
      getStudentByAssigned(params.id).then(item => {
        const students = item.students.filter(item => item.isJoin === true).map(item => {
          let studentArr = []
          studentArr = { label: item.displayName, value: item.ownerId }
          return studentArr
        })
        setStudentsList(students)
        getDocsByCollection('createclass').then(data => {
          data.filter(item => item.classCode === params.id).map(item => {
            setSubject(item.subject)
          })

        })
        setLoading(false)
      })

    })



  }

  const saveQuiz = () => {
    let lastQuestion = {}
    addQuestion.map(item => {
      lastQuestion = item
    })
    const data = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      title: quizTitle,
      students: studentName,
      questions: addQuestion.length !== 0 ? [...quizQuiestions, lastQuestion] : [...quizQuiestions],
      duration: duration,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      subject: subject,
      examId: params.examId,
      instruction: instruction,
      startDate: Timestamp.fromDate(new Date(startDate))

    }
    createClassDoc('exam', params.quizId, data).then(() => {
    })
    studentName.map(student => {
      const studentData = {
        ownerId: user.currentUser.uid,
        classCode: params.id,
        students: studentName,
        title: quizTitle,
        questions: data.questions,
        duration: duration,
        created: Timestamp.now(),
        dueDate: Timestamp.fromDate(new Date(dueDate)),
        subject: subject,
        examId: params.examId,
        studentId: student,
        instruction: instruction,
        startDate: Timestamp.fromDate(new Date(startDate))
      }
      saveExamStudent(studentData).then(() => {
        const timeout = setTimeout(() => {
          history.push(`/classroomdetail/${params.id}`)
        }, 2000)
        return () => clearTimeout(timeout)
      })
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
  const onStartDate = (e) => {
    setStartDate(e)
  }

  const handleDuration = (e) => {
    setDuration(e.target.value)
  }

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

  const onDeleteQuestion = (e, index) => {
    const newList = quizQuiestions.filter((value, i) => i !== index)
    setQuizQuestions(newList)
  }

  const quizAddQuestion = () => {
    addQuestion && addQuestion.map(item => {
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

    addQuestion.length === 0 &&
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
  }

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
                disabled={isStart || isEnd}
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
              sx={{ marginRight: 2, marginBottom: 2 }}
              name='question'
              value={item.question}
              disabled={isStart || isEnd}
              onChange={(e) => handleEditQuizChange(e, index)}
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
                  label={`Answer ${index + 1}`}
                  variant="outlined"
                  sx={{ marginRight: 2, marginBottom: 2 }}
                  name='answer'
                  value={item}
                  disabled={isStart || isEnd}
                  onChange={(e) => handleEditAnswerChange(e, i)}
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
          <Grid container xs={12}>
            <FormControl sx={{ width: 500, marginBottom: 2 }}>
              <InputLabel id="select-student-label" sx={{ fontWeight: "bold" }}>Answer key</InputLabel>
              <Select
                labelId="select-student-label"
                value={item.correctAnswer}
                name='correctAnswer'
                onChange={(e) => handleEditQuizChange(e, index)}
                input={<OutlinedInput name='correctAnswer' id="select-multiple-chip" label="Answer key" disabled={isStart || isEnd} />}
                sx={{ fontWeight: "bold" }}
              >
                {item.answers && item.answers.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    sx={{ fontWeight: "bold" }}
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
              disabled={isStart || isEnd}
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
              <InputLabel id="select-student-label">Answer key</InputLabel>
              <Select
                labelId="select-student-label"
                value={item.correctAnswer}
                onChange={(e) => handleQuizChange(e, index)}
                input={<OutlinedInput name='correctAnswer' id="select-multiple-chip" label="Answer key" />}
                sx={{ fontWeight: "bold" }}
              >
                {item.answers.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    sx={{ fontWeight: "bold" }}
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
    <Teacherdrawer headTitle={title} classCode={params.id} loading={loading}>
      <Helmet>
        <title>Quiz Details</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      {!loading &&
        <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
          <Grid container sx={style.gridcontainer} justifyContent='space-between'>
            <Grid container>
              <Grid container>
                <TextField
                  label='Exam Title'
                  variant="outlined"
                  sx={{ marginRight: 2, marginBottom: 2 }}
                  value={quizTitle}
                  disabled={isStart || isEnd}
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
                <Grid container spacing={5}>
                  <Grid item>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="Start Date"
                        value={startDate}
                        disabled={isStart || isEnd}
                        onChange={(newValue) => onStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                        InputProps={{
                          sx: style.inputText
                        }}
                        InputLabelProps={{
                          sx: style.inputText
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        label="Due Date"
                        value={dueDate}
                        disabled={isStart || isEnd}
                        onChange={(newValue) => setDate(newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                        InputProps={{
                          sx: style.inputText
                        }}
                        InputLabelProps={{
                          sx: style.inputText
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                {/* <TextField
                  variant="filled"
                  // disabled
                  value={new Date(dueDate.seconds * 1000).toLocaleDateString()}
                  
                  /> */}
              </Grid>
              <TextField
                variant="filled"
                multiline
                placeholder="Please enter direction"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                // onChange={handleAnnoucement}
                fullWidth
                disabled={isStart || isEnd}
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
          {quizQuiestions && quizBody()}
          <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                style={style.btnStyle}
                disabled={isStart || isEnd}
                onClick={quizAddQuestion}
              >
                Add Question
              </Button>
            </Box>
          </Grid>
          {/* <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
            <Box sx={{display:'flex', alignItems:'center'}}>
              {quizQuiestions.length !== 0 && 
                <Quiz quiz={quizQuiestions} showDefaultResult={false} onComplete={setQuizResult}/>
              }
              
            </Box>
          </Grid> */}

          <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <>
                <Grid container justifyContent="flex-end" sx={{ marginTop: { xs: -2, md: -4 }, marginBottom: { xs: 2, md: 0 } }}>
                  <Button variant="contained" style={{ width: 130, height: 38, marginLeft: 2, fontWeight: "bold" }} onClick={saveQuiz} disabled={isStart || isEnd}>Update Exam</Button>
                  <Button variant="contained" style={{ width: 130, height: 38, marginLeft: 10, fontWeight: "bold" }} onClick={() => history.goBack()}>Cancel</Button>
                </Grid>
              </>
            </Box>
          </Grid>

        </Box>
      }

    </Teacherdrawer>
  )
}
