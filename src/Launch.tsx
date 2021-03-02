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
import { fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores } from './redux';


function Launch({ fetchLandpads, fetchLaunchpads, fetchPayloads, fetchRockets, fetchCores, landpadsData, launchpadsData, payloadsData, rocketsData, coresData }) {
    let params = useParams();
    
    const { TabPane } = Tabs;
    const [item, setItem] = useState<any>([]);
    const url = "https://api.spacexdata.com/v4/launches/" + params['id'];
    
    useEffect(() => {
        fetchCores();
        fetchLandpads();
        fetchLaunchpads();
        fetchPayloads();
        fetchRockets();
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setItem(result)
                },
            )
    }, [url])

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
            console.log(coresData.cores)
            console.log(coresData.cores['5e9e28a5f3591833b13b2659'])
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
    if (landpadsData.loading || launchpadsData.loading || coresData.loading || rocketsData.loading || payloadsData.loading || item.length === 0) {
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
}

const mapStateToProps = state => {
    return {
        launchpadsData: state.launchpads,
        rocketsData: state.rockets,
        coresData: state.cores,
        payloadsData: state.payloads,
        landpadsData: state.landpads
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchLaunchpads: () => dispatch(fetchLaunchpads()),
        fetchRockets: () => dispatch(fetchRockets()),
        fetchCores: () => dispatch(fetchCores()),
        fetchPayloads: () => dispatch(fetchPayloads()),
        fetchLandpads: () => dispatch(fetchLandpads())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Launch)