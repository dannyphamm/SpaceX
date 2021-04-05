import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_CORES_REQUEST,
  FETCH_CORES_SUCCESS,
  FETCH_CORES_FAILURE
} from './coreTypes'

export const fetchCores = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchCoresRequest())

    var docRef = database.collection("apidata").doc("cores");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/cores')
            .then(response => {
              const cores = response.data
              cores['last_updated'] = moment().toString();
              database.collection("apidata").doc("cores").set(Object.assign({}, cores));
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
          dispatch(fetchCoresSuccess(data1, data!['last_updated']))
        }
      }
    }).catch((error) => {
      dispatch(fetchCoresFailure(error.message))
    });

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