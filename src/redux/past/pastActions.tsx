import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_PAST_REQUEST,
  FETCH_PAST_SUCCESS,
  FETCH_PAST_FAILURE
} from './pastTypes'

function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
  return new Date(b.date_unix).getTime() - new Date(a.date_unix).getTime();
}

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
              const past = response.data.sort(comp)
              past['last_updated'] = moment().toString();
              database.collection("apidata").doc("past").set(Object.assign({}, past));
            })
            .catch(error => {
              dispatch(fetchPastFailure(error.message))
            })
        }
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        dispatch(fetchPastSuccess(data1, data!['last_updated']))
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