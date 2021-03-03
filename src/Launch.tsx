import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Descriptions, Badge, Col, Row, Image, Divider, Skeleton } from 'antd';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import PropTypes from 'prop-types'
import moment from 'moment';
import YouTube from 'react-youtube';
import Countdown from './Countdown';
import { Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';
import { connect } from 'react-redux'
import { fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores, fetchStarship } from './redux';


function Launch({ fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores, landpadsData, launchpadsData, payloadsData, rocketsData, coresData, fetchStarship, starshipData }) {
    let params = useParams();

    const { TabPane } = Tabs;
    const [item, setItem] = useState<any>([]);
    const [starship, setStarship] = useState<any>([]);
    const url = "https://api.spacexdata.com/v4/launches/" + params['id']

    //first render
    useEffect(() => {
        console.log("WORKING")
        if (params['id'].includes('-')) {
            fetchStarship();
        } else {
            fetch(url)
                .then(res => res.json())
                .then(
                    (result) => {
                        setItem(result)
                    },
                )
            fetchCores();
            fetchLandpads();
            fetchLaunchpads();
            fetchPayloads();
            fetchRockets();
        }
    }, [])
    // second render
    useEffect(() => {
        console.log("WORKING1")
        if (params['id'].includes('-')) {
            let data = [] as any;
            for (let i in starshipData.starship.upcoming) {
                data.push(starshipData.starship.upcoming[i])
            }
            for (let i in starshipData.starship.previous) {
                data.push(starshipData.starship.upcoming[i])
            }
            getStarship(data)
        }
    }, [starshipData.loading])

    function getStarship(data: any) {
        const starship = data.find(starship => starship['id'] === params['id']);
        console.log(starship)
        setStarship(starship)
    }
    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['full_name']);
    }

    function getLandpad(item1: any) {
        if (item1 === null) {
            return ["Unknown", "Unknown", "Unknown"]
        } else {
            const landpad = landpadsData.landpads.find(landpad => landpad['id'] === item1);
            return ([landpad['region'], landpad['full_name'], landpad['type']])
        }
    }
    function getCore(coreID: any) {
        if (coreID === null) {
            return ""
        } else {
            const core = coresData.cores.find(core => core['id'] === coreID);
            let block;
            if (core['block'] !== null) {
                block = "B" + core["block"];
                return (block + " " + core['serial']);
            } else {
                return (core['serial']);
            }

        }

    }
    function getRocket(rocketID: any) {
        const rocket = rocketsData.rockets.find(rocket => rocket['id'] === rocketID);

        return (rocket['name']);
    }
    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }

    function getLocalTimeString(epoc: number) {
        const d = moment.unix(epoc).local().format("MMMM YYYY");
        return "NET " + d.toString();
    }

    function getPayload(data) {
        const payload = payloadsData.payloads.find(payload => payload['id'] === data);
        let customers = "";
        let nationalities = "";
        let manufacturers = "";
        for (let i in payload['customers']) {
            customers += (payload["customers"][i] + "\n ")
        }
        for (let i in payload['nationalities']) {
            nationalities += (payload["nationalities"][i] + "\n ")
        }
        for (let i in payload['manufacturers']) {
            manufacturers += (payload["manufacturers"][i] + "\n ")
        }
        if (manufacturers === "") {
            manufacturers = "Unknown"
        }
        if (nationalities === "") {
            nationalities = "Unknown"
        }
        if (customers === "") {
            customers = "Unknown"
        }
        return ([payload['name'], payload['type'], payload['orbit'], manufacturers, nationalities, customers])
    }

    if (!item || !starship) {
        return (<Skeleton />)
    } else {
        return(<><h1>DATA RECEIVED {starship.id}</h1>
        <h1>DATA RECEIVED {console.log(starship.status.abbrev)}</h1></>)
    }
}

const mapStateToProps = state => {
    return {
        launchpadsData: state.launchpads,
        rocketsData: state.rockets,
        coresData: state.cores,
        payloadsData: state.payloads,
        landpadsData: state.landpads,
        starshipData: state.starship
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchLaunchpads: () => dispatch(fetchLaunchpads()),
        fetchRockets: () => dispatch(fetchRockets()),
        fetchCores: () => dispatch(fetchCores()),
        fetchPayloads: () => dispatch(fetchPayloads()),
        fetchLandpads: () => dispatch(fetchLandpads()),
        fetchStarship: () => dispatch(fetchStarship())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Launch)