import React, { useState, useEffect } from 'react';

import {
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
  Typography,
  Link,
  IconButton
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useDropzone } from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';



import { getDocsByCollection, updateAssignment, saveAssignmentStudent, getStudentByAssigned, saveAssignmentRecord, uploadFile } from '../../../../../utils/firebaseUtil'
import { Timestamp } from 'firebase/firestore';

import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';
import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';

const style = {
  gridcontainer: {
    display: "flex",
    marginTop: 5,
    boxShadow: '0 3px  5px 2px rgb(126 126 126 / 30%)',
    padding: 2,
    // maxWidth: 900,
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
    borderRadius: 20,
    fontSize: 20,
    width: 150,
    marginTop: -2,
    marginBottom: 4,
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
  }
}

export default function Laboratory() {

  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [studentsList, setStudentsList] = useState([])
  const [studentName, setStudentName] = useState([])
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [fileList, setFileList] = useState([])
  const [studentFile, setStudentFile] = useState([])


  const { user } = useSelector((state) => state);
  const params = useParams()
  const history = useHistory();
  const id = (uuidv4().slice(-8));

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
      getAssignment()
      getStudentList()
      getFileList()
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
    // getDocsByCollection('users').then(data => {
    //   const students = data.map(item => {
    //     let studentArr = []
    //     studentArr = {label:item.displayName, value:item.ownerId}
    //     return studentArr
    //   })
    //   setStudentsList(students)
    // })
    getDocsByCollection('quiz').then(data => {
      data.filter(item => item.classCode === params.id).map(item => {
        setStudentName(item.students)
      })
    })
  }

  const getFileList = () => {
    getDocsByCollection('files').then(data => {
      const dataFile = data.filter(item => item.classCode === params.id && item.category === 'assignment').map(item => {
        return item
      })
      const studentDataFile = data.filter(item => item.classCode === params.id && item.category === 'assignment' && item.studentId === params.studentId).map(item => {
        return item
      })
      setFileList(dataFile)
      setStudentFile(studentDataFile)
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

  const getAssignment = () => {
    getDocsByCollection('assignment').then(item => {
      const data = item.filter(item => item.classCode === params.id)
      if (data.length !== 0) {
        data.map(item => {
          setAssignmentTitle(item.title)
          setAssignmentId(params.assignmentId)
          setStudentName(item.students)
          setInstruction(item.instruction)
          setTitle(item.title)
          setStartDate(item.created && new Date(item.created.seconds * 1000))
          setDueDate(item.dueDate && new Date(item.dueDate.seconds * 1000))
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

  const saveAssignment = () => {
    const studentData = {
      ownerId: user.currentUser.uid,
      classCode: params.id,
      created: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      title: assignmentTitle,
      studentId: user.currentUser.uid,
      instruction: instruction,
      assignmentId: params.assignmentId,
      score: ''
    }
    saveAssignmentRecord(studentData)
    const file = acceptedFiles.map(file => Object.assign(file))
    uploadFile(file, params.id, params.assignmentId, '', user.currentUser.uid, 'assignment').then(data => {
    })
    const timeout = setTimeout(() => {
      history.push(`/studentclassroomdetail/${params.id}`)
    }, 2000)
    return () => clearTimeout(timeout)
  }

  const handleTitle = (e) => {
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
    setInstruction(e.target.value)
  }

  return (
    <Teacherdrawer classCode={params.id} headTitle={title ? title : 'Create Laboratory'}>
      <Helmet>
        <title>Laboratory Details</title>
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
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
        <>
          <Grid container justifyContent="center">
            <Typography sx={{ marginBottom: 2, fontSize: 30 }}>Assignment Details</Typography>
          </Grid>
          <Grid xs={12} justifyContent='space-between' container>
            <Grid xs={12} justifyContent='flex-start' container>
              <TextField
                label={assignmentTitle === '' ? 'Title' : assignmentTitle}
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={assignmentTitle}
                disabled={true}
                onChange={handleTitle}
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
                    label="Created Date"
                    value={startDate}
                    // onChange={(newValue) => onStartDate(newValue)}
                    disabled={true}
                    renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DateTimePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={(newValue) => setDate(newValue)}
                    disabled={true}
                    renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2 }} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>


            <Grid xs={12} justifyContent='flex-start' sx={style.gridcontainer} container>
              <Grid xs={12} justifyContent='flex-start' container>
                <Grid container>
                  <TextField
                    variant="filled"
                    multiline
                    value={instruction}
                    onChange={(e) => handleInstruction(e)}
                    fullWidth
                    disabled={true}
                    minRows={5}
                  />
                  {fileList && fileList.map(item =>
                    <Grid container>
                      <Link style={{ marginTop: 12 }} href={item.url} underline="none">
                        {item.name}
                      </Link>
                    </Grid>
                  )

                  }
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
            {/* <Grid container xs={12} justifyContent='flex-end' style={{marginTop: 12}}>
              <Grid item sx={{ marginTop: 0.5 }}>
                <Button
                  style={style.btnStyle}
                  onClick={() => history.push(`/studentclassroomdetail/${params.id}`)}
                >
                  cancel
                </Button>
                <Button
                  variant="contained"
                  // disabled={announcementContent ? false : true} 
                  style={style.btnStyle}
                  onClick={saveAssignment}
                >
                  Update
                </Button>
              </Grid>
            </Grid> */}

            <Grid xs={12} justifyContent='flex-start' sx={style.gridcontainer} container>
              <Grid xs={12} justifyContent='flex-start' container>
                <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
                  <Grid container justifyContent='space-between'>
                    <Grid container xs={6}>
                      {/* <section className="container" style={{display:'flex', justifyContent: 'space-between', width:'100%'}}>
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <div>
                            Drag 'n' drop some files here, or click to select files
                            <IconButton sx={style.iconStyle}>
                              <FileUploadIcon />
                            </IconButton>
                          </div>
                          <em>(Only *.doc, *ppt, and *.xls will be accepted)</em>
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
                      </section> */}
                      {studentFile && studentFile.map(item =>
                        <Grid container>
                          <Link style={{ marginTop: 12 }} href={item.url} underline="none">
                            {item.name}
                          </Link>
                        </Grid>
                      )

                      }
                    </Grid>
                    <Grid container xs={6} justifyContent='flex-end'>
                      <Grid item sx={{ marginTop: 0.5 }}>
                        <Button
                          variant='contained'
                          style={style.btnStyle}
                          onClick={() => history.goBack()}
                        >
                          Back
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
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
    </Teacherdrawer>
  )
}