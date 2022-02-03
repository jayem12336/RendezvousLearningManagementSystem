import { 
  db, 
  // bucketRef, 
  auth,
  storage
} from './firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs,getDoc, updateDoc, doc, arrayUnion,arrayRemove, setDoc, orderBy, query, where, deleteDoc, Timestamp} from "firebase/firestore"; 
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";



/**
 * 
 * @param {string} email 
 * @param {string} password
 * @param {object} data
 */
export const createUser = async (email, password, data) => {
  const isUserCreated = await createUserWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setDoc(doc(db, 'users', user.uid), 
      {
        displayName: data.displayName, 
        email: data.email, 
        isTeacher: data.isTeacher,
        phone: data.phone,
        ownerId: user.uid
      }
    );
    return user.uid
    // ...
  })
  .catch((err) => {
    return err
  });
  return isUserCreated
}

export const createUserGoogle = async (userId, data) => {
    // Signed in 
  //   const user = setDoc(doc(db, 'users', user.uid), 
  //   {
  //     displayName: data.displayName, 
  //     email: data.email, 
  //     isTeacher: data.isTeacher,
  //     phone: data.phone,
  //     ownerId: user.uid
  //   }
  // );
  const user = await setDoc(doc(db, 'users', userId), data);
   
  return user
}

/**
 * 
 * @param {string} collectionName 
 * @param {object} data
 */
// Create a document
export const createDoc = async (collectionName, data) => {

  const docInstance = await addDoc(collection(db,collectionName),data)
  return docInstance
}

/**
 * 
 * @param {string} collectionName
 * @param {string} id 
 * @param {object} data
 */
// Create a document
export const createClassDoc = async (collectionName, id, data) => {

  // const docInstance =  doc(collection(db,collectionName, id),data)
  const docInstance = await setDoc(doc(db, collectionName, id), data);

  return docInstance
}

/**
 * 
 * @param {string} classCode
 * @param {string} studentId
 * @param {string} labId
 */
// save laboratory
export const getLabStudent = async (classCode, studentId, labId) => {
  const docRef = doc(db, "createclass", classCode, "students", studentId, "laboratory", labId);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}

/**
 * 
 * @param {object} data
 */
// save laboratory
export const saveLabStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'laboratory', data.labId)
  await setDoc(colRef,data);
  return colRef
}

// save assignment
export const saveAssignmentStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'assignment', data.assignmentId)
  await setDoc(colRef,data);
  return colRef
}

/**
 * 
 * @param {object} data
 */
// save laboratory
export const updateLabScore = async (data, index) => {
  const colRef = doc(db, "studentRecord", data.studentId);
  const docSnap = await getDoc(colRef);
  // const labData = [...docSnap.data().laboratory]
  // labData[data.labId].score = data.score
  // const labData = docSnap.data().laboratory[data.labId]
  console.log(index)
  let labData = {}
  labData[`laboratory.${index}`] = {
    labId: data.labId,
    title: data.title,
    classCode: data.classCode,
    // submitDate: data.submitDate,
    score: data.score,
    studentId: data.studentId
  }
  // console.log(docSnap.data().laboratory[data.labId].score)
  await updateDoc(colRef, labData);
  const colRef2 = doc(db, "createclass", data.classCode, "students", data.studentId, 'laboratory', data.labId)
  await setDoc(colRef2,{score: data.score}, { merge: true });
  
  // await updateDoc(colRef, {
  //   laboratory: labData
  // });

}

export const updateAssignScore = async (data, index) => {
  const colRef = doc(db, "studentRecord", data.studentId);
  const docSnap = await getDoc(colRef);
  // const labData = [...docSnap.data().laboratory]
  // labData[data.labId].score = data.score
  // const labData = docSnap.data().laboratory[data.labId]
  console.log(index)
  let labData = {}
  labData[`assignment.${index}`] = {
    assignmentId: data.assignmentId,
    title: data.title,
    classCode: data.classCode,
    dueDate: data.dueDate,
    studentId: data.studentId,
    score: data.score,
  }
  // console.log(docSnap.data().laboratory[data.labId].score)
  await updateDoc(colRef, labData);
  const colRef2 = doc(db, "createclass", data.classCode, "students", data.studentId, 'assignment', data.assignmentId)
  await setDoc(colRef2,{score: data.score}, { merge: true });
  
  // await updateDoc(colRef, {
  //   laboratory: labData
  // });

}

/**
 * 
 * @param {object} data
 */
