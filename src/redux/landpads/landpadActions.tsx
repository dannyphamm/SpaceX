import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_LANDPADS_REQUEST,
  FETCH_LANDPADS_SUCCESS,
  FETCH_LANDPADS_FAILURE
} from './landpadTypes'

export const fetchLandpads = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchLandpadsRequest())

    var docRef = database.collection("apidata").doc("landpads");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/landpads')
            .then(response => {
              const landpads = response.data
              landpads['last_updated'] = moment().toString();
              database.collection("apidata").doc("landpads").set(Object.assign({}, landpads));
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
    }).catch((error) => {
      dispatch(fetchLandpadsFailure(error.message))
    });
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