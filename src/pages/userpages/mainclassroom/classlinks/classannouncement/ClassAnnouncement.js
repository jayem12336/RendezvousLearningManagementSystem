import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Link
} from '@mui/material';

import Teacherdrawer from '../../classdrawer/ClassDrawerTeacher';
import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';



import { getAnnouncement, getAnnouncementId, deleteAnnouncement, getDocsByCollection, getUser, createDoc, uploadFile } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import Banner from '../../../../../assets/img/jpg/banner.jpg'
import ConfirmDelete from './ConfirmDelete'

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import YouTubeIcon from '@mui/icons-material/YouTube';

const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px  5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    padding: 2,
    maxWidth: 1100,
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
    maxWidth: 1100,
  },
  imageContainer: {

  },
  announcementcontainer: {
    display: "flex",
    marginTop: { xs: 0, md: 2 },
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
    marginLeft: 5,
    fontWeight: "bold"
  },
  inputText: {
    fontWeight: 'bold'
  },
}

export default function ClassAnnouncement() {

  const [showInput, setShowInput] = useState(false);
  // const [inputValue, setInputValue] = useState('');
  const [announcementData, setAnnouncementData] = useState();
  const [userId, setUserId] = useState('');
  const [className, setClassName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [announcementContent, setAnnoucncementContent] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [openDeleteSnack, setOpenDeleteSnack] = useState(false)
  const [itemId, setItemId] = useState('')
  const [fileList, setFileList] = useState([])
  const [displayPhoto, setDisplayPhoto] = useState('')

  const params = useParams()
  const { user } = useSelector((state) => state);
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
      getUser().then(item => {
        item.map(data => {
          setUserId(data.ownerId)
          setOwnerName(data.displayName)
          setDisplayPhoto(data.photoUrl)
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
          setOwnerName(item.displayName)
        })
      })
  }

  const getDataAnnouncement = () => {
    getAnnouncement('announcement', 'created')
      .then(item => {
        const data = item.filter(item => item.classCode === params.id)
        // setAnnouncementData(data)

      })
    getAnnouncementId('announcement', 'created')
      .then(item => {
        const announceData = item.docs.map((doc) => {
          let newData = { ...doc.data(), id: doc.id }
          // newData.filter(item => item.classCode === params.id)
          // setAnnouncementData(newData)
          return newData
        })
        setAnnouncementData(announceData)
        // const data = item.filter(item => item.classCode === params.id)
        // setAnnouncementData(data)

      })
  }

  const getFileList = () => {
    getDocsByCollection('files').then(data => {
      const dataFile = data.filter(item => item.classCode === params.id && item.category === 'announcement' && item.ownerId === user.currentUser.uid).map(item => {
        return item
      })
      setFileList(dataFile)
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
      ownerName: ownerName,
      announcementId: id,
      photoUrl: displayPhoto
    }
    createDoc('announcement', data).then(() => {
      const file = acceptedFiles.map(file => Object.assign(file))
      uploadFile(file, params.id, id, user.currentUser.uid, '', 'announcement').then(data => {
      })
      setShowInput(false)
      setAnnoucncementContent('')
      acceptedFiles.splice(0, acceptedFiles.length)
      getDataAnnouncement()
      getFileList()
    })
  }

  const cancelAnnouncement = () => {
    setShowInput(false)
    setAnnoucncementContent('')
  }

  const onDelete = () => {
    // setIsOpen(false)
    deleteAnnouncement(itemId).then(() => {
      setOpenDeleteSnack(true)
      setIsOpen(false)
      getDataAnnouncement()
      getFileList()
    })
    // getDataAnnouncement()
  }

  const handleCloseConfirm = () => {
    setIsOpen(false)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenDeleteSnack(false)
  };

  const onDeleteDialog = (id) => {
    setItemId(id)
    setIsOpen(true)
  }

  const announcementBody = () => {
    return announcementData && announcementData.filter(item => item.classCode === params.id).map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='space-between'>
        <Grid xs={12} item sx={{ display: 'flex' }}>
          <Avatar src={displayPhoto} />
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
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          {fileList && fileList.filter(data => data.id === item.announcementId).map(data =>
            <Grid container>
              <Link style={{ marginTop: 12 }} href={data.url} underline="none" sx={{ fontWeight: "bold" }}>
                {data.name}
              </Link>
            </Grid>
          )
          }
        </Grid>
        <Grid xs={12} justifyContent='flex-end' container>
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: 2, fontWeight: "bold" }}
            onClick={() => onDeleteDialog(item.id)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Teacherdrawer headTitle={className} classCode={params.id}>
      <Helmet>
        <title>Announcement</title>
        <link rel="Classroom Icon" href={logohelmetclass} />
      </Helmet>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        open={openDeleteSnack}
        onClose={handleClose}
        message="I love snacks"
      // key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontWeight: "bold" }}>
          Successfully Deleted Class
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        <Box component={Grid} container justifyContent="center" sx={style.announcementBannerContainer}>
        </Box>
        <Grid container sx={style.gridcontainer}>
          {showInput ? (
            <Grid container>
              <TextField
                variant="filled"
                multiline
                value={announcementContent}
                onChange={handleAnnoucement}
                fullWidth
                minRows={5}
                InputProps={{
                  sx: style.inputText
                }}
                InputLabelProps={{
                  sx: style.inputText
                }}
              />
              <Box sx={{ marginTop: 2 }} container component={Grid} justifyContent="space-between">
                {/* <Grid item> */}
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
                {/* </Grid> */}
                <Grid item>
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
              <Avatar src={displayPhoto} />
              <Typography style={{ paddingLeft: 20, fontWeight: "bold" }}>Announce Something To Class</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box component={Grid} container justifyContent="center">
        <Grid container sx={style.announcementcontainer}>
          {announcementData && announcementBody()}
        </Grid>
      </Box>
      <ConfirmDelete
        isOpen={isOpen}
        handleCloseConfirm={handleCloseConfirm}
        confirmDeleteItem={onDelete}
      />
    </Teacherdrawer>
  )
}
