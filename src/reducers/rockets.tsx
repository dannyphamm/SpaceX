const rockets = (state = [] as Array<any>, action) => {
    switch (action.type) {
      case 'ADDROCKETS':
        return (
            fetch("https://api.spacexdata.com/v4/rockets")
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
  
  export default rockets
  