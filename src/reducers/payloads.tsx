const payloads = (state = [] as Array<any>, action) => {
  switch (action.type) {
    case 'ADDPAYLOADS':
      return (
        fetch("https://api.spacexdata.com/v4/payloads")
          .then(res => res.json())
          .then(
            (result) => {
              state = result
              return state
            },
            (error) => {

            }
          )
      )
    default:
      return state
  }
}

export default payloads
