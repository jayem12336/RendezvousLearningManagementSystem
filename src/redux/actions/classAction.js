import * as actionTypes from '../types';

export const toggleClassroomData = (classData, history) => async (dispatch) => {
    try {
        localStorage.setItem('classdata' , JSON.stringify(classData));
        dispatch({ type: actionTypes.SET_CLASSROOM, payload: classData });
        history.push(`/classannouncement/${classData.id}`)
    } catch (err) {
        console.error(err);
    }
};

export const getClassroomData = () => async (dispatch) => {
    try {
        const classData = 
        localStorage.getItem('classdata');
        dispatch({ type: actionTypes.SET_CLASSROOM, payload: JSON.parse(classData)});
    } catch (err) {
        console.error(err);
    }
};








