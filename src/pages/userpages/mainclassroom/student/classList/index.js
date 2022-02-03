import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import { getUser } from '../../../../../utils/firebaseUtil'

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';


import {
	Typography,
	Box,
	Grid,
	Button,
} from '@mui/material';

import Classdrawer from '../../classdrawer/ClassDrawer';
import bgImage from '../../../../../assets/img/jpg/animatedcomputer.jpg';

import { Helmet } from 'react-helmet';
import logohelmetclass from '../../../../../assets/img/png/monitor.png';

import JoinClass from './JoinClass';

const style = {
	gridcontainer: {
		display: "flex",
		padding: 2,
		borderBottom: 3,
		borderColor: (theme) => theme.palette.primary.main
	},
	gridcontainerClass: {
		display: "flex",
		padding: 2,
		marginTop: -3
	},
	main: {
		display: "flex",
		alignItems: "center",
	},
	iconStyle: {
		color: (theme) => theme.palette.primary.main,
		margin: 0.5
	},
	btnStyle: {
		borderRadius: 20,
		fontSize: 18,
		width: 'auto',
		marginRight: 2,
		fontWeight: "bold",
		marginBottom: 4,
		textTransform: 'none',
		color: (theme) => theme.colors.textColor,
		backgroundColor: (theme) => theme.palette.primary.main,
		'&:hover': {
			backgroundColor: "#3e857f",
			boxShadow: '0 3px 5px 2px rgba(163, 163, 163, .3)',
		},
	},
	textStyle: {
		paddingLeft: 2,
		fontSize: 20,
		fontWeight: 400
	},
	linkStyle: {
		color: 'white',
		fontSize: 25,
		textAlign: 'center',
		fontWeight: "bold"
	},
	imgStyle: {
		height: 300,
		width: 300,

	},
	imgContainer: {
		width: 200
	},
	txtContainer: {
		width: 500
	},
	headerClass: {
		backgroundColor: '#4BAEA6',
		width: '112%',
		marginLeft: -2,
		height: 70,
		marginTop: -2,
		paddingTop: 2
	}
}

export default function ClassList() {

	const history = useHistory();
	const { user } = useSelector((state) => state);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [isTeacher, setIsTeacher] = useState(false)

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const [classroom, setClassroom] = useState([]);
	const [student, setStudent] = useState([])

	//Join Class Dialog
	const [joinClassOpen, setOpenJoinClass] = useState(false);

	const handleOpenJoinClass = () => {
		setOpenJoinClass(!joinClassOpen);
	}

	//Load classrooms
	useEffect(() => {
		if (Object.keys(user.currentUser).length !== 0) {
			getClassData()
			getUser().then(data => {
				data.map(item => {
					setIsTeacher(item.isTeacher)
				})
				setStudent(data)
			})
		}
	}, [user]);

	const getClassData = () => {
		const classCollection = collection(db, "studentRecord", user.currentUser.uid, "classroom")
		const q = query(classCollection, where('isDeleted', "==", false));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setClassroom(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
		}
		)
		return unsubscribe;
	}

	const classroomBody = () => {
		return (
			<Box component={Grid} container justifyContent="center">
				<Helmet>
					<title>Student Classroom</title>
					<link rel="Classroom Icon" href={logohelmetclass} />
				</Helmet>
				<Box component={Grid} container justifyContent="center">
					<Grid container sx={style.gridcontainerClass}>
						{classroom && classroom.map(item =>
							<Box sx={{ minWidth: 300, boxShadow: '0 3px 5px 2px rgb(126 126 126 / 30%)', padding: 2, margin: 2, }}>
								<Box sx={style.headerClass} key={item.id} container justifyContent="center">
									<Typography sx={style.linkStyle}>
										{item.className}
									</Typography>
								</Box>
								<Box sx={{ marginTop: 5 }}>
									<Typography variant="h6" sx={{ marginTop: 1, fontWeight: "bold" }}>{item.section}</Typography>
									<Typography variant="h6" sx={{ marginTop: 1, fontWeight: "bold" }}>{item.subject}</Typography>
									<Typography variant="h6" sx={{ marginTop: 1, fontWeight: "bold" }}>{item.room}</Typography>
								</Box>
								<Box component={Grid} container justifyContent="center" sx={{ marginTop: 5 }}>
									<Button variant="contained" sx={{ backgroundColor: '#FFBD1F', fontWeight: "bold" }} onClick={() => history.push(`/studentclassroomdetail/${item.classCode}`)}> Go inside </Button>
								</Box>
							</Box>
						)}
					</Grid>
				</Box>
			</Box>
		)
	}

	console.log(user)
	console.log(classroom)
	console.log(student)

	return (
		<Classdrawer headTitle='Classroom'>
			<Helmet>
				<title>Student Dashboard</title>
				<link rel="Classroom Icon" href={logohelmetclass} />
			</Helmet>
			<Box component={Grid} container justifyContent="center" sx={{ paddingTop: 10 }}>
				<Grid container sx={style.gridcontainer} justifyContent="space-between">
					<Grid item>
						<Button variant="outlined"
							sx={style.btnStyle}
							id="fade-button"
							aria-controls="fade-menu"
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleOpenJoinClass}
						>
							Request Class
						</Button>
					</Grid>
				</Grid>
			</Box>
			{classroom ?
				<Box component={Grid} container justifyContent="" alignItems="" sx={{ paddingTop: 5, flexDirection: "column" }}>
					{classroomBody()}
				</Box>
				:
				<Box component={Grid} container justifyContent="center" alignItems="center" sx={{ paddingTop: 5, flexDirection: "column" }}>
					<Box component={Grid} container justifyContent="center" sx={style.imgContainer}>
						<Box component="img" src={bgImage} alt="Animated Computer" sx={style.imgStyle} />
					</Box>
					<Box component={Grid} container justifyContent="center" sx={style.txtContainer}>
						<Typography>
							This is where you'll see classrooms.
						</Typography>
						<Typography>
							You can join class, see activities and check available quiz
						</Typography>
					</Box>
				</Box>
			}
			<JoinClass
				isJoinClassOpen={joinClassOpen}
				toggleJoinClass={handleOpenJoinClass}
				userId={user.currentUser.uid}
				student={student}
			/>
		</Classdrawer >
	)
}
