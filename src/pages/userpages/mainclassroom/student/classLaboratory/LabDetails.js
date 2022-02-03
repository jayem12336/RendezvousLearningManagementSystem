import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';


import { v4 as uuidv4 } from 'uuid';

import { getLabStudent, saveLabRecord, saveLabStudent, getStudentByAssigned } from '../../../../../utils/firebaseUtil'
import { Timestamp } from 'firebase/firestore';

import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';


import Studentdrawer from '../../classdrawer/ClassDrawerStudent';
import Editor from './Editor'

const style = {
  gridcontainer: {
    display: "flex",
    marginTop: 5,
    padding: 2,
    maxWidth: 900,
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
    fontWeight: "bold",
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
  const [title, setTitle] = useState('')
  const [score, setScore] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')


  const { user } = useSelector((state) => state);
  const params = useParams()
  const history = useHistory();
  const id = (uuidv4().slice(-8));


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
      getLaboratory()
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
    getLabStudent(params.id, user.currentUser.uid, params.labId).then(item => {
      // const data = item
      if (item.length !== 0) {
        // console.log(data)
        setHtml(item.html)
        setCss(item.css)
        setJs(item.js)
        setSrcDoc(item.body)
        setLabTitle(item.title)
        setLabId(params.labId)
        setStudentName(item.students)
        setInstruction(item.instruction)
        setTitle(item.title)
        setScore(item.score ? item.score : '')
        setStartDate(item.startDate && new Date(item.startDate.seconds * 1000))
        setDueDate(item.dueDate && new Date(item.dueDate.seconds * 1000))
      } else {
        setIsNew(true)
      }

    })
  }

  const saveLab = () => {
    const studentData = {
      html: html,
      css: css,
      js: js,
      studentId: user.currentUser.uid,
      classCode: params.id,
      submitDate: Timestamp.now(),
      created: Timestamp.now(),
      startDate: Timestamp.fromDate(new Date(startDate)),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      title: labTitle,
      instruction: instruction,
      labId: params.labId,
      score: score,
    }
    saveLabStudent(studentData)
    saveLabRecord(studentData)
    setOpen(true)
    const timeout = setTimeout(() => {
      history.push(`/studentclassroomdetail/${params.id}`)
    }, 2000)

    return () => clearTimeout(timeout)
  }

  const handleTitle = (e) => {
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
    setInstruction(e.target.value)
  }

  console.log(studentName)
  console.log(studentsList)
  console.log(labId)
  return (
    <Studentdrawer classCode={params.id} headTitle={title}>
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
      <Helmet>
        <title>Student Laboratory</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
        <>
          <Grid xs={12} justifyContent='space-between' container>
            <Grid xs={12} justifyContent='flex-start' container>
              <Typography
                variant="h6"
                onClick={() => null}
                sx={{ fontWeight: "bold" }}
              >
                {labTitle}
              </Typography>
              {/* <TextField 
                label={labTitle === '' ? 'Title' : labTitle} 
                variant="outlined" 
                sx={{marginBottom: 2}}
                value={labTitle}
                onChange={handleTitle}
              /> */}
              {/* <Button 
                variant="contained" 
                color="primary" 
                sx={{ marginTop: 2, marginBottom: 2 }}
                onClick={() => saveLab()}
              >
                {isNew ? 'Save' : 'Update'}
              </Button> */}
            </Grid>
            <Grid xs={12} justifyContent='flex-start' container>
              <Grid container>
                <Typography
                  variant="p"
                  onClick={() => null}
                  sx={{ fontWeight: "bold" }}
                >
                  {instruction}
                </Typography>
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
                  <Grid item sx={{ marginTop: 0.5, marginBottom: 1 }}>
                    <Button
                      style={style.btnStyle}
                      onClick={() => history.goBack()}
                    >
                      cancel
                    </Button>
                    <Button
                      variant="contained"
                      // disabled={announcementContent ? false : true} 
                      style={style.btnStyle}
                      onClick={saveLab}
                    >
                      Save
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={style.pane, style.topPane}>
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
          </Box>
        </>
      </Box>
    </Studentdrawer>
  )
}
