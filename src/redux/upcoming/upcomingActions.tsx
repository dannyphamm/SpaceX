import axios from 'axios'
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';

import {
  FETCH_UPCOMING_REQUEST,
  FETCH_UPCOMING_SUCCESS,
  FETCH_UPCOMING_FAILURE
} from './upcomingTypes'

export const fetchUpcoming = () => {
  const database = getFirestore();
  return async (dispatch) => {
    dispatch(fetchUpcomingRequest())


    const docRef = doc(database, "apidata", "upcoming");
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 300) {
        axios
          .get('https://api.spacexdata.com/v4/launches/upcoming')
          .then(async response => {
            const upcoming = response.data
            upcoming['last_updated'] = moment().toString();
            const time = moment().toString();
            await setDoc(docRef, Object.assign({}, upcoming))
            delete upcoming['last_updated']

            dispatch(fetchUpcomingSuccess(upcoming, time));
          })
          .catch(error => {
            dispatch(fetchUpcomingFailure(error.message))
          })
      } else {

        const upcomingData = data;
        const lastUpdated = data['last_updated']
        delete upcomingData!["last_updated"]
        dispatch(fetchUpcomingSuccess(upcomingData, lastUpdated))
      }
    }


  }
}

export const fetchUpcomingRequest = () => {
  return {
    type: FETCH_UPCOMING_REQUEST
  }
}

export const fetchUpcomingSuccess = (upcoming, lastUpdate) => {
  return {
    type: FETCH_UPCOMING_SUCCESS,
    payload: upcoming,
    lastUpdated: lastUpdate
  }
}

export const fetchUpcomingFailure = error => {
  return {
    type: FETCH_UPCOMING_FAILURE,
    payload: error
  }
}