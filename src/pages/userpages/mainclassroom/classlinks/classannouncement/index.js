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

import { getAnnouncement, getDocsByCollection, getUser, createDoc } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

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

export default function ClassAnnouncementList() {

  const [showInput, setShowInput] = useState(false);
  // const [inputValue, setInputValue] = useState('');
  const [announcementData, setAnnouncementData] = useState();
  const [userId, setUserId] = useState('');
  const [className, setClassName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [announcementContent, setAnnoucncementContent] = useState('')

  const params = useParams()
  const { user } = useSelector((state) => state);

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getUser().then(item => {
        item.map(data => {
          setUserId(data.ownerId)
          setOwnerName(data.displayName)
        })

      })
      getClassData()

    }
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
        // const data = item.filter(item => item.classCode === params.id)
        setAnnouncementData(item)
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
    createDoc('announcement', data).then(() => {
      setAnnoucncementContent('')
      getDataAnnouncement()
    })
  }

  const cancelAnnouncement = () => {
    setShowInput(false)
    setAnnoucncementContent('')
  }

  const announcementBody = () => {
    return announcementData && announcementData.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='space-between'>
        <Grid xs={12} item>
          <Typography>{new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
        </Grid>
        <Grid xs={12} item>
          <Typography>{item.ownerName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ marginTop: 2 }}>{item.body}</Typography>
        </Grid>

        {/* <Grid xs={12} justifyContent='flex-end' container>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 2 }}
            onClick={() => null}
          >
            Delete
          </Button>
        </Grid> */}
      </Grid>
    )
  }

  return (
    <Teacherdrawer headTitle='All Announcemnt'>
      <Helmet>
        <title>Announcement</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        {/* <Grid container sx={style.gridcontainer}>
          {showInput ? (
            <Grid container>
              <TextField
                variant="filled"
                multiline
                value={announcementContent}
                onChange={handleAnnoucement}
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
                <Grid item sx={{ marginTop: 0.5 }}>
                  <Button 
                    style={style.btnStyle} 
                    onClick={cancelAnnouncement}
                  > 
                    cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    disabled={announcementContent ? false : true} 
                    style={style.btnStyle}
                    onClick={saveAnnoucement}
                  > 
                    Post
                  </Button>
                </Grid>
              </Box>
            </Grid>
          ) : (
            <Grid container sx={style.main}
              onClick={() => setShowInput(true)}
            >
              <Avatar />
              <Typography style={{ paddingLeft: 20 }}>Announce Something To Class</Typography>
            </Grid>
          )}
        </Grid> */}
        {announcementData && announcementBody()}
      </Box>
    </Teacherdrawer>
  )
}
