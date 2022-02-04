import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';

import { ref, getDownloadURL } from "firebase/storage";


import AddIcon from '@mui/icons-material/Add';

import ClassDrawer from '../../classdrawer/ClassDrawer';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase'

import { getUser, uploadImage } from '../../../../../utils/firebaseUtil';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logoutInitiate } from '../../../../../redux/actions/userAction';


import Input from '../../../../../components/Input'
import InputProfile from '../../../../../components/InputProfile'

import { getAuth, updatePassword } from "firebase/auth";
import { useHistory } from 'react-router';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';


const style = {
  gridcontainer: {
    display: "flex",
    boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)',
    marginTop: 5,
    maxWidth: 1000,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
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
  },
  profileLogo: {
    height: 130,
    width: 130,
    borderRadius: 30,
    border: '1px solid white'
  },
  addbtn: {
    position: 'relative',
    top: '80%',
    left: '-2%',
    height: 30,
    width: 30,
    border: '1px solid black',
    backgroundColor: '#949494',
    '&:hover': {
      backgroundColor: '#949494'
    },
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 1,
    marginLeft: 1,
    marginTop: 2
  },
  saveBtn: {
    marginTop: 3,
    width: 100,
    height: 40,
    fontWeight: "bold",
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 18
  },
  uploadInput: {
    // border: '1px solid red',
    '#icon-button-file': {
      display: ' none',
      border: '1px solid red'
    },

    // input: {
    //   display: ' none',
    //   border: '1px solid red'
    // },
    'label': {
      height: 'fit-content',
      position: 'relative',
      top: '75%',
      left: '-4%',
      'div': {
        border: 0
      }
    },
  },
  uploadIcon: {
    height: 30,
    width: 30,
    border: '1px solid white',
    backgroundColor: '#4BAEA6',
    '&:hover': {
      backgroundColor: '#949494'
    },
  }
}

export default function ClassAnnouncementList() {

  const [userDetail, setUserDetail] = useState([])

  const params = useParams()
  const dispatch = useDispatch();
  const history = useHistory();

  const { user } = useSelector((state) => state);
  const [values, setValues] = useState({
    newPassword: '',
    confirmPassword: '',
    phone: '',
    photoUrl: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false)
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {

    if (Object.keys(user.currentUser).length !== 0) {
      getUser().then(item => {
        setUserDetail(item)
        setValues({
          ...values,
          phone: item[0].phone
        })
        setImgUrl(item[0].photoUrl)
      })
    }
  }, [user]);

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const onSave = () => {
    setSuccess('')
    setError('')

    if (values.newPassword !== '' && values.newPassword !== values.confirmPassword) {
      setSuccess('')
      setError('Password not matched, please type again')
    } else if (values.phone === '' && values.newPassword === '' && values.confirmPassword === '' && values.photoUrl !== '') {
      setError('')
      const docRef = doc(db, 'users', user.currentUser.uid);
      setDoc(docRef, { phone: values.phone, photoUrl: values.photoUrl }, { merge: true });
      setOpen(true)
    } else if (values.phone === '' && values.newPassword === '' && values.confirmPassword === '') {
      setSuccess('')
      setError('Please fill out fields')
    } else if (/^(09|\+639)\d{9}$/.test(values.phone) === false && /^[0-9]{8}$/.test(values.phone) === false) {
      setSuccess('')
      setError('invalid phone')
    } else {
      setError('')
      // const docRef = doc(db, 'users', user.currentUser.uid);
      // setDoc(docRef, { phone: values.phone }, { merge: true });
      const auth = getAuth();
      // const user = auth.currentUser;
      // const newPassword = getASecureRandomPassword();
      const docRef = doc(db, 'users', user.currentUser.uid);
      setDoc(docRef, { phone: values.phone, photoUrl: imgUrl }, { merge: true });
      setOpen(true)
      updatePassword(user, values.newPassword).then(() => {
        setOpen(true)
        setSuccess('Profile has been updated')
        handleLogOut()
      }).catch((error) => {
        // An error ocurred
        // ...
      });
    }
  }

  const handleLogOut = () => {
    if (user) {
      dispatch(logoutInitiate());
      history.push('/');
    }
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    uploadImage(file).then(data => {
      getDownloadURL(data.ref).then(url => {
        setValues({
          ...values,
          photoUrl: url
        })
        setImgUrl(url)
      })
    })
  }

  const userDetailBody = () => {
    return userDetail && userDetail.map(item =>
      <Grid container sx={style.gridcontainer} justifyContent='center'>
        <Grid container justifyContent='center' sx={style.uploadInput}>
          <Avatar sx={style.profileLogo} variant="square" src={imgUrl} />
          {/* <Input accept="image/*" id="icon-button-file" type="file" /> */}
          {/* <IconButton sx={style.addbtn}> */}
          <label htmlFor="icon-button-file" sx={style.uploadContainer}>
            <InputProfile accept="image/*" id="icon-button-file" type="file" onChange={onFileChange} />
            <IconButton sx={style.uploadIcon} aria-label="upload picture" component="span">
              <AddIcon sx={{ color: 'white' }} />
            </IconButton>
          </label>
          {/* <IconButton sx={style.uploadIcon}>
            <AddIcon sx={{ color: 'white' }} />
          </IconButton> */}

        </Grid>
        <Grid xs={12} item sx={{ maxWidth: 500 }}>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Name</Typography>
            <Input
              type='text'
              value={item.displayName}
              name='Name'
              disabled
              onChange={null}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Email</Typography>
            <Input
              type='text'
              value={item.email}
              name='Email'
              disabled
              onChange={null}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Phone Number</Typography>
            <Input
              type='number'
              value={values.phone}
              pattern={'[0-9]{16}'}
              name='phone'
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>New Password</Typography>
            <Input
              type='password'
              name='newPassword'
              value={values.newPassword}
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid item xs={12} spacing={3}>
            <Typography sx={style.textStyle}>Confirm New Password</Typography>
            <Input
              type='password'
              value={values.confirmPassword}
              name='confirmPassword'
              onChange={onChange}
            // errorMessage={error.firstName}
            />
          </Grid>
          <Grid container justifyContent='center'>
            <Typography sx={{ color: 'red' }}>{error}</Typography>
            <Typography sx={{ color: 'green' }}>{success}</Typography>
          </Grid>
          <Grid container justifyContent='center'>
            <Button
              variant="contained"
              sx={style.saveBtn}
              onClick={onSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  return (
    <ClassDrawer headTitle='Profile'>
      <Helmet>
        <title>Profile</title>
        <link rel="Profile Icon" href={logohelmetclass} />
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
          Successfully Updated Profile
        </Alert>
      </Snackbar>
      <Box component={Grid} container justifyContent="center" sx={{ paddingTop: 5 }}>
        {userDetail && userDetailBody()}
      </Box>
    </ClassDrawer>
  )
}
