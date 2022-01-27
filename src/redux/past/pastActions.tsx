import axios from 'axios'
import { getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';

import moment from 'moment';
import {
  FETCH_PAST_REQUEST,
  FETCH_PAST_SUCCESS,
  FETCH_PAST_FAILURE
} from './pastTypes'


export const fetchPast = () => {
  const database = getFirestore();
  const auth = getAuth(getApp())

  return async (dispatch) => {
    dispatch(fetchPastRequest())
    signInAnonymously(auth).then(async () => {
    
      const docRef = doc(database, "apidata", "past");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/launches/past')
            .then(async response => {
              const past = response.data
              past['last_updated'] = moment().toString();
              const time = moment().toString();
              await setDoc(docRef, Object.assign({}, past), { merge: true });
              delete past['last_updated']
              dispatch(fetchPastSuccess(past, time))
            })
            .catch(error => {
              dispatch(fetchPastFailure(error.message))
            })
        } else {
          const pastData = data;
          delete pastData!["last_updated"]
          dispatch(fetchPastSuccess(pastData, data!['last_updated']))
        }
      }

    })
      .catch((error) => {
        console.log(error.code, error.message)
      })
  }
}

export const fetchPastRequest = () => {
  return {
    type: FETCH_PAST_REQUEST
  }
}

export const fetchPastSuccess = (past, lastUpdate) => {
  return {
    type: FETCH_PAST_SUCCESS,
    payload: past,
    lastUpdated: lastUpdate
  }
}

export const fetchPastFailure = error => {
  return {
    type: FETCH_PAST_FAILURE,
    payload: error
  }
}