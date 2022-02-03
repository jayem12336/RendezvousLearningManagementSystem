import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import theme from '../utils/theme';

import { createTheme, ThemeProvider } from '@mui/material';

import { useDispatch, useSelector } from "react-redux";

import { auth } from '../utils/firebase';

import { setUser , getUserId, logoutInitiate} from '../redux/actions/userAction';

import { getUser } from '../utils/firebaseUtil'

// nonuserhomepage
import Login from '../pages/nonuserpages/Login';
import Register from '../pages/nonuserpages/Register';
import Home from '../pages/nonuserpages/Home';
import NewForgot from '../pages/nonuserpages/NewForgot';
import NotFound from '../pages/nonuserpages/NotFound';
import NotFoundPage from '../pages/nonuserpages/NotFound';

//userhomepage
// import DashboardUser from '../pages/userpages/dashboarduser/DashboarduUser';
// import DashboardProfile from '../pages/userpages/dashboardprofile/DashboardProfile';
// import DashboardClass from '../pages/userpages/dashboardclassfolder/DashboardClass';
// import Announcement from '../pages/userpages/announcement'
// import DashboardCalendar from '../pages/userpages/dashboardcalendar/DashboardCalendar';
// import DashboardFile from '../pages/userpages/dashboardfile/DashboardFile';
// import DashboardAbout from '../pages/userpages/dashboardabout/DashboardAbout';

//main classroom
import ClassAnnouncement from '../pages/userpages/mainclassroom/classlinks/classannouncement/ClassAnnouncement';
import ClassAnnouncementList from '../pages/userpages/mainclassroom/classlinks/classannouncement';
import ClassJoinMeet from '../pages/userpages/mainclassroom/classlinks/classjoinmeet/ClassJoinMeet';
import ClassPeople from '../pages/userpages/mainclassroom/classlinks/classpeople/ClassPeople';
import { getClassroomData } from '../redux/actions/classAction';
import ClassWork from '../pages/userpages/mainclassroom/classlinks/classwork/ClassWork';
import ClassList from '../pages/userpages/mainclassroom/classlinks/classList';
import ClassListDetail from '../pages/userpages/mainclassroom/classlinks/classList/ClassDetail';
// import ClassListStudent from '../pages/userpages/mainclassroom/student/classListStudent';
import Laboratory from '../pages/userpages/mainclassroom/classlinks/classLaboratory/Lab'
import LaboratoryDetail from '../pages/userpages/mainclassroom/classlinks/classLaboratory/LabDetails'
import LaboratoryStudent from '../pages/userpages/mainclassroom/classlinks/studentLaboratory/Lab'
import LaboratoryView from '../pages/userpages/mainclassroom/classlinks/classLaboratory/ViewWork'
import LabList from '../pages/userpages/mainclassroom/classlinks/classLaboratory'
import ClassQuiz from '../pages/userpages/mainclassroom/classlinks/classQuiz'
import ClassNewQuiz from '../pages/userpages/mainclassroom/classlinks/classQuiz/NewQuiz'
import ClassQuizList from '../pages/userpages/mainclassroom/classlinks/classQuiz/ClassQuizList'
import QuizDetail from '../pages/userpages/mainclassroom/classlinks/classQuiz/QuizDetail'
import Profile from '../pages/userpages/mainclassroom/classlinks/profile'
import Calendar from '../pages/userpages/mainclassroom/classlinks/calendar'
import Files from '../pages/userpages/mainclassroom/classlinks/files'
import About from '../pages/userpages/mainclassroom/classlinks/about'
import ClassStudentList from '../pages/userpages/mainclassroom/classlinks/studentList'
import ClassGrade from '../pages/userpages/mainclassroom/classlinks/classGrade'
import ClassSetting from '../pages/userpages/mainclassroom/classlinks/classsetting/ClassSetting';
import ClassNewExam from '../pages/userpages/mainclassroom/classlinks/classExam/NewQuiz'
import ExamDetail from '../pages/userpages/mainclassroom/classlinks/classExam/QuizDetail'
import ClassNewAssignment from '../pages/userpages/mainclassroom/classlinks/classAssignment'
import AssignmentDetail from '../pages/userpages/mainclassroom/classlinks/classAssignment/AssignmentDetails'
import AssignmentView from '../pages/userpages/mainclassroom/classlinks/classAssignment/ViewWork'

