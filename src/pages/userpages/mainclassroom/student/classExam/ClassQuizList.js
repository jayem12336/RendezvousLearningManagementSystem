import React, { useState, useEffect } from 'react';

import {
    Typography,
    Box,
    Grid,
    Avatar,
    TextField,
    Button,
    IconButton
} from '@mui/material';

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
        width: 80,
        marginLeft: 5
    }
}

export default function ClassQuizList() {

  const [showInput, setShowInput] = useState(false);
  const [announcementData, setAnnouncementData] = useState();
  const [userId, setUserId] = useState('');
  const [className, setClassName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [announcementContent, setAnnoucncementContent] = useState('')
  const [classQuizList, setClassQuizList] = useState([])

  const params = useParams()
  const { user } = useSelector((state) => state);
  const history = useHistory();

  useEffect(() => {
    
    if(Object.keys(user.currentUser).length !== 0){
      getUser().then(item => {
        item.map(data => {
          setUserId(data.ownerId)
          setOwnerName(data.displayName)
        })
          
      })
      getClassData()
      
  }
    getDataQuiz()
    getDataAnnouncement()
  }, [user]);

  const getClassData = () => {
    getDocsByCollection('createclass')
    .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        data.map(item => {
          setClassName(item.className)
        })
    })
  }

  const getDataAnnouncement = () => {
    getAnnouncement('announcement', 'created')
    .then(item => {
      setAnnouncementData(item)
    })
  }

  const getDataQuiz = () => {
    getDocsByCollection('quiz')
    .then(item => {
      setClassQuizList(item)
    })
  }  

  const handleAnnoucement = (e) => {
    setAnnoucncementContent(e.target.value)
  }
  
  const saveAnnoucement = () => {
    const data = {
      body: announcementContent,
      classCode: params.id,
      created: Timestamp.now(),
      ownerId: user.currentUser.uid,
      ownerName: user.currentUser.displayName
    }
    createDoc('announcement',data).then(() => {
      setAnnoucncementContent('')
      getDataAnnouncement()
    })
  }

  const cancelAnnouncement = () => {
    setShowInput(false)
    setAnnoucncementContent('')
  }

  const announcementBody = () => {
    return classQuizList && classQuizList.map(item => 
      <Grid container sx={style.gridcontainer} justifyContent='space-between'>
        <Grid container justifyContent="space-between">
          <Typography>created : {new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
          <Typography>due date:: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()} {new Date(item.dueDate.seconds * 1000).toLocaleTimeString()}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ marginTop: 2 }}>subject : {item.subject ? item.subject: 'not available'}</Typography>
        </Grid>
        <Grid xs={12} item>
          <Typography sx={{ marginTop: 2 }}>no of students : {item.students.length !== 0 ? item.students.length: '0'}</Typography>
        </Grid>
        <Grid xs={12} justifyContent='flex-end' container>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 2 }}
          >
            View
          </Button>
        </Grid>
      </Grid>
    )
  }
  console.log(classQuizList)
  console.log(announcementData)

  return (
    <Teacherdrawer headTitle='All Quiz' classCode={params.id}>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        {announcementData && announcementBody() }
      </Box>
    </Teacherdrawer>
  )
}
