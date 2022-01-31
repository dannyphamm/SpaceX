import axios from 'axios'

import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  FETCH_STARSHIP_REQUEST,
  FETCH_STARSHIP_SUCCESS,
  FETCH_STARSHIP_FAILURE
} from './starshipTypes'

export const fetchStarship = () => {
  const database = getFirestore();

  return async (dispatch) => {
    dispatch(fetchStarshipRequest())




    const docRef = doc(database, "apidata", "starship");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()

      const diff = moment().diff(moment(data!['last_updated']), "seconds");
      // 5 minutes, Get new data if existing data is old
      if (diff > 14400) {
        axios
          .get('https://ll.thespacedevs.com/2.2.0/dashboard/starship/')
          .then(async response => {
              const starship = response.data
              starship['last_updated'] = moment().toString();
              await setDoc(docRef, Object.assign({}, starship), { merge: true });

              let data2 = [] as any;
              for (let i in starship!['upcoming']['launches']) {
                data2.push(starship!['upcoming']['launches'][i])
              }
              for (let i in starship!['previous']['launches']) {
                data2.push(starship!['previous']['launches'][i])
              }
              dispatch(fetchStarshipSuccess(data2, starship['upcoming']['launches'], starship['previous']['launches'], starship['last_updated']));

            })
          .catch(error => {
            dispatch(fetchStarshipFailure(error.message))
          })
      } else {
        let data1 = [] as any;
        for (let i in data) {
          if (i !== "last_updated") {
            data1[i] = { ...data1[i], ...data[i] }
          }
        }

        let data2 = [] as any;
        for (let i in data!['upcoming']['launches']) {
          data2.push(data!['upcoming']['launches'][i])
        }
        for (let i in data!['previous']['launches']) {
          data2.push(data!['previous']['launches'][i])
        }
        const lastUpdated = data['last_updated']
        dispatch(fetchStarshipSuccess(data2, data1['upcoming']['launches'], data1['previous']['launches'], lastUpdated))
      }
    }
  }
}

export const fetchStarshipRequest = () => {
  return {
    type: FETCH_STARSHIP_REQUEST
  }
}

export const fetchStarshipSuccess = (combined, upcoming, previous, lastUpdate) => {
  return {
    type: FETCH_STARSHIP_SUCCESS,
    combined: combined,
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