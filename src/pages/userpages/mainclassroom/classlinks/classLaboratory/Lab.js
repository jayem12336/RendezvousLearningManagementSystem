import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Button,
  MenuItem,
  TextField,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  Stack,
  Chip,
  useMediaQuery
} from '@mui/material';

import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

import { v4 as uuidv4 } from 'uuid';

import { getDocsByCollection, createClassDoc, saveLabStudent, getStudentByAssigned } from '../../../../../utils/firebaseUtil'
import { Timestamp } from 'firebase/firestore';

import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';


import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';

import { useTheme } from '@mui/material/styles';


const style = {
  gridcontainer: {
    display: "flex",
    marginTop: 5,
    padding: 2,
    maxWidth: 1100,
    borderBottom: 0.5,
    borderColor: (theme) => theme.palette.primary.main
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
    marginRight: 4,
    width: 120,
    height: 40,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: 'none',
    color: (theme) => theme.colors.textColor,
    backgroundColor: (theme) => theme.palette.primary.main,
    '&:hover': {
      backgroundColor: "#346ef7",
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
  },
  topPane: {
    backgroundColor: 'hsl(225, 6%, 25%)',
    display: 'flex',
    flexGrow: 1,
  },
  pane: {
    height: '50vh',
    display: 'flex',
    width: '100%'
  },
  inputText: {
    fontWeight: 'bold'
  },
}

export default function Laboratory() {

  const [html, setHtml] = useState('html', '')
  const [css, setCss] = useState('css', '')
  const [js, setJs] = useState('js', '')
  const [srcDoc, setSrcDoc] = useState('')
  const [labTitle, setLabTitle] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [labId, setLabId] = useState('')
  const [error, setError] = useState({
    title: '',
    instruction: ''
  })
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')


  const { user } = useSelector((state) => state);
  const params = useParams()
  const history = useHistory();
  const id = (uuidv4().slice(-8));

  const theme = useTheme();

  const matchMD = useMediaQuery(theme.breakpoints.up('md'));


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, 250)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      // getLaboratory()
      getStudentList()
    }


  }, [user]);

  const getStudentList = () => {
    // getDocsByCollection('users').then(data => {
    //   const students = data.map(item => {
    //     let studentArr = []
    //     studentArr = { label: item.displayName, value: item.ownerId }
    //     return studentArr
    //   })
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
    getDocsByCollection('quiz').then(data => {
      data.filter(item => item.classCode === params.id).map(item => {
        setStudentName(item.students)
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

  const getLaboratory = () => {
    getDocsByCollection('laboratory').then(item => {
      const data = item.filter(item => item.classCode === params.id)
      if (data.length !== 0) {
        data.map(item => {
          setHtml(item.html)
          setCss(item.css)
          setJs(item.js)
          setSrcDoc(item.body)
          setLabTitle(item.title)
          setLabId(item.labId)
          setStudentName(item.students)
          setInstruction(item.instruction)
        })
      } else {
        setIsNew(true)
      }

    })
  }

  const setDate = (e) => {
    setDueDate(e)
  }

  const onStartDate = (e) => {
    setStartDate(e)
  }

  const saveLab = () => {
    const data = {
      html: html,
      css: css,
      js: js,
      ownerId: user.currentUser.uid,
      classCode: params.id,
      created: Timestamp.now(),
      startDate: Timestamp.fromDate(new Date(startDate)),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      title: labTitle,
      students: studentName,
      instruction: instruction,
      labId: params.labId
    }
    // if(isNew){
    if (labTitle === '' && instruction === '') {
      setError({
        title: 'please input title',
        instruction: 'please input instruction'
      })
    } else if (instruction === '') {
      setError({
        ...error,
        instruction: 'please input instruction'
      })
    } else if (labTitle === '') {
      setError({
        ...error,
        title: 'please input instruction'
      })
    } else {
      createClassDoc('laboratory', params.labId, data).then(() => {
        setOpen({ open: true });
        studentName.map(student => {
          const studentData = {
            html: html,
            css: css,
            js: js,
            ownerId: user.currentUser.uid,
            classCode: params.id,
            created: Timestamp.now(),
            startDate: Timestamp.fromDate(new Date(startDate)),
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            title: labTitle,
            studentId: student,
            instruction: instruction,
            labId: params.labId
          }
          saveLabStudent(studentData)
        })
        const timeout = setTimeout(() => {
          history.push(`/classroomdetail/${params.id}`)
        }, 2000)

        return () => clearTimeout(timeout)
      })
    }

  }

  const handleTitle = (e) => {
    setError({
      ...error,
      title: ''
    })
    setLabTitle(e.target.value)
  }

  const handleClickSnack = () => {
    setOpen({ open: true });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleInstruction = (e) => {
    setError({
      ...error,
      instruction: ''
    })
    setInstruction(e.target.value)
  }

  return (
    <Teacherdrawer classCode={params.id} headTitle={'Create Laboratory'}>
      <Helmet>
        <title>Create Laboratory</title>
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
          Successfully Saved Lab
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 6 }}>
        <>
          <Grid xs={12} justifyContent='space-between' container>
            <Grid container justifyContent="center">
              <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>Laboratory</Typography>
            </Grid>
            {matchMD ? <>
              <Grid container justifyContent="flex-end" sx={{ marginBottom: { xs: -30, md: -8 } }}>
                <Button variant="contained" style={style.btnStyle} onClick={saveLab}>Create Task</Button>
                <Button variant="contained" style={style.btnStyle} onClick={() => history.goBack()}>Cancel</Button>
              </Grid>
            </> : ""
            }
            <Typography sx={{ marginTop: { xs: -2, md: 0 }, fontWeight: "bold" }}>Title</Typography>
            <Grid xs={12} justifyContent='flex-start' container>
              <TextField
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={labTitle}
                onChange={handleTitle}
                error={error.title ? true : false}
                helperText={error.title}
                InputProps={{
                  sx: style.inputText
                }}
              />
              {/* <Button 
                variant="contained" 
                color="primary" 
                sx={{ marginTop: 2, marginBottom: 2 }}
                onClick={() => saveLab()}
              >
                {isNew ? 'Save' : 'Update'}
              </Button> */}
            </Grid>

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
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="select-student-label" sx={{ fontWeight: "bold" }}>Assign Student</InputLabel>
              <Select
                labelId="select-student-label"
                multiple
                value={studentName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Assign Student" />}
                sx={{ fontWeight: 'bold', color: 'black' }}
              >
                {studentsList.map((name, index) => (
                  <MenuItem
                    key={name.value}
                    value={name.value}
                    name={name.value}
                    // style={getStyles(name, personName, theme)}
                    sx={{ fontWeight: 'bold', color: 'black' }}
                  >
                    {name.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid xs={12} justifyContent='flex-start' container sx={{ marginBottom: 2 }}>
              <Stack direction="row" spacing={1} xs={{ width: 500 }}>
                {studentName && studentName.map(item => (
                  studentsList.filter(data => data.value === item).map(name => (
                    <Chip label={name.label} sx={{ fontWeight: 'bold', color: 'black' }} />
                  ))
                ))}
              </Stack>
            </Grid>
            <Grid xs={12} justifyContent='flex-start' container>
              <Grid container>
                <TextField
                  variant="filled"
                  multiline
                  value={instruction}
                  onChange={(e) => handleInstruction(e)}
                  fullWidth
                  minRows={5}
                  error={error.instruction ? true : false}
                  helperText={error.instruction}
                  InputProps={{
                    sx: style.inputText
                  }}
                />
                <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
                  <Grid item>
                    {/* <IconButton sx={style.iconStyle}>
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
                    </IconButton> */}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {/* <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
            <Grid item>
              <Typography sx={style.textStyle}>Total Score</Typography>
              <TextField />
            </Grid>
            <Grid item>
              <Typography sx={style.textStyle}>Due Date</Typography>
              <TextField />
            </Grid>
            <Grid item>
              <Typography sx={style.textStyle}>Assign to</Typography>
              <TextField />
            </Grid>
            <Grid item>
              <Typography sx={style.textStyle}>Language</Typography>
              <TextField />
            </Grid>
          </Box> */}

          {matchMD ?
            ""
            :
            <>
              <Grid container justifyContent="center" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Button variant="contained" style={style.btnStyle} onClick={saveLab}>Create Task</Button>
                <Button variant="contained" style={style.btnStyle} onClick={() => history.goBack()}>Cancel</Button>
              </Grid>
            </>
          }
          {/* <Box sx={style.pane, style.topPane}>
            <Editor
              language="xml"
              displayName="HTML"
              value={html}
              onChange={setHtml}
            />
            <Editor
              language="css"
              displayName="CSS"
              value={css}
              onChange={setCss}
            />
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              onChange={setJs}
            />
          </Box>
          <Box sx={style.pane}>
            <iframe
              srcDoc={srcDoc}
              title="output"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </Box> */}
        </>
      </Box>
    </Teacherdrawer >
  )
}