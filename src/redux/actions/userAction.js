import * as actionTypes from '../types';

import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from '@firebase/firestore';
import {getDocsByCollection} from '../../utils/firebaseUtil'

import { db } from '../../utils/firebase';

const registerSuccess = (user) => ({
    type: actionTypes.REGISTER_SUCCESS,
    payload: user
});

const handleNew = async(user) => {
    const docRef = doc(db, "users", user.uid);
    const payload = { displayName: user.displayName, email: user.email, uid: user.uid, photoURL: user.photoURL};
    await setDoc(docRef, payload);
}

export const registerInitiate = (email, password, displayName, history) => (dispatch) => {
    try {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                updateProfile(auth.currentUser, {
                    displayName: displayName,
                }).then(() => {
                    handleNew(user);
                    dispatch(registerSuccess(user));
                    history.push('/classroom');
                }).catch((error) => {
                    alert(error);
                });

            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
                // ..
            });
    } catch (err) {
        console.error(err)
    }
}

export const loginSuccess = (user) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: user
});

export const loginInitiate = (email, password, history) => (dispatch) => {
    try {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          dispatch(loginSuccess(user));
          window.sessionStorage.setItem('id',user.uid)
          getDocsByCollection('users').then(data => {
            data.filter(data => data.ownerId === user.uid).map(data => {
                window.sessionStorage.setItem('user',data.isTeacher)
                setTimeout(() => {
                    if (data.isTeacher) {
                        history.push('/classroom')
                    } else {
                        history.push('/studentclassroom')
                    }
                  }, 2000)
                // if(data.isTeacher){
                // history.push('/classroom')
                // }else {
                // history.push('/studentclassroom')
                // }
              })
          })
        //   history.push('/classroom');
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
      
    } catch (err) {
        console.error(err)
    }
}

export const setUser = (user) => async (dispatch) => {
    try {
        await dispatch({ type: actionTypes.SET_USER, payload: user });
    } catch (err) {
        console.error(err)
    }
}

export const getUserId = () => async (dispatch) => {
    try {
        const userId = window.sessionStorage.getItem('id')
        await dispatch({ type: actionTypes.SET_USER, payload: JSON.parse(userId)});
    } catch (err) {
        console.error(err)
    }
}

const logoutSuccess = (user, history) => {
    history.push('/');  
    return {
        type: actionTypes.LOGOUT_SUCCESS,
        // payload: user
    };
}

export const logoutInitiate = (user, history) => async (dispatch) => {
    sessionStorage.clear();
    try {
        const auth = getAuth();
        auth.signOut().then(() => {
            
            dispatch(logoutSuccess(user, history));          
        }).catch((error) => {
            // An error happened.
        });
    } catch (err) {
        console.error(err)
    }
}



