import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { fetchUpcoming, fetchLaunchpads } from './redux'

function Test({ upcomingData, launchpadsData, fetchUpcoming, fetchLaunchpads }) {
    useEffect(() => {
        fetchUpcoming();
        fetchLaunchpads();
        console.log(upcomingData)
    }, [])

    if (upcomingData.loading && launchpadsData.loading) {
        return (
            <></>
        )
    } else {
        return (
            <></>
        )
    }
}

const mapStateToProps = state => {
    return {
        upcomingData: state.upcoming,
        launchpadsData: state.launchpads
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUpcoming: () => dispatch(fetchUpcoming()),
        fetchLaunchpads: () => dispatch(fetchLaunchpads())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Test)