// save quiz
export const saveLabRecord = async (data) => {
  const colRef = doc(db, "studentRecord", data.studentId)
  const docRef = doc(db, "studentRecord", data.studentId)
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let dataRecord = {}
    dataRecord[`laboratory.${data.labId}`] = {
      labId: data.labId,
      title: data.title,
      classCode: data.classCode,
      // submitDate: data.submitDate,
      score: data.score,
      studentId: data.studentId
    }
    updateDoc(colRef, dataRecord);;
  } else {
    setDoc(colRef, {laboratory:{}})
    let dataRecord = {}
    dataRecord[`laboratory.${data.labId}`] = {
      labId: data.labId,
      title: data.title,
      classCode: data.classCode,
      // submitDate: data.submitDate,
      score: data.score,
      studentId: data.studentId
    }
    updateDoc(colRef, dataRecord);
  }
  
  
}

/**
 * 
 * @param {object} data
 */
// save quiz
export const saveQuizStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'quiz', data.quizId)
  // await setDoc(colRef,data);
  console.log(data)
  const docInstance = await setDoc(colRef, data);


  return docInstance
}

// save quiz
export const saveAssignemntStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'assignment', data.assignmentId)
  // await setDoc(colRef,data);
  saveAssignmentRecord(data)
  const docInstance = await setDoc(colRef, data);


  return docInstance
}

export const saveExamStudent = async (data) => {
  const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'exam', data.examId)
  // await setDoc(colRef,data);
  console.log(data)
  const docInstance = await setDoc(colRef, data);


  return docInstance
}

/**
 * 
 * @param {object} data
 */
// save quiz
export const saveQuizRecord = async (data) => {
  const colRef = doc(db, "studentRecord", data.studentId)
  const docSnap = await getDoc(colRef);

  if (docSnap.exists()) {
    let dataRecord = {}
  dataRecord[`quiz.${data.quizId}`] = {
    quizId: data.quizId,
    title: data.title,
    result: data.result,
    classCode: data.classCode,
    dueDate: data.dueDate,
    subject: data.subject,
    studentId: data.studentId
  }
    updateDoc(colRef, dataRecord);;
  } else {
    setDoc(colRef, {laboratory:{}})
    let dataRecord = {}
  dataRecord[`quiz.${data.quizId}`] = {
    quizId: data.quizId,
    title: data.title,
    result: data.result,
    classCode: data.classCode,
    dueDate: data.dueDate,
    subject: data.subject,
    studentId: data.studentId
  }
    updateDoc(colRef, dataRecord);
  }
  
  // const dataRecord = {
  //   quizId: data.quizId,
  //   title: data.title,
  //   result: data.result,
  //   classCode: data.classCode,
  //   dueDate: data.dueDate,
  //   subject: data.subject,
  //   studentId: data.studentId
  // }
  // const docInstance = await setDoc(colRef, {
  //   quiz: arrayUnion(dataRecord)
  // },{ merge: true });
  const colRef2 = doc(db, "quiz", data.quizId)
  await setDoc(colRef2,{result: data.result}, { merge: true });
  // const docInstance = updateDoc(colRef, dataRecord);
  return colRef2
}

export const saveExamRecord = async (data) => {
  const colRef = doc(db, "studentRecord", data.studentId)
  const docSnap = await getDoc(colRef);

  if (docSnap.exists()) {
    let dataRecord = {}
  dataRecord[`exam.${data.examId}`] = {
    examId: data.examId,
    title: data.title,
    result: data.result,
    classCode: data.classCode,
    dueDate: data.dueDate,
    subject: data.subject,
    studentId: data.studentId
  }
    updateDoc(colRef, dataRecord);;
  } else {
    setDoc(colRef, {laboratory:{}})
    let dataRecord = {}
  dataRecord[`exam.${data.examId}`] = {
    examId: data.examId,
    title: data.title,
    result: data.result,
    classCode: data.classCode,
    dueDate: data.dueDate,
    subject: data.subject,
    studentId: data.studentId
  }
    updateDoc(colRef, dataRecord);
  }
  
  // const dataRecord = {
  //   quizId: data.quizId,
  //   title: data.title,
  //   result: data.result,
  //   classCode: data.classCode,
  //   dueDate: data.dueDate,
  //   subject: data.subject,
  //   studentId: data.studentId
  // }
  // const docInstance = await setDoc(colRef, {
  //   quiz: arrayUnion(dataRecord)
  // },{ merge: true });
  const colRef2 = doc(db, "exam", data.examId)
  await setDoc(colRef2,{result: data.result}, { merge: true });
  // const docInstance = updateDoc(colRef, dataRecord);
  return colRef2
}

