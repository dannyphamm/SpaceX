import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Descriptions, Badge, Col, Row, Image, Divider, Skeleton } from 'antd';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import moment from 'moment';
import YouTube from 'react-youtube';
import Countdown from './Countdown';
import { Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';
import { connect } from 'react-redux'
import { fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores, fetchStarship, fetchUpcoming, fetchPast } from './redux';


function Launch({ pastData, fetchPast, upcomingData, fetchUpcoming, fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores, landpadsData, launchpadsData, payloadsData, rocketsData, coresData, fetchStarship, starshipData }) {
    let params = useParams();

    const { TabPane } = Tabs;
    const [item, setItem] = useState<any>([]);
    const [starship, setStarship] = useState<any>({});
    const getLaunchpad = useCallback(
        (launchpadID: any) => {
            const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID);
            return (launchpad['full_name']);
        },
        [launchpadsData.launchpads],
    )

    const getLandpad = useCallback(
        (item1: any) => {
            if (item1 === null) {
                return ["Unknown", "Unknown", "Unknown"]
            } else {
                const landpad = landpadsData.landpads.find(landpad => landpad['id'] === item1);
                return ([landpad['region'], landpad['full_name'], landpad['type']])
            }
        },
        [landpadsData.landpads],
    )
    
    const getRocket = useCallback(
        (rocketID: any) => {
            const rocket = rocketsData.rockets.find(rocket => rocket['id'] === rocketID);
            return (rocket['name']);
        },
        [rocketsData.rockets],
    )

    const getCore = useCallback(
        (coreID: any) => {
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
        },
        [coresData.cores],
    )

    const getPayload = useCallback(
        (data: any) => {
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
        },
        [payloadsData.payloads],
    )

    const loadLaunch = useCallback(
        () => {
            if (!item) {
                return (<Skeleton />)
            }
            if (item.length === 0 || landpadsData.loading || launchpadsData.loading || coresData.loading || rocketsData.loading || payloadsData.loading) {
                return (<Skeleton />)
            } else {
                return (
                    <Row>
                        <Col style={{ width: "100%" }}>
                            <Title level={3}>{item['name']}</Title>
                            <Tabs defaultActiveKey="1" key="1">
                                <TabPane tab="Mission Information" >
                                    <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                                        <Descriptions.Item label="Mission Status" span={3}>
                                            {item['upcoming'] ? <Badge status="default" text="Upcoming" /> : item['success'] === null ? <Badge status="default" text="Unknown" /> : item['success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Flight Number" span={1}>{"#" + item['flight_number']}</Descriptions.Item>
                                        <Descriptions.Item label="Name" span={1}>{item['name']}</Descriptions.Item>
                                        <Descriptions.Item label="Launchpad" span={1}>{getLaunchpad(item['launchpad'])}</Descriptions.Item>
                                        <Descriptions.Item label="Date" span={3}>{item['date_precision'] !== "hour" ? getLocalTimeString(item['date_unix']) : getLocalTime(item['date_unix'])}</Descriptions.Item>
                                        {item['date_precision'] === "hour" ? <Descriptions.Item label="Countdown" span={3}><Countdown time={item['date_unix']} /></Descriptions.Item> : null}
                                        <Descriptions.Item label="Details" span={3}>{item['details'] === null ? "No information Provided" : item['details']}</Descriptions.Item>
                                    </Descriptions>
                                    <Divider />
                                    {item['cores'].map((data, interval) => (
                                        <Descriptions title={"Core #" + (interval + 1) + " Information"} bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }} key={data['id']}>
                                            <Descriptions.Item label="Booster Landing Status" span={1}>
                                                {item['upcoming'] ? data['landing_attempt'] === null ? <Badge status="default" text="Unknown" /> :
                                                    data['landing_attempt'] ? <Badge status="default" text="Pending" /> : <Badge status="default" text="No Attempt Made" /> :
                                                    data['landing_attempt'] ?
                                                        data['landing_success'] === null ? <Badge status="default" text="Unknown" /> :
                                                            data['landing_success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />
                                                        : <Badge status="default" text="No Attempt Made" />}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Booster Type" span={1}>{getRocket(item['rocket']) + " " + getCore(data['core'])}</Descriptions.Item>
                                            <Descriptions.Item label="Booster Flight Number" span={1}>{data['flight'] === null ? "Unknown" : data['flight']}</Descriptions.Item>
                                            {data['landing_attempt'] ? <>
                                                <Descriptions.Item label="Landing Region" span={1}>{!item['upcoming'] ? getLandpad(data['landpad'])[0] : "Pending"}</Descriptions.Item>
                                                <Descriptions.Item label="Landing Location" span={1}>{!item['upcoming'] ? getLandpad(data['landpad'])[1] : "Pending"}</Descriptions.Item>
                                                <Descriptions.Item label="Landing Type" span={1}>{!item['upcoming'] ? getLandpad(data['landpad'])[2] : "Pending"}</Descriptions.Item></> : null}
                                        </Descriptions>
                                    ))}
                                    <Divider />
                                    {item['payloads'].map((data, interval) => (
                                        <Descriptions title={"Payload #" + (interval + 1) + " Information"} bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }} key={data['id']}>
                                            <Descriptions.Item label="Payload Name" span={1}>{getPayload(data)[0]}</Descriptions.Item>
                                            <Descriptions.Item label="Payload Type" span={1}>{getPayload(data)[1]}</Descriptions.Item>
                                            <Descriptions.Item label="Payload Orbit" span={1}>{getPayload(data)[2]}</Descriptions.Item>
                                            <Descriptions.Item label="Payload Manufacturers" span={1} className="newline">{getPayload(data)[3]}</Descriptions.Item>
                                            <Descriptions.Item label="Payload Nationalities" span={1} className="newline">{getPayload(data)[4]}</Descriptions.Item>
                                            <Descriptions.Item label="Payload Customers" span={1} className="newline">{getPayload(data)[5]}</Descriptions.Item>
                                        </Descriptions>
                                    ))}
                                </TabPane>
                                {item['links']['webcast'] !== null ?
                                    <TabPane tab="Webcast" key="2">
                                        <Row>
                                            <Col className="gutter-row" span={24}>
                                                <YouTube videoId={item['links']['youtube_id']} containerClassName="livestream" />
                                            </Col>
                                        </Row>
                                    </TabPane> : null
                                }
                                {item['links']['flickr']['original'].length !== 0 ?
                                    <TabPane tab="Gallery" key="3">
                                        <ResponsiveMasonry
                                            columnsCountBreakPoints={{ 350: 1, 700: 2, 1100: 3 }}
                                        >
                                            <Masonry gutter={15}>
                                                {item['links']['flickr']['original'].map((data) => (
                                                    <Image src={data} style={{ objectFit: "contain" }} />
                                                ))}
                                            </Masonry>
                                        </ResponsiveMasonry>
                                    </TabPane> : null
                                }
                            </Tabs>
                        </Col>
                    </Row>
                )
            }

        },
        [item, TabPane, coresData.loading, getCore, getLandpad, getLaunchpad, getPayload, getRocket, landpadsData.loading, launchpadsData.loading, payloadsData.loading, rocketsData.loading],
    )

    const loadStarship = useCallback(
        () => {
            console.log(starship)
            return (
                <Row>
                    <Col style={{ width: "100%" }}>
                        <Title level={3}>{starship['name']}</Title>
                        <Tabs defaultActiveKey="1" key="1">
                            <TabPane tab="Mission Information" >
                                <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                                    <Descriptions.Item label="Mission Status" span={3}>

                                        {starship["status"]["abbrev"] === "TBD" ? <Badge status="default" text="Upcoming" /> : starship.status.abbrev === "Success" ? <Badge status="success" text="Success" /> : starship.status.abbrev === 'Partial Failure' ? <Badge status="warning" text="Partial Failure" /> : <Badge status="error" text="Failure" />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Type" span={1}>{starship['mission']['type']}</Descriptions.Item>
                                    <Descriptions.Item label="Name" span={1}>{starship['name']}</Descriptions.Item>
                                    <Descriptions.Item label="Launchpad" span={1}>{starship['pad']['name']}</Descriptions.Item>
                                    <Descriptions.Item label="Date" span={3}>{getLocalTime(moment(starship['net']).unix())}</Descriptions.Item>
                                    {<Descriptions.Item label="Countdown" span={3}><Countdown time={moment(starship['net']).unix()} /></Descriptions.Item>}
                                    <Descriptions.Item label="Description" span={3}>{starship['mission']['description']}</Descriptions.Item>
                                </Descriptions>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            )



        },
        [starship, TabPane],
    )

    useEffect(() => {
        if (params['id'].includes('-')) {
            fetchStarship();
        } else {
            fetchCores();
            fetchLandpads();
            fetchLaunchpads();
            fetchPayloads();
            fetchRockets();
        }
    }, [fetchStarship, fetchCores, fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, params, fetchUpcoming, fetchPast])

    useEffect(() => {
        if (!params['id'].includes('-')) {
            if (upcomingData.upcoming && pastData.past) {
                // const upcoming = upcomingData.upcoming;
                const upcoming = Object.values(upcomingData.upcoming).find((upcoming: any) => upcoming['id'] === params['id'])
                const past = Object.values(pastData.past).find((past: any) => past['id'] === params['id'])
                if (upcoming) {
                    setItem(upcoming)
                } else {
                    setItem(past)
                }
            }
        } else {
            const starshipFind = starshipData.starship.combined.find(starship => starship['id'] === params['id'])
            setStarship(starshipFind)
        }
    }, [item, params, upcomingData.loading, pastData.loading, pastData.past, upcomingData.upcoming, starship, starshipData.starship.combined, starshipData.loading])

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }

    function getLocalTimeString(epoc: number) {
        const d = moment.unix(epoc).local().format("MMMM YYYY");
        return "NET " + d.toString();
    }

    return (
        (params['id'].includes('-') ? loadStarship() : loadLaunch())
    )

}

const mapStateToProps = state => {
    return {
        launchpadsData: state.launchpads,
        rocketsData: state.rockets,
        coresData: state.cores,
        payloadsData: state.payloads,
        landpadsData: state.landpads,
        starshipData: state.starship,
        upcomingData: state.upcoming,
        pastData: state.past
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchLaunchpads: () => dispatch(fetchLaunchpads()),
        fetchRockets: () => dispatch(fetchRockets()),
        fetchCores: () => dispatch(fetchCores()),
        fetchPayloads: () => dispatch(fetchPayloads()),
        fetchLandpads: () => dispatch(fetchLandpads()),
        fetchStarship: () => dispatch(fetchStarship()),
        fetchPast: () => dispatch(fetchPast()),
        fetchUpcoming: () => dispatch(fetchUpcoming()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Launch)