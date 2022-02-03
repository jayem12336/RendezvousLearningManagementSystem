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

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import { Timestamp } from 'firebase/firestore';

import {getAnnouncement, getDocsByCollection, getUser, createDoc} from '../../../../../utils/firebaseUtil';
import { useParams} from 'react-router-dom';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';



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
        marginLeft: 5
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
  const [quizQuiestions, setQuizQuestions] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [students, setStudents] = useState([])
  const [duration, setDuration] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [subject, setSubject] = useState('')


  const params = useParams()
  const { user } = useSelector((state) => state);
  const history = useHistory();

  useEffect(() => {
    if(Object.keys(user.currentUser).length !== 0){
      getStudentList()
    }
  }, [user]);
  // useEffect(() => {
  //   getStudentList()
  // }, []);

  const getStudentList = () => {
    getDocsByCollection('users').then(data => {
      const students = data.filter(item => item.isTeacher === false).map(item => {
        let studentArr = []
        studentArr = {label:item.displayName, value:item.ownerId}
        return studentArr
      })
      const studentsRaw = data.filter(item => item.isTeacher === false)
      setStudents(studentsRaw)
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

  
  // const saveAnnoucement = () => {
  //   const data = {
  //     body: announcementContent,
  //     classCode: params.id,
  //     created: Timestamp.now(),
  //     ownerId: user.currentUser.uid,
  //     ownerName: user.currentUser.displayName
  //   }
  //   createDoc('announcement',data).then(() => {
  //     setAnnoucncementContent('')
  //     getDataAnnouncement()
  //   })
  // }

  // const cancelAnnouncement = () => {
  //   setShowInput(false)
  //   setAnnoucncementContent('')
  // }

  const addQuestion = () => {
    let questions = {
      question:'',
      item: 0,
      choiceOne:'',
      choiceTwo:'',
      choiceThree:'',
      choiceFour:'',
      answerKey:''
    }

    setQuizQuestions(quizQuiestions => [...quizQuiestions, questions])
  }

  const handleQuizChange = (e, index) => {
    const questionList = [...quizQuiestions];
    questionList[index][e.target.name] = e.target.value;
    setQuizQuestions(questionList);
  }

  const saveQuiz = () => {
    const data = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      students: studentName,
      questions: quizQuiestions,
      duration: duration,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      subject: subject
    }
    console.log(data)
    createDoc('quiz',data).then(() => {
      history.push(`/quiz`)
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

  const quizBody = () => {
    return quizQuiestions && quizQuiestions.map((item,index) => 
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
          <Grid container alignItems="center">
            <Typography sx={{marginRight: 2}}>a.)</Typography>
            <TextField 
              label='Choice 1' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='choiceOne'
              value={item.choiceOne}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
          <Grid container alignItems="center">
            <Typography sx={{marginRight: 2}}>b.)</Typography>
            <TextField 
              label='Choice 2' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='choiceTwo'
              value={item.choiceTwo}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
          <Grid container alignItems="center">
            <Typography sx={{marginRight: 2}}>c.)</Typography>
            <TextField 
              label='Choice 3' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='choiceThree'
              value={item.choiceThree}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>
          <Grid container alignItems="center">
            <Typography sx={{marginRight: 2}}>d.)</Typography>
            <TextField 
              label='Choice 4' 
              variant="outlined" 
              sx={{marginRight: 2, marginBottom: 2}}
              name='choiceFour'
              value={item.choiceFour}
              onChange={(e) => handleQuizChange(e, index)}
            />
          </Grid>          
          
          {/* <Typography>{item.ownerName}</Typography> */}
        </Grid>
        <Grid item xs={12}>
        <TextField 
            label='Answer' 
            variant="outlined" 
            sx={{marginRight: 2, marginBottom: 2}}
            name='answerKey'
            value={item.answerKey}
            onChange={(e) => handleQuizChange(e, index)}
          />
          {/* <Typography sx={{ marginTop: 2 }}>{item.body}</Typography> */}
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
    )
  }

  return (
    <Teacherdrawer headTitle='All Announcemnt' classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Grid container sx={style.gridcontainer} justifyContent='space-between'>
          
            <Grid container>
              <Grid container>
                <TextField 
                  label='Quiz Title' 
                  variant="outlined" 
                  sx={{marginRight: 2, marginBottom: 2}}
                  // value={labTitle}
                  // onChange={handleTitle}
                />
                <FormControl sx={{ width: 500 }}>
                  <InputLabel id="select-student-label">Assign Student</InputLabel>
                  <Select
                    labelId="select-student-label"
                    multiple
                    value={studentName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Assign Student" />}
                    // renderValue={(selected, item) => (
                    //   console.log(selected),
                    //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    //     {selected.map((value) => (
                    //       <Chip key={value} label={value}  />
                    //     ))}
                    //   </Box>
                    // )}
                    // MenuProps={MenuProps}
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
                    renderInput={(params) => <TextField {...params} />}
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
                <Grid item>
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
        {quizData && quizBody() }
        
        <Grid container sx={style.addBtncontainer} justifyContent='space-between'>
          <Box sx={{display:'flex', alignItems:'center'}}>
          <TextField
            variant="outlined"
            placeholder="quiz duration"
            type="number"
            value={duration}
            onChange={handleDuration}
          />
          <Typography sx={{ marginLeft: 2 }}>minutes</Typography> 
          </Box>
          <Box sx={{display:'flex', alignItems:'center'}}>
            <Button 
              variant="contained" 
              style={style.btnStyle} 
              onClick={addQuestion}
            > 
              Add Question
            </Button>
            <Button 
              variant="contained" 
              style={style.btnStyle} 
              onClick={saveQuiz}
            > 
              Create Quiz
            </Button>
          </Box>
        </Grid>
       
      </Box>
    </Teacherdrawer>
  )
}
