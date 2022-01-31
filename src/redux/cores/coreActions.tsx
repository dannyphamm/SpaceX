import axios from 'axios'
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';

import moment from 'moment';
import {
  FETCH_CORES_REQUEST,
  FETCH_CORES_SUCCESS,
  FETCH_CORES_FAILURE
} from './coreTypes'

export const fetchCores = () => {
  const database = getFirestore();

  return async (dispatch) => {
    dispatch(fetchCoresRequest())
    


    const docRef = doc(database, "apidata", "cores");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://api.spacexdata.com/v4/cores')
          .then(async response => {
            const cores = response.data
            cores['last_updated'] = moment().toString();
            await setDoc(docRef, Object.assign({}, cores), { merge: true });
            dispatch(fetchCoresSuccess(cores, cores['last_updated']))
          })
          .catch(error => {
            dispatch(fetchCoresFailure(error.message))
          })
      } else {
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        const lastUpdated = data['last_updated']
        dispatch(fetchCoresSuccess(data1, lastUpdated))
      }
    }
  }
}

export const fetchCoresRequest = () => {
  return {
    type: FETCH_CORES_REQUEST
  }
}

export const fetchCoresSuccess = (cores, lastUpdate) => {
  return {
    type: FETCH_CORES_SUCCESS,
    payload: cores,
    lastUpdated: lastUpdate
  }
}

export const fetchCoresFailure = error => {
  return {
    type: FETCH_CORES_FAILURE,
    payload: error
  }
}