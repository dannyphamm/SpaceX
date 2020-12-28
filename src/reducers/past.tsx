const past = (state = [] as Array<any>, action) => {
    switch (action.type) {
      case 'ADDLAUNCHPADS':
        return (
            fetch("https://api.spacexdata.com/v4/launches/past")
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
  
  export default past
  