//student components
import StudentClassList from '../pages/userpages/mainclassroom/student/classList'
import StudentClassListDetail from '../pages/userpages/mainclassroom/student/classList/ClassDetail';
import StudentLaboratoryDetail from '../pages/userpages/mainclassroom/student/classLaboratory/LabDetails'
import StudentQuizDetail from '../pages/userpages/mainclassroom/student/classQuiz/QuizDetail'
import StudentClassAnnouncement from '../pages/userpages/mainclassroom/student/classannouncement/ClassAnnouncement';
import StudentClassJoinMeet from '../pages/userpages/mainclassroom/student/classjoinmeet/ClassJoinMeet';
import StudentList from '../pages/userpages/mainclassroom/student/studentList'
import StudentClassSetting from '../pages/userpages/mainclassroom/student/classsetting/ClassSetting';
import StudentExamDetail from '../pages/userpages/mainclassroom/student/classExam/QuizDetail'
import StudentAssignmentDetail from '../pages/userpages/mainclassroom/student/classAssignment/AssignmentDetails'





export default function RouterComponent() {

    const dispatch = useDispatch();

    const { user, classUser } = useSelector((state) => state);
    const [isTeacher, setIsTeacher]= useState(false)

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            // dispatch(getUserId())
            if (authUser) {
                dispatch(setUser(authUser));
                dispatch(getClassroomData());
            } else {
                dispatch(setUser(null));
            }
        })
    }, [dispatch])

    useEffect(() => {
        if(user.currentUser){
            getUser().then(data => {
                if(data){
                        data.map(item => {
                        setIsTeacher(item.isTeacher)
                    })
                }
                
            })
        }
            
    }, [user])

    // console.log(user);

    console.log(classUser.classData)
    console.log('asdasd',user.currentUser)
    console.log('oijoiu',isTeacher)
    console.log(window.sessionStorage.getItem('user') === 'false')
    // console.log(sessionStorage.getItem("session"))

    const THEME = createTheme(theme);

    const PublicRoute = ({component: Component, restricted, ...rest}) => {
        // sessionStorage.clear();
        return (
            // restricted = false meaning public route
            // restricted = true meaning restricted route
            <Route {...rest} render={props => (
                user.currentUser && window.sessionStorage.getItem('id') !== null && window.sessionStorage.getItem('user') !== null?
                    <Redirect to={window.sessionStorage.getItem('user') === 'true' ? `/classroom` : `/studentclassroom` } />
                : <Component {...props} />
            )} />
        );
    };

    const PrivateRoute = ({component: Component, ...rest}) => {
        // if (user) {
        //     dispatch(logoutInitiate());
        // }
        return (
    
            // Show the component only when the user is logged in
            // Otherwise, redirect the user to /signin page
            <Route {...rest} render={props => (
                user.currentUser && window.sessionStorage.getItem('id') !== null ?
                    <Component {...props} />
                : <Redirect to="/404" />
            )} />
        );
    };

    const TeacherRoute = ({component: Component, ...rest}) => {
        return (
    
            // Show the component only when the user is logged in
            // Otherwise, redirect the user to /signin page
            <Route {...rest} render={props => (
                user.currentUser && window.sessionStorage.getItem('id') !== null && window.sessionStorage.getItem('user') === 'true' ?
                    <Component {...props} />
                : <Redirect to="/404" />
            )} />
        );
    };

    const StudentRoute = ({component: Component, ...rest}) => {
        return (
    
            // Show the component only when the user is logged in
            // Otherwise, redirect the user to /signin page
            <Route {...rest} render={props => (
                user.currentUser && window.sessionStorage.getItem('id') !== null && window.sessionStorage.getItem('user') === 'false' ?
                    <Component {...props} />
                : <Redirect to="/404" />
            )} />
        );
    };
    

    return (
        <ThemeProvider theme={THEME}>
            <Router>
                <Switch>
                    {/* noneuser */}
                    <PublicRoute restricted={false} component={Home} path="/" exact />
                    <PublicRoute restricted={false} component={NewForgot} path="/forgot" exact />
                    <PublicRoute restricted={false} component={Login} path="/login" exact />
                    <PublicRoute restricted={false} component={Register} path="/register" exact />
                    <PublicRoute restricted={false} component={NewForgot} path="/forgot" exact />

                    {/* userhomepage */}
                    {/* <Route component={DashboardUser} path="/dashboarduser" exact />
                    <Route component={DashboardProfile} path="/dashboardprofile" exact />
                    <Route component={DashboardClass} path="/dashboardclass" exact />
                    <Route component={Announcement} path="/announcement/:id" exact />
                    <Route component={DashboardCalendar} path="/dashboardcalendar" exact />
                    <Route component={DashboardFile} path="/dashboardfile" exact />
                    <Route component={DashboardAbout} path="/dashboardabout" exact /> */}
                    {/* <Route component={ClassSetting} path="/classsetting/:id" exact /> */}

                    
                    {/* <Route component={ClassAnnouncementList} path="/classannouncement/" exact /> */}
                    {/* <Route component={ClassQuizList} path="/quiz/" exact /> */}
                    {/* <Route component={ClassWork} path="/classwork" exact /> */}
                    
                    {/* teacher router */}
                    <PrivateRoute component={Profile} path="/profile" exact />
                    <PrivateRoute component={Calendar} path="/calendar" exact />
                    <PrivateRoute component={About} path="/about/" exact />
                    <PrivateRoute component={Files} path="/files/" exact />

                    {/* teacher mainclassroom */}
                   
             
                  
                  
                    <TeacherRoute component={ClassList} path="/classroom" exact />
                    <TeacherRoute component={ClassJoinMeet} path="/classjoinmeet/:id" exact />
                    <TeacherRoute component={ClassListDetail} path="/classroomdetail/:id" exact />
                    <TeacherRoute component={ClassAnnouncement} path="/classannouncement/:id" exact />
                    <TeacherRoute component={LaboratoryDetail} path="/laboratorydetail/:id/:labId" exact />
                    <TeacherRoute component={Laboratory} path="/laboratory/:id/:labId" exact />
                    <TeacherRoute component={LaboratoryView} path="/viewlab/:id/:labId/:studentId" exact />
                    <TeacherRoute component={ClassGrade} path="/studentgrade/:id" exact />
                    <TeacherRoute component={ClassStudentList} path="/studentlist/:id" exact />
                    <TeacherRoute component={ClassNewQuiz} path="/quiz/:id/:quizId" exact />
                    <TeacherRoute component={QuizDetail} path="/quizdetail/:id/:quizId" exact />
                    <TeacherRoute component={ClassJoinMeet} path="/classjoinmeet/:id" exact />
                    <TeacherRoute component={ClassSetting} path="/classsetting/:id" exact /> 
                    <TeacherRoute component={ClassNewExam} path="/exam/:id/:examId" exact />
                    <TeacherRoute component={ExamDetail} path="/examdetail/:id/:examId" exact />
                    <TeacherRoute component={ClassNewAssignment} path="/assignment/:id/:assignmentId" exact />
                    <TeacherRoute component={AssignmentDetail} path="/assignmentdetail/:id/:assignmentId" exact />
                    <TeacherRoute component={AssignmentView} path="/viewassignment/:id/:assignmentId/:studentId" exact />
                   
                   
                    
                    
                    {/*student router */}
                    {/* <Route component={ClassListStudent} path="/studentclassroom" exact /> */}
                    <StudentRoute component={LaboratoryStudent} path="/studentlaboratory/:id" exact />
                    <StudentRoute component={StudentClassList} path="/studentclassroom" exact />
                    <StudentRoute component={StudentClassListDetail} path="/studentclassroomdetail/:id" exact />
                    <StudentRoute component={StudentLaboratoryDetail} path="/studentlaboratorydetail/:id/:labId" exact />
                    <StudentRoute component={StudentQuizDetail} path="/studentquizdetail/:id/:quizId" exact />
                    <StudentRoute component={StudentClassAnnouncement} path="/studentclassannouncement/:id" exact />
                    <StudentRoute component={StudentClassJoinMeet} path="/studentclassjoinmeet/:id" exact />
                    <StudentRoute component={StudentList} path="/classstudentlist/:id" exact />
                    <StudentRoute component={StudentClassSetting} path="/studentsetting/:id" exact /> 
                    <StudentRoute component={StudentExamDetail} path="/studentexamdetail/:id/:examId" exact />
                    <StudentRoute component={StudentAssignmentDetail} path="/studentassignmentdetail/:id/:assignmentId" exact />
                    

                    <Route component={NotFound} path='/'/>
                    <Route component={NotFoundPage} path='/404'/>
                    

                    {/* common user page */}
                    {/* <Route component={LabList} path="/laboratory" exact /> */}
                    {/* <Route component={ClassQuiz} path="/quiz/:id" exact /> */}
                    {/* <Route component={ClassPeople} path="/classpeople/:id" exact /> */}
                </Switch>
            </Router>
        </ThemeProvider>

    )
}