export const saveAssignmentRecord = async (data) => {
  const colRef = doc(db, "studentRecord", data.studentId)
  const docSnap = await getDoc(colRef);

  if (docSnap.exists()) {
    let dataRecord = {}
  dataRecord[`assignment.${data.assignmentId}`] = {
    assignmentId: data.assignmentId,
    title: data.title,
    classCode: data.classCode,
    dueDate: data.dueDate,
    studentId: data.studentId
  }
    updateDoc(colRef, dataRecord);;
  } else {
    setDoc(colRef, {assignment:{}})
    let dataRecord = {}
    dataRecord[`assignment.${data.assignmentId}`] = {
      assignmentId: data.assignmentId,
      title: data.title,
      classCode: data.classCode,
      dueDate: data.dueDate,
      studentId: data.studentId
    }
    updateDoc(colRef, dataRecord);
  }
  
}

/**
 * 
 * @param {object} data
 */
// get student quiz details
export const getQuizStudent = async (data) => {
  // const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'quiz', data.quizId)
  // setDoc(colRef,data);

  // return colRef

  const docRef = doc(db, "createclass", data.classCode, "students", data.studentId, "quiz", data.quizId);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}

export const getExamStudent = async (data) => {
  // const colRef = doc(db, "createclass", data.classCode, "students", data.studentId, 'quiz', data.quizId)
  // setDoc(colRef,data);

  // return colRef

  const docRef = doc(db, "createclass", data.classCode, "students", data.studentId, "exam", data.examId);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}


/**
 * create doc
 * @param {string} collectionName 
 * @param {string} classCode
 * @param {object} studentData
 */
export const joinClass = async (collectionName, classCode, studentData) => {
  // const addData = doc(db, collectionName, id);

// Update field
  // await updateDoc(addData,data);
  // const studentObj = {...studentData, isJoin: false}
  let studentObj = {}
  studentData.map(student => {
    studentObj = {...student , isJoin:false}
  })
  // await updateDoc(addData, {
  //   students: arrayUnion(studentObj)
  // });

  // const docInstance = await setDoc(doc(db, collectionName, id), studentObj);
  const docInstance = await updateDoc(doc(db, collectionName, classCode), {
    students: arrayUnion(studentObj)
  });

  return docInstance
}

/**
 * create doc
 * @param {string} collectionName 
 * @param {string} classCode
 * @param {object} classData
 * @param {object} studentData
 */
export const acceptStudent = async (collectionName, classCode, classData, studentData) => {
  const addData = doc(db, collectionName, classCode);

// Update field
  // await updateDoc(addData,data);
  const studentObj = {...studentData, isJoin: true}

  await updateDoc(addData, {
    students: arrayRemove(studentData)
  });
  await updateDoc(addData, {
    students: arrayUnion(studentObj)
  });
  const studentRecord = doc(db, 'studentRecord', studentData.ownerId)
  const classroomRecord = collection(studentRecord, 'classroom')
  // await addDoc(collection(db,'studentRecord', studentData.ownerId),collection(db, 'classroom', classCode),classData)
  // await setDoc(classroomRecord,classData)
  const docRef = doc(db, "studentRecord", studentData.ownerId);
  // const colRef = collection(docRef, "classroom", classCode)
  const colRef = doc(db, "studentRecord", studentData.ownerId, "classroom", classCode)
  setDoc(colRef, classData);
  return addData
}

/**
 * create doc
 * @param {string} collectionName 
 * @param {string} id
 * @param {object} data
 * @param {object} studentData
 */
export const removeStudent = async (collectionName, id, data, studentData) => {
  const removeData = doc(db, collectionName, id);
// Update field
  // await updateDoc(addData,data);
  const studentObj = {...studentData, isJoin: false}

  await updateDoc(removeData, {
    students: arrayRemove(studentData)
  });
  await updateDoc(removeData, {
    students: arrayUnion(studentObj)
  });

  await deleteDoc(doc(db, "studentRecord", studentData.ownerId, 'classroom', id));

  return removeData
}

/**
 * 
 * @param {string} collectionName 
 */
export const getDocsByCollection = async (collectionName) => {
  const data = collection(db, collectionName)
  const querySnapshot = await getDocs(data);
    return querySnapshot.docs.map((doc) => doc.data())

}

/**
 * 
 * @param {string} collectionName 
 * @param {string} classCode
 */
export const getStudentByAssigned = async (classCode) => {
  const docRef = doc(db, "createclass", classCode);
  const docSnap = await getDoc(docRef);
  return docSnap.data()
}

/**
 * 
 * @param {string} collectionName 
 * @param {object} data
 */
export const updateDocsByCollection = async (collectionName, data) => {
  const getData = collection(db, collectionName)
  const querySnapshot = await getDocs(getData);
  let docId = ''
  // console.log(data.labId)
  // console.log(collectionName)
  // querySnapshot.docs.filter(item => item.ownerId === data.ownerId).map((doc) => docId = doc.id)
  docId = querySnapshot.docs.filter(item => item.data().ownerId === data.ownerId).map((doc) => {
    // console.log(doc.id)
    // let docId = ''
    return doc.id
  })
  // console.log(docId)
  const docInstance = doc(db, collectionName, data.labId)
  await updateDoc(docInstance, data);
  return docInstance

}

