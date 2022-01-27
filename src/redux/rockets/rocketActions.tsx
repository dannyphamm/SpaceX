import axios from 'axios'
import {getFirestore, getDoc, doc, setDoc} from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_ROCKETS_REQUEST,
  FETCH_ROCKETS_SUCCESS,
  FETCH_ROCKETS_FAILURE
} from './rocketTypes'

export const fetchRockets = () => {
  const database = getFirestore();
  return async (dispatch) => {
    dispatch(fetchRocketsRequest())
    const docRef = doc(database, "apidata", "rockets");
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      const data = docSnap.data()
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/rockets')
            .then(async response => {
              const rockets = response.data
              rockets['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, rockets), { merge: true });
              dispatch(fetchRocketsSuccess(rockets, rockets['last_updated']))
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
          dispatch(fetchRocketsSuccess(data1, data!['last_updated']))
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