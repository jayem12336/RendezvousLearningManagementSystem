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
import DatePicker from '@mui/lab/DatePicker';



import Studentdrawer from '../../classdrawer/ClassDrawerStudent';
import { Timestamp } from 'firebase/firestore';

import {getStudentByAssigned, getDocsByCollection, saveQuizStudent, saveQuizRecord,getQuizStudent} from '../../../../../utils/firebaseUtil';
import { useParams} from 'react-router-dom';
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
      marginTop: 12
  },
    addBtncontainer: {
      display: "flex",
      marginTop: 5,
      maxWidth: 1000
  },
}



export default function QuizDetail() {
  const setQuizResult = (obj) => {
    console.log(obj);
    //
  }
  
  // console.log(test.numberOfCorrectAnswers)

  const [quizData, setQuizData] = useState([])
  const [userId, setUserId] = useState('');
  // const [quizQuiestions, setQuizQuestions] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [students, setStudents] = useState([])
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
  const id = (uuidv4().slice(-8));


  useEffect(() => {
    if(Object.keys(user.currentUser).length !== 0){
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
        <Typography variant='h6'>
          You have completed the quiz. You got {data.numberOfCorrectAnswers} out of {data.numberOfQuestions} questions.
        </Typography>
        <Typography variant='h6'>
          You scored {data.correctPoints} out of {data.totalPoints}.
        </Typography>
        
          {data.questions.map((item, index) => 
            <Grid container sx={style.gridcontainer} justifyContent='space-between'>
              <Grid container xs={12}>
                <Typography variant='p'>
                  {item.question}
                </Typography>
              </Grid>
              {item.answers.map((answer,i) => 
                <Grid container xs={12} style={{marginTop:8}}>
                  <Button 
                    variant={answer == data.userInput[index] ? 'contained' : 'outlined'} 
                    color={data.userInput[index] == item.correctAnswer ? 'success' : 'error'}
                    disbaled
                  >
                    {answer}
                  </Button>
                </Grid>   
              )}
              <Grid container xs={12} style={{marginTop:8}}>
                <Typography variant='p'>
                  Correct answer : {item.correctAnswer}
                </Typography>
              </Grid>
              <Grid container xs={12} style={{marginTop:8}}>
                <Typography variant='p'>
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
        studentArr = {label:item.displayName, value:item.ownerId}
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
      setQuizQuestions({questions:item.questions})
      // setQuizQuestions(item.questions)
      setQuizTitle(item.title)
      setDueDate(new Date(item.dueDate.seconds * 1000).toLocaleDateString())
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
        dueDate: Timestamp.fromDate(new Date(dueDate)),
        subject: subject,
        quizId: params.quizId,
        studentId: user.currentUser.uid,
        result: result
      }
      saveQuizStudent(studentData)
      saveQuizRecord(studentData)
    // const timeout = setTimeout(() => {
    //   // history.push(`/classroomdetail/${params.id}`)
    //   console.log(studentData)
    // }, 2000)
    // return () => clearTimeout(timeout)
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

  // const quizBody = () => {
  //   return quizQuiestions && quizQuiestions.map((item,index) => 
  //     <Grid container sx={style.gridcontainer} justifyContent='space-between'>
  //       <Grid xs={12} item>
  //         <TextField 
  //           label='Question' 
  //           variant="outlined" 
  //           fullWidth
  //           sx={{marginRight: 2, marginBottom: 2}}
  //           name='question'
  //           value={item.question}
  //           onChange={(e) => handleQuizChange(e, index)}
  //         />
  //       </Grid>
  //       <Grid xs={12} container direction='column'>
  //         <Grid container alignItems="center">
  //           <Typography sx={{marginRight: 2}}>a.)</Typography>
  //           <TextField 
  //             label='Choice 1' 
  //             variant="outlined" 
  //             sx={{marginRight: 2, marginBottom: 2}}
  //             name='choiceOne'
  //             value={item.choiceOne}
  //             onChange={(e) => handleQuizChange(e, index)}
  //           />
  //         </Grid>
  //         <Grid container alignItems="center">
  //           <Typography sx={{marginRight: 2}}>b.)</Typography>
  //           <TextField 
  //             label='Choice 2' 
  //             variant="outlined" 
  //             sx={{marginRight: 2, marginBottom: 2}}
  //             name='choiceTwo'
  //             value={item.choiceTwo}
  //             onChange={(e) => handleQuizChange(e, index)}
  //           />
  //         </Grid>
  //         <Grid container alignItems="center">
  //           <Typography sx={{marginRight: 2}}>c.)</Typography>
  //           <TextField 
  //             label='Choice 3' 
  //             variant="outlined" 
  //             sx={{marginRight: 2, marginBottom: 2}}
  //             name='choiceThree'
  //             value={item.choiceThree}
  //             onChange={(e) => handleQuizChange(e, index)}
  //           />
  //         </Grid>
  //         <Grid container alignItems="center">
  //           <Typography sx={{marginRight: 2}}>d.)</Typography>
  //           <TextField 
  //             label='Choice 4' 
  //             variant="outlined" 
  //             sx={{marginRight: 2, marginBottom: 2}}
  //             name='choiceFour'
  //             value={item.choiceFour}
  //             onChange={(e) => handleQuizChange(e, index)}
  //           />
  //         </Grid>          
          
  //         {/* <Typography>{item.ownerName}</Typography> */}
  //       </Grid>
  //       <Grid item xs={12}>
  //       <TextField 
  //           label='Answer' 
  //           variant="outlined" 
  //           sx={{marginRight: 2, marginBottom: 2}}
  //           name='answerKey'
  //           value={item.answerKey}
  //           onChange={(e) => handleQuizChange(e, index)}
  //         />
  //         {/* <Typography sx={{ marginTop: 2 }}>{item.body}</Typography> */}
  //       </Grid>
      
  //       {/* <Grid xs={12} justifyContent='flex-end' container>
  //         <Button 
  //           variant="contained" 
  //           color="primary" 
  //           sx={{ marginTop: 2 }}
  //           onClick={(e) => handleQuizChange(e, index)}
  //         >
  //           Delete
  //         </Button>
  //       </Grid> */}
  //     </Grid>
  //   )
  // }

  console.log(quizQuiestions)

  return (
    <Studentdrawer headTitle={quizTitle} classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          
            <Grid container>
              <Grid container>
                <TextField 
                  label='Quiz Title' 
                  variant="outlined" 
                  sx={{marginRight: 2, marginBottom: 2}}
                  value={quizTitle}
                  disabled
                  onChange={(e) => setQuizTitle(e.target.value)}
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
