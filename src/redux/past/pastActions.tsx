
import axios from 'axios'

import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';

import moment from 'moment';

import {
  FETCH_PAST_REQUEST,
  FETCH_PAST_SUCCESS,
  FETCH_PAST_FAILURE
} from './pastTypes'


export const fetchPast = () => {
  const database = getFirestore();

  return async (dispatch) => {
    dispatch(fetchPastRequest())
    


    const docRef = doc(database, "apidata", "past");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 1800 ) {
        axios
          .get('https://api.spacexdata.com/v4/launches/past')
          .then(async response => {
              const past = response.data
              past['last_updated'] = moment().toString();
              const time = moment().toString();
              await setDoc(docRef, Object.assign({}, past), { merge: true });
              dispatch(fetchPastSuccess(past, time))
            })
          .catch(error => {
            dispatch(fetchPastFailure(error.message))
          })
      } else {
        const pastData = data;
        const lastUpdated = data['last_updated']
        delete pastData!["last_updated"]
        dispatch(fetchPastSuccess(pastData, lastUpdated))
      }
    }


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