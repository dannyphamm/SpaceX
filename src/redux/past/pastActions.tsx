import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_PAST_REQUEST,
  FETCH_PAST_SUCCESS,
  FETCH_PAST_FAILURE
} from './pastTypes'


export const fetchPast = () => {
  const database = firebase.firestore();
  return (dispatch) => {
    dispatch(fetchPastRequest())
    var docRef = database.collection("apidata").doc("past");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/launches/past')
            .then(response => {
              const past = response.data
              past['last_updated'] = moment().toString();
              const time = moment().toString();
              database.collection("apidata").doc("past").set(Object.assign({}, past));
              delete past['last_updated']
              dispatch(fetchPastSuccess(past, time))
            })
            .catch(error => {
              dispatch(fetchPastFailure(error.message))
            })
        } else {
          const pastData = data;
          delete pastData!["last_updated"]
          dispatch(fetchPastSuccess(pastData, data!['last_updated']))
        }
      }
    }).catch((error) => {
      dispatch(fetchPastFailure(error.message))
    });
  }
}

export const fetchPastRequest = () => {
  return {
    type: FETCH_PAST_REQUEST
  }
}

export const fetchPastSuccess = (past, lastUpdate) => {
  return {
    type: FETCH_PAST_SUCCESS,
    payload: past,
    lastUpdated: lastUpdate
  }
}

export const fetchPastFailure = error => {
  return {
    type: FETCH_PAST_FAILURE,
    payload: error
  }
}