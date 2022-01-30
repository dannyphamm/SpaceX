import axios from 'axios'

import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_PAYLOADS_REQUEST,
  FETCH_PAYLOADS_SUCCESS,
  FETCH_PAYLOADS_FAILURE
} from './payloadTypes'

export const fetchPayloads = () => {
  const database = getFirestore();

  return async (dispatch) => {
    dispatch(fetchPayloadsRequest())
   



    const docRef = doc(database, "apidata", "payloads");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://api.spacexdata.com/v4/payloads')
          .then(async response => {
              const payloads = response.data
              payloads['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, payloads), { merge: true });
              dispatch(fetchPayloadsSuccess(payloads, payloads['last_updated']))
            })
          .catch(error => {
            dispatch(fetchPayloadsFailure(error.message))
          })
      } else {
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        const lastUpdated = data['last_updated']
        dispatch(fetchPayloadsSuccess(data1, lastUpdated))
      }
    }
  }
}

export const fetchPayloadsRequest = () => {
  return {
    type: FETCH_PAYLOADS_REQUEST
  }
}

export const fetchPayloadsSuccess = (payloads, lastUpdate) => {
  return {
    type: FETCH_PAYLOADS_SUCCESS,
    payloads: payloads,
    lastUpdated: lastUpdate
  }
}

export const fetchPayloadsFailure = error => {
  return {
    type: FETCH_PAYLOADS_FAILURE,
    payloads: error
  }
}