export const updateAssignment = async (collectionName, data) => {
  const getData = collection(db, collectionName)
  const querySnapshot = await getDocs(getData);
  let docId = ''
  // console.log(data.labId)
  // console.log(collectionName)
  // querySnapshot.docs.filter(item => item.ownerId === data.ownerId).map((doc) => docId = doc.id)
  docId = querySnapshot.docs.filter(item => item.data().ownerId === data.ownerId).map((doc) => {
    // console.log(doc.id)
    // let docId = ''
    return doc.id
  })
  // console.log(docId)
  const docInstance = doc(db, collectionName, data.assignmentId)
  await updateDoc(docInstance, data);
  return docInstance

}

/**
 * 
 * @param {string} collectionName 
 * @param {string} sort
 */
export const getAnnouncement = async (collectionName, sort) => {
  const data = collection(db, collectionName)
  const q = query(data,orderBy(sort, 'desc'))
  const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data())

}

export const getAnnouncementId = async (collectionName, sort) => {
  const data = collection(db, collectionName)
  const q = query(data,orderBy(sort, 'desc'))
  const querySnapshot = await getDocs(q);
    return querySnapshot

}

/**
 * @param {*} folderName 
 * @param {*} fileName 
 * @param {*} file 
 */
// export const createFile = async (folderName, fileName, file) => {
//   const isCreated = bucketRef.child(`${folderName}/${fileName}`).putString(file, 'data_url').then((snapshot) => {
//     return bucketRef.child(snapshot.ref.location.path_).getDownloadURL()
//   }).catch(err => {
//     return err
//   });

//   return isCreated
// }

/**
 * 
 */
export const getUser = async () => {
const user = await auth.currentUser;

if (user) {
  console.log(user)
  const data = collection(db, 'users')
  const q = query(data,where("ownerId", "==", user.uid))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data())
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // ...
} else {
  // No user is signed in.
}
  // const userDetails = await onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     console.log(user)
  //     return user.uid;
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });
  return user
       
}

export const getUserLogin = async (email) => {
    const data = collection(db, 'users')
    const q = query(data,where("email", "==", email))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data())
   
         
  }

export const deleteClass = async (id) => {
  const docRef = doc(db, "createclass", id);

  await updateDoc(docRef, {
    isDeleted: true
  });
}

export const archiveClass = async (id) => {
  const docRef = doc(db, "createclass", id);

  await updateDoc(docRef, {
    isArchived: true
  });
}

export const unenrollStudent = async (studentId, id, ownerId, studentData) => {
  const docRef = doc(db, "studentRecord", studentId, "classroom", id);
  removeStudent('createclass', id, ownerId, studentData)
  // console.log(studentData)
  await updateDoc(docRef, {
    isDeleted: true
  });
}

export const saveMeeting = async (classCode, link) => {
  const docRef = doc(db, 'meeting', classCode);
  setDoc(docRef, { meetingLink: link }, { merge: true });
  return docRef
}

export const deleteAnnouncement = async (id) => {
  await deleteDoc(doc(db, "announcement", id));
}

export const uploadImage = async (file) => {
  const metadata = {
    contentType: 'image/jpeg'
  };
  const profileImgsRef = ref(storage, 'profileImg/' + file.name);
  const uploadTask = uploadBytesResumable(profileImgsRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      let url =''
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        return downloadURL
      });
    }
    );
    return uploadTask
}

export const uploadFile = async (file, classCode, id, ownerId, studentId, category) => {
  for (var i = 0; i < file.length; i++) {
    const imageFile = file[i];
    const returnData = uploadImageAsPromise(imageFile)
    console.log('test',returnData.then(item => {
      return item
    }))
  }

  function uploadImageAsPromise (imageFile) {
    return new Promise(function (resolve, reject) {
      const metadata = {
        contentType: 'application/*,'
      };
        const profileImgsRef = ref(storage, 'files/' + `${classCode}/` + `${id}/` + imageFile.name);
        //Upload file
        const uploadTask = uploadBytesResumable(profileImgsRef, imageFile, metadata);

       // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            let url =''
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              const colFileRef = doc(collection(db, 'files'))
              const dataFile = {
                category: category,
                classCode: classCode,
                createdDate: Timestamp.now(),
                name: imageFile.name,
                studentId: studentId,
                ownerId: ownerId,
                id: id,
                url: downloadURL
              }
              setDoc(colFileRef, dataFile)
            });
          }
          );
          resolve(uploadTask);
    });
    
  }
}