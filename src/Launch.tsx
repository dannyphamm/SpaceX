import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from "react-router-dom";
import 'antd/dist/antd.css';
import { Descriptions, Badge, Col, Row, Image } from 'antd';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import PropTypes from 'prop-types'
import moment from 'moment';
import './Launch.css'
import YouTube from 'react-youtube';
import Countdown from './Countdown';
function Launch({ valueLP, valueR, valueC, valueZ }) {
    let params = useParams();
    const [item, setItem] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);
    const [rockets, setRockets] = useState<any>([]);
    const [landpads, setLandpads] = useState<any>([]);
    const [cores, setCores] = useState<any>([]);
    const url = "https://api.spacexdata.com/v4/launches/" + params['id'];
    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
    Promise.resolve(valueR).then((result) => {
        setRockets(result)
    })
    Promise.resolve(valueC).then((result) => {
        setCores(result)
    })
    Promise.resolve(valueZ).then((result) => {
        setLandpads(result)
    })
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setItem(result)
                },
                (error) => {

                }
            )
    }, [url])

    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['full_name']);
    }

    function getLandpad(item1: any) {
        let value;
            for (let i in landpads) {
                if (landpads[i]['launches'].indexOf(item1) > -1) {
                    value = i
                }
                
            } 
            if(value > -1) {
                return ([landpads[value]['region'], landpads[value]['full_name'], landpads[value]['type']])
            } else {
                return(["Unknown","Unknown","Unknown"])
            }
            
           

    }
    function getCore(coreID: any) {
        if(coreID === null) {
            return ""
        } else {
            const core = cores.find(core => core['id'] === coreID);
            let block;
            
            if(core['block'] !== null) {
                block = "B" + core["block"];
                return (block + " " + core['serial']);
            } else {
                return (core['serial']);
            }
            
        }

    }
    function getRocket(rocketID: any) {
        const rocket = rockets.find(rocket => rocket['id'] === rocketID);

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
    if (item.length === 0) {
        return (
            <h1>Loading</h1>
        )
    } else {
        return (
            <Row>
                <Col style={{width: "100%"}}>
                    <Row>
                        <Col style={{width: "100%"}}>
                            <Descriptions title="Launch Info" bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                                <Descriptions.Item label="Mission Status" span={3}>
                                    {item['upcoming']? <Badge status="default" text="Upcoming" /> : item['success'] === null? <Badge status="default" text="Unknown" /> : item['success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Flight Number" span={1}>{"#" + item['flight_number']}</Descriptions.Item>
                                <Descriptions.Item label="Name" span={1}>{item['name']}</Descriptions.Item>
                                <Descriptions.Item label="Launchpad" span={1}>{getLaunchpad(item['launchpad'])}</Descriptions.Item>
                                <Descriptions.Item label="Date" span={3}>{item['date_precision'] !== "hour"? getLocalTimeString(item['date_unix']): getLocalTime(item['date_unix'])}</Descriptions.Item>
                                {item['date_precision'] === "hour"?  <Descriptions.Item label="Countdown" span={3}><Countdown time={item['date_unix']} /></Descriptions.Item>: null}
                               
                                {/* Booster Information */}
 
                                <Descriptions.Item label="Booster Landing Status" span={1}>
                                    {item['cores'][0]['landing_attempt'] === null? <Badge status="default" text="Unknown" /> : item['cores'][0]['landing_attempt']? item['cores'][0]['landing_success'] === null? <Badge status="default" text="Unknown" />: item['cores'][0]['landing_success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />: <Badge status="default" text="No attempt" />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Booster Type" span={1}>{getRocket(item['rocket']) + " " + getCore(item['cores'][0]['core'])}</Descriptions.Item>
                                <Descriptions.Item label="Booster Flight Number" span={1}>{item['cores'][0]['flight'] === null? "Unknown":item['cores'][0]['flight']}</Descriptions.Item>
                                {/* Landing Information */}
                                {item['cores'][0]['landing_attempt']?<>
                                <Descriptions.Item label="Landing Region" span={1}>{item['cores'][0]['landing_success'] === null? "Pending" : getLandpad(item['id'])[0]}</Descriptions.Item>
                                <Descriptions.Item label="Landing Location" span={1}>{item['cores'][0]['landing_success'] === null? "Pending" : getLandpad(item['id'])[1]}</Descriptions.Item>
                                <Descriptions.Item label="Landing Type" span={1}>{item['cores'][0]['landing_success'] === null? "Pending" : getLandpad(item['id'])[2]}</Descriptions.Item></> : null}

                                <Descriptions.Item label="Details" span={3}>{item['details'] === null? "No information Provided":item['details']}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    {item['links']['webcast'] !== null ?                    <Row>
                        <Col className="gutter-row" span={24}>
                        <YouTube videoId={item['links']['youtube_id']} containerClassName="livestream"/>
                        </Col>
                    </Row> : null

                    }

                        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 700: 2, 1100: 3}}
                 >
                <Masonry gutter={15}>
                {item['links']['flickr']['original'].map((data) => (
                                    <Image src={data} style={{ objectFit: "contain" }} />

                                ))} 
                                    </Masonry>
            </ResponsiveMasonry>

                </Col>
            </Row>


        )
    }
}

Launch.propTypes = {
    valueLP: PropTypes.object,
    valueR: PropTypes.object,
    valueC: PropTypes.object,
    valueZ: PropTypes.object,
}
export default Launch