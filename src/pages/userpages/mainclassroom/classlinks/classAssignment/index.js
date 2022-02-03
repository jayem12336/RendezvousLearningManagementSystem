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
  useMediaQuery,
  IconButton,
} from '@mui/material';

import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useDropzone } from 'react-dropzone';
import { ref, getDownloadURL } from "firebase/storage";



import FileUploadIcon from '@mui/icons-material/FileUpload';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

import { v4 as uuidv4 } from 'uuid';

import { getDocsByCollection, createClassDoc, saveAssignmentStudent, getStudentByAssigned, uploadFile } from '../../../../../utils/firebaseUtil'
import { Timestamp } from 'firebase/firestore';

import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';


import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';

import { useTheme } from '@mui/material/styles';


const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px  5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    // maxWidth: 1100,
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
    fontSize: 16,
    fontWeight: "bold",
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

export default function Assignment() {

  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [error, setError] = useState({
    title: '',
    instruction: ''
  })
  const [dueDate, setDueDate] = useState('')
  const [files, setFiles] = useState([])
  const [openDrop, setOpenDrop] = useState(false)


  const { user } = useSelector((state) => state);
  const params = useParams()
  const history = useHistory();
  const id = (uuidv4().slice(-8));

  const theme = useTheme();

  const matchMD = useMediaQuery(theme.breakpoints.up('md'));

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 'text/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf'
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <div key={file.path}>
      ({file.path} - {file.size} bytes)
    </div>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.path}>
      ({file.path} - {file.size} bytes)
      <div>
        {errors.map(e => (
          <p key={e.code}>{e.message}</p>
        ))}
      </div>
    </div>
  ));


  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      // getLaboratory()
      getStudentList()
    }


  }, [user]);

  const getStudentList = () => {
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
      console.log(data)
      if (data.length !== 0) {
        data.map(item => {
          setAssignmentTitle(item.title)
          setAssignmentId(item.assignmentId)
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

  const saveAssignment = () => {
    const data = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      title: assignmentTitle,
      students: studentName,
      instruction: instruction,
      assignmentId: params.assignmentId
    }
    // if(isNew){
    if (assignmentTitle === '' && instruction === '') {
      setError({
        title: 'please input title',
        instruction: 'please input instruction'
      })
    } else if (instruction === '') {
      setError({
        ...error,
        instruction: 'please input instruction'
      })
    } else if (assignmentTitle === '') {
      setError({
        ...error,
        title: 'please input title'
      })
    } else {
      createClassDoc('assignment', params.assignmentId, data).then(() => {
        setOpen({ open: true });
        studentName.map(student => {
          const studentData = {
            studentId: student,
            instruction: instruction,
            ownerId: user.currentUser.uid,
            classCode: params.id,
            created: Timestamp.now(),
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            title: assignmentTitle,
            students: studentName,
            instruction: instruction,
            assignmentId: params.assignmentId
          }
          saveAssignmentStudent(studentData)
          const file = acceptedFiles.map(file => Object.assign(file))
          uploadFile(file, params.id, params.assignmentId, user.currentUser.uid, '', 'assignment').then(data => {
            console.log(data)
          })
        })
        console.log('success')
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
    setAssignmentTitle(e.target.value)
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

  console.log(studentName)
  console.log(studentsList)
  return (
    <Teacherdrawer classCode={params.id} headTitle={'Create Assignment'}>
      <Helmet>
        <title>Create Assignment</title>
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
          Successfully Saved Assignment
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 6 }}>
        <>
          <Grid xs={12} justifyContent='space-between' container>
            <Grid container justifyContent="center">
              <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>Assignment</Typography>
            </Grid>
            {matchMD ? <>
              <Grid container justifyContent="flex-end" sx={{ marginBottom: { xs: -30, md: -8 } }}>
                <Button variant="contained" style={style.btnStyle} onClick={saveAssignment}>Create Task</Button>
                <Button variant="contained" style={style.btnStyle} onClick={() => history.goBack()}>Cancel</Button>
              </Grid>
            </> : ""
            }
            <Grid xs={12} justifyContent='flex-start' container>
              <TextField
                label={assignmentTitle === '' ? 'Title' : assignmentTitle}
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={assignmentTitle}
                onChange={handleTitle}
                error={error.title ? true : false}
                helperText={error.title}
                InputProps={{
                  sx: style.inputText
                }}
                InputLabelProps={{
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
                    label="Due Date"
                    value={dueDate}
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

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="select-student-label" sx={{ fontWeight: "bold" }}>Assign Student</InputLabel>
              <Select
                labelId="select-student-label"
                multiple
                value={studentName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Assign Student" />}
                sx={{ fontWeight: 'bold', color: 'black' }}
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
                {studentsList.map((name, index) => (
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
            <Grid xs={12} justifyContent='flex-start' container sx={{ marginBottom: 2 }}>
              <Stack direction="row" spacing={1} xs={{ width: 500 }}>
                {studentName && studentName.map(item => (
                  studentsList.filter(data => data.value === item).map(name => (
                    <Chip label={name.label} sx={{ fontWeight: 'bold', color: 'black' }} />
                  ))
                ))}
              </Stack>
            </Grid>
            <Grid xs={12} justifyContent='flex-start' sx={style.gridcontainer} container>
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
                  InputLabelProps={{
                    sx: style.inputText
                  }}
                />
                <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
                  <Grid container justifyContent='space-between'>
                    <Grid container xs={12}>
                      {/* <Dropzone onDrop={files => console.log(files)}>
                        {({getRootProps, getInputProps}) => (
                          <div className="container">
                            <div
                              {...getRootProps({
                                className: 'dropzone',
                                onDrop: event => event.stopPropagation()
                              })}
                            >
                              <input {...getInputProps()} />
                              <div>Drag 'n' drop some files here, or click to select files
                                <IconButton sx={style.iconStyle}>
                                  <FileUploadIcon />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        )}
                      </Dropzone> */}
                      <section className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <div style={{ fontWeight: "bold" }}>
                            Drag 'n' drop some files here, or click to select files
                            <IconButton sx={style.iconStyle}>
                              <FileUploadIcon />
                            </IconButton>
                          </div>
                          <em style={{ fontWeight: "bold" }}>(Only *.doc, *ppt, and *.xls will be accepted)</em>
                        </div>
                        <aside>
                          {acceptedFileItems.length !== 0 &&
                            <>
                              <h4>Accepted files</h4>
                              <div>{acceptedFileItems}</div>
                              <h4>Rejected files</h4>
                              <div>{fileRejectionItems}</div>
                            </>
                          }
                        </aside>
                      </section>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {matchMD ?
            ""
            :
            <>
              <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Button variant="contained" style={style.btnStyle} onClick={saveAssignment}>Create Task</Button>
                <Button variant="contained" style={style.btnStyle} onClick={() => history.goBack()}>Cancel</Button>
              </Grid>
            </>
          }
        </>
      </Box>
    </Teacherdrawer >
  )
}