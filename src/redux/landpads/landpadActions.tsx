import axios from 'axios'
import { getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_LANDPADS_REQUEST,
  FETCH_LANDPADS_SUCCESS,
  FETCH_LANDPADS_FAILURE
} from './landpadTypes'

export const fetchLandpads = () => {
  const database = getFirestore();
  const auth = getAuth(getApp())

    return async (dispatch) => {
      dispatch(fetchLandpadsRequest())
      signInAnonymously(auth).then(async () => {
     

      const docRef = doc(database, "apidata", "landpads");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data()
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/landpads')
            .then(async response => {
              const landpads = response.data
              landpads['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, landpads), { merge: true });
              dispatch(fetchLandpadsSuccess(landpads, landpads['last_updated']))
            })
            .catch(error => {
              dispatch(fetchLandpadsFailure(error.message))
            })
        } else {
          let data1 = [] as any;
          for (let i in data) {
            if (i !== "last_updated") {
              data1[i] = { ...data1[i], ...data[i] }
            }
          }
          dispatch(fetchLandpadsSuccess(data1, data!['last_updated']))
        }
      }
    
  })
    .catch((error) => {
      console.log(error.code, error.message)
    })}
}

export const fetchLandpadsRequest = () => {
  return {
    type: FETCH_LANDPADS_REQUEST
  }
}

export const fetchLandpadsSuccess = (landpads, lastUpdate) => {
  return {
    type: FETCH_LANDPADS_SUCCESS,
    payload: landpads,
    lastUpdated: lastUpdate
  }
}

export const fetchLandpadsFailure = error => {
  return {
    type: FETCH_LANDPADS_FAILURE,
    payload: error
  }
}