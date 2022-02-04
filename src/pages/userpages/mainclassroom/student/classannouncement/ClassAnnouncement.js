import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  Link
} from '@mui/material';

import Studentdrawer from '../../classdrawer/ClassDrawerStudent';
import Banner from '../../../../../assets/img/jpg/banner.jpg'

import { getAnnouncement, getDocsByCollection, getUser } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1100
  },
  announcementcontainer: {
    display: "flex",
    marginTop: { xs: 0, md: 2 },
    maxWidth: 1100
  },
  announcementBannerContainer: {
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    height: {
      xs: 120, md: 300
    },
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${Banner})`,
    alignItems: "center",
    maxWidth: 1100
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

export default function ClassAnnouncement() {

  const [announcementData, setAnnouncementData] = useState();
  const [userId, setUserId] = useState('');
  const [className, setClassName] = useState('')
  const [room, setRoom] = useState('')
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [fileList, setFileList] = useState([])

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
    getFileList()
  }, [user]);

  const getClassData = () => {
    getDocsByCollection('createclass')
      .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        data.map(item => {
          setClassName(item.className)
          setRoom(item.room)
          setSection(item.section)
          setSubject(item.subject)
        })
      })
  }



  const getDataAnnouncement = () => {
    getAnnouncement('announcement', 'created')
      .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        setAnnouncementData(data)
      })
  }

  const getFileList = () => {
    getDocsByCollection('files').then(data => {
      const dataFile = data.filter(item => item.classCode === params.id && item.category === 'announcement').map(item => {
        return item
      })
      setFileList(dataFile)
    })
  }

  const announcementBody = () => {
    return announcementData && announcementData.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='space-between'>
        <Grid xs={12} item sx={{ display: 'flex' }}>
          <Avatar src={item.photoUrl} />
          <Grid container sx={{ paddingLeft: 1 }}>
            <Grid container>
              <Typography sx={{ fontWeight: "bold" }}>{new Date(item.created.seconds * 1000).toLocaleDateString()} {new Date(item.created.seconds * 1000).toLocaleTimeString()}</Typography>
            </Grid>
            <Grid container>
              <Typography sx={{ fontWeight: "bold" }}>{item.ownerName}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          <Typography sx={{ marginTop: 2, fontWeight: "bold" }}>{item.body}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 1, fontWeight: "bold" }}>
          {fileList && fileList.filter(data => data.id === item.announcementId).map(data =>
            <Grid container>
              <Link style={{ marginTop: 12 }} href={data.url} underline="none">
                {data.name}
              </Link>
            </Grid>
          )
          }
        </Grid>
        {/* <Grid xs={12} justifyContent='flex-end' container>
          <Button
            variant="contained"
            color="error"
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
    <Studentdrawer headTitle={className} classCode={params.id} headRoom={room} headSubject={subject} headSection={section}>
      <Helmet>
        <title>Announcement</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Box component={Grid} container justifyContent="center" sx={style.announcementBannerContainer}>
        </Box>
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
                    Cancel
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
      </Box>
      <Box component={Grid} container justifyContent="center">
        <Grid container sx={style.announcementcontainer}>
          {announcementData && announcementBody()}
        </Grid>
      </Box>
    </Studentdrawer>
  )
}
