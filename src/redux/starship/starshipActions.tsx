import axios from 'axios'
import firebase from 'firebase';
import moment from 'moment';
import {
  FETCH_STARSHIP_REQUEST,
  FETCH_STARSHIP_SUCCESS,
  FETCH_STARSHIP_FAILURE
} from './starshipTypes'

export const fetchStarship = () => {
  const database = firebase.firestore();

  return (dispatch) => {
    dispatch(fetchStarshipRequest())

    var docRef = database.collection("apidata").doc("starship");
    docRef.get().then((doc) => {
      var data = doc.data()
      if (doc.exists) {
        const diff = moment().diff(moment(data!['last_updated']), "seconds");
        // 5 minutes, Get new data if existing data is old
        if (diff > 1000) {
          console.log("FETCHING NEW STARSHIP DATA")
          axios
            .get('https://ll.thespacedevs.com/2.2.0/dashboard/starship/')
            .then(response => {
              const starship = response.data
              starship['last_updated'] = moment().toString();
              database.collection("apidata").doc("starship").set(Object.assign({}, starship));
            })
            .catch(error => {
              //dispatch(fetchStarshipFailure(error.message))
            })
        }
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }
        dispatch(fetchStarshipSuccess(data1['upcoming']['launches'], data1['previous']['launches'], data!['last_updated']))
      } 
    }).catch((error) => {
      dispatch(fetchStarshipFailure(error.message))
    });


  }
}

export const fetchStarshipRequest = () => {
  return {
    type: FETCH_STARSHIP_REQUEST
  }
}

export const fetchStarshipSuccess = (upcoming, previous, lastUpdate) => {
  return {
    type: FETCH_STARSHIP_SUCCESS,
    upcoming: upcoming,
    previous: previous,
    lastUpdated: lastUpdate
  }
}

export const fetchStarshipFailure = error => {
  return {
    type: FETCH_STARSHIP_FAILURE,
    payload: error
  }
}