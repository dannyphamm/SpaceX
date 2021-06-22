import axios from 'axios'
import firebase from 'firebase/app';
import 'firebase/firestore'
import moment from 'moment';
import {
  FETCH_LAUNCHPADS_REQUEST,
  FETCH_LAUNCHPADS_SUCCESS,
  FETCH_LAUNCHPADS_FAILURE
} from './launchpadTypes'

export const fetchLaunchpads = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchLaunchpadsRequest())
    var docRef = database.collection("apidata").doc("launchpads");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/launchpads')
            .then(response => {
              const launchpads = response.data
              launchpads['last_updated'] = moment().toString();
              database.collection("apidata").doc("launchpads").set(Object.assign({}, launchpads));
              dispatch(fetchLaunchpadsSuccess(launchpads, launchpads['last_updated']))
            })
            .catch(error => {
              dispatch(fetchLaunchpadsFailure(error.message))
            })
        } else {
          let data1 = [] as any;
          for (let i in data) {
            if (i !== "last_updated") {
              data1[i] = { ...data1[i], ...data[i] }
            }
          }
          dispatch(fetchLaunchpadsSuccess(data1, data!['last_updated']))
        }
      }
    }).catch((error) => {
      dispatch(fetchLaunchpadsFailure(error.message))
    });
  }
}

export const fetchLaunchpadsRequest = () => {
  return {
    type: FETCH_LAUNCHPADS_REQUEST
  }
}

export const fetchLaunchpadsSuccess = (launchpads, lastUpdate) => {
  return {
    type: FETCH_LAUNCHPADS_SUCCESS,
    payload: launchpads,
    lastUpdated: lastUpdate
  }
}

export const fetchLaunchpadsFailure = error => {
  return {
    type: FETCH_LAUNCHPADS_FAILURE,
    payload: error
  }
}