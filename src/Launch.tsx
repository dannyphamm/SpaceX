import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from "react-router-dom";
import 'antd/dist/antd.css';
import { Descriptions, Badge, Col, Row, Image} from 'antd';
import Title from 'antd/lib/typography/Title';
import Masonry from 'react-masonry-css';
import PropTypes from 'prop-types'
import moment from 'moment';
import './Launch.css'
function Launch({valueLP, valueR, valueC}) {
    let params = useParams();
    const [item, setItem] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);
    const [rockets, setRockets] = useState<any>([]);
    const [cores, setCores] = useState<any>([]);
    const url = "https://api.spacexdata.com/v4/launches/" + params['id'];
    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
      };
      Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
    Promise.resolve(valueR).then((result) => {
        setRockets(result)
    })
    Promise.resolve(valueC).then((result) => {
        setCores(result)
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
    function getCore(coreID: any) {
        const core = cores.find(core => core['id'] === coreID);
        const block = "B" + core["block"];
        return (block+ " " + core['serial']);
    }
    function getRocket(rocketID: any) {
        const rocket = rockets.find(rocket => rocket['id'] === rocketID);
        
        return (rocket['name']);
    }
    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }
    if (item.length === 0) {
        return (
            <h1>Loading</h1>
        )
    } else {
        return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Descriptions title="Launch Info" bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                                <Descriptions.Item label="Mission Status" span={3}>
                                    {item['success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Flight Number" span={1}>{"#" + item['flight_number']}</Descriptions.Item>
                                <Descriptions.Item label="Name" span={1}>{item['name']}</Descriptions.Item>
                                <Descriptions.Item label="Launchpad" span={1}>{getLaunchpad(item['launchpad'])}</Descriptions.Item>
                                <Descriptions.Item label="Date" span={3}>{getLocalTime(item['date_unix'])}</Descriptions.Item>
                                <Descriptions.Item label="Booster Type">{getRocket(item['rocket']) + " " +getCore(item['cores'][0]['core'])}</Descriptions.Item>
                                <Descriptions.Item label="Booster Flight Number">{item['cores'][0]['flight']}</Descriptions.Item>
                                <Descriptions.Item label="Booster Landing">
                                    {!item['cores'][0]['landing_attempt'] ? <Badge status="default" text="No attempt" /> : item['cores'][0]['landing_success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />}
                                </Descriptions.Item>
                                {/* <Descriptions.Item label="Landing Location">{item['cores'][0]['core']}</Descriptions.Item> */}
                                <Descriptions.Item label="Details" span={3}>{item['details']}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>

                            <Title level={3}>Gallery</Title>
                            <Masonry
                              breakpointCols={breakpointColumnsObj}
                              className="my-masonry-grid"
                              columnClassName="my-masonry-grid_column">
                                {item['links']['flickr']['original'].map((data) => (
                                    <Image src={data} style={{objectFit: "contain"}}/>
                                       
                                ))}
                            </Masonry >
                </Col>
            </Row>


        )
    }
}

Launch.propTypes = {
    valueLP: PropTypes.object,
    valueR: PropTypes.object,
    valueC: PropTypes.object,
}
export default Launch
