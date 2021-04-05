import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_ROCKETS_REQUEST,
  FETCH_ROCKETS_SUCCESS,
  FETCH_ROCKETS_FAILURE
} from './rocketTypes'

export const fetchRockets = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchRocketsRequest())

    var docRef = database.collection("apidata").doc("rockets");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/rockets')
            .then(response => {
              const rockets = response.data
              rockets['last_updated'] = moment().toString();
              database.collection("apidata").doc("rockets").set(Object.assign({}, rockets));
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
    }).catch((error) => {
      dispatch(fetchRocketsFailure(error.message))
    });
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