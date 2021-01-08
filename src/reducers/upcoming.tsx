const upcoming = (state = [] as Array<any>, action) => {
    switch (action.type) {
      case 'ADDUPCOMING':
        return (
            fetch("https://api.spacexdata.com/v4/launches/upcoming")
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
  
  export default upcoming
  