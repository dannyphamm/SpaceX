const cores = (state = [] as Array<any>, action) => {
  switch (action.type) {
    case 'ADDCORES':
      return (
        fetch("https://api.spacexdata.com/v4/cores")
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

export default cores
