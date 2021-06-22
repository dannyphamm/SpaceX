import axios from 'axios'
import firebase from 'firebase/app';
import 'firebase/firestore'
import moment from 'moment';
import {
  FETCH_PAYLOADS_REQUEST,
  FETCH_PAYLOADS_SUCCESS,
  FETCH_PAYLOADS_FAILURE
} from './payloadTypes'

export const fetchPayloads = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchPayloadsRequest())

    var docRef = database.collection("apidata").doc("payloads");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/payloads')
            .then(response => {
              const payloads = response.data
              payloads['last_updated'] = moment().toString();
              database.collection("apidata").doc("payloads").set(Object.assign({}, payloads));
              dispatch(fetchPayloadsSuccess(payloads,  payloads['last_updated']))
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
          dispatch(fetchPayloadsSuccess(data1, data!['last_updated']))
        }
      }
    }).catch((error) => {
      dispatch(fetchPayloadsFailure(error.message))
    });
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