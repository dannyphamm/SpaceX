import axios from 'axios'
import { getApp } from 'firebase/app';
import { deleteUser, getAuth, signInAnonymously, User } from 'firebase/auth';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_LAUNCHPADS_REQUEST,
  FETCH_LAUNCHPADS_SUCCESS,
  FETCH_LAUNCHPADS_FAILURE
} from './launchpadTypes'

export const fetchLaunchpads = () => {
  const database = getFirestore();
  const auth = getAuth(getApp())

  return async (dispatch) => {

    dispatch(fetchLaunchpadsRequest())


    const docRef = doc(database, "apidata", "launchpads");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://api.spacexdata.com/v4/launchpads')
          .then(async response => {
            signInAnonymously(auth).then(async () => {
              const launchpads = response.data
              launchpads['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, launchpads), { merge: true });
              const user = auth.currentUser as User
              deleteUser(user);
              dispatch(fetchLaunchpadsSuccess(launchpads, launchpads['last_updated']))

            })
              .catch((error) => {
                dispatch(fetchLaunchpadsFailure(error.code+" "+ error.message))
              })
          })
          .catch(error => {
            dispatch(fetchLaunchpadsFailure(error.message))
          })
      } else {
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        const lastUpdated = data['last_updated']
        dispatch(fetchLaunchpadsSuccess(data1, lastUpdated))
      }
    }


  }
}

export const fetchLaunchpadsRequest = () => {
  return {
    type: FETCH_LAUNCHPADS_REQUEST
  }
}

export const fetchLaunchpadsSuccess = (launchpads, lastUpdate) => {
  return {
    type: FETCH_LAUNCHPADS_SUCCESS,
    payload: launchpads,
    lastUpdated: lastUpdate
  }
}

export const fetchLaunchpadsFailure = error => {
  return {
    type: FETCH_LAUNCHPADS_FAILURE,
    payload: error
  }
}