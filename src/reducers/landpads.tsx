const landpads = (state = [] as Array<any>, action) => {
    switch (action.type) {
      case 'ADDLANDPADS':
        return (
            fetch("https://api.spacexdata.com/v4/landpads")
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
  
  export default landpads
  