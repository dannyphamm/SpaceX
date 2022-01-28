import axios from 'axios'
import { getApp } from 'firebase/app';
import { deleteUser, getAuth, signInAnonymously, User } from 'firebase/auth';
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


    const docRef = doc(database, "apidata", "landpads");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://api.spacexdata.com/v4/landpads')
          .then(async response => {
            signInAnonymously(auth).then(async () => {

              const landpads = response.data
              landpads['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, landpads), { merge: true });
            
              const user = auth.currentUser as User
              deleteUser(user);
              dispatch(fetchLandpadsSuccess(landpads, landpads['last_updated']))
            })
              .catch((error) => {
                dispatch(fetchLandpadsFailure(error.code +" " + error.message))
              })
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
        const lastUpdated = data['last_updated']
        dispatch(fetchLandpadsSuccess(data1, lastUpdated))
      }
    }

  }
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