import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_UPCOMING_REQUEST,
  FETCH_UPCOMING_SUCCESS,
  FETCH_UPCOMING_FAILURE
} from './upcomingTypes'

export const fetchUpcoming = () => {
  const database = firebase.firestore();

  return (dispatch) => {
    dispatch(fetchUpcomingRequest())

    var docRef = database.collection("apidata").doc("upcoming");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 300) {
          axios
            .get('https://api.spacexdata.com/v4/launches/upcoming')
            .then(response => {
              const upcoming = response.data
              upcoming['last_updated'] = moment().toString();
              database.collection("apidata").doc("upcoming").set(Object.assign({}, upcoming));
            })
            .catch(error => {
              dispatch(fetchUpcomingFailure(error.message))
            })
        }
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        dispatch(fetchUpcomingSuccess(data1, data!['last_updated']))
      }
    }).catch((error) => {
      dispatch(fetchUpcomingFailure(error.message))
    });


  }
}

export const fetchUpcomingRequest = () => {
  return {
    type: FETCH_UPCOMING_REQUEST
  }
}

export const fetchUpcomingSuccess = (upcoming, lastUpdate) => {
  return {
    type: FETCH_UPCOMING_SUCCESS,
    payload: upcoming,
    lastUpdated: lastUpdate
  }
}

export const fetchUpcomingFailure = error => {
  return {
    type: FETCH_UPCOMING_FAILURE,
    payload: error
  }
}