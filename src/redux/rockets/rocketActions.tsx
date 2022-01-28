import axios from 'axios'
import { getApp } from 'firebase/app';
import { deleteUser, getAuth, signInAnonymously, User } from 'firebase/auth';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_ROCKETS_REQUEST,
  FETCH_ROCKETS_SUCCESS,
  FETCH_ROCKETS_FAILURE
} from './rocketTypes'

export const fetchRockets = () => {
  const database = getFirestore();
  const auth = getAuth(getApp())

  return async (dispatch) => {
    dispatch(fetchRocketsRequest())


    const docRef = doc(database, "apidata", "rockets");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://api.spacexdata.com/v4/rockets')
          .then(async response => {
            signInAnonymously(auth).then(async () => {
              const rockets = response.data
              rockets['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, rockets), { merge: true });
              const user = auth.currentUser as User
              deleteUser(user);
              dispatch(fetchRocketsSuccess(rockets, rockets['last_updated']))

            })
              .catch((error) => {
                dispatch(fetchRocketsFailure(error.code+" "+ error.message))
              })
          })
          .catch(error => {
            dispatch(fetchRocketsFailure(error.message))
          })
      } else {
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        const lastUpdated = data['last_updated']
        dispatch(fetchRocketsSuccess(data1, lastUpdated))
      }
    }


  }
}

export const fetchRocketsRequest = () => {
  return {
    type: FETCH_ROCKETS_REQUEST
  }
}

export const fetchRocketsSuccess = (rockets, lastUpdate) => {
  return {
    type: FETCH_ROCKETS_SUCCESS,
    payload: rockets,
    lastUpdated: lastUpdate
  }
}

export const fetchRocketsFailure = error => {
  return {
    type: FETCH_ROCKETS_FAILURE,
    payload: error
  }
}