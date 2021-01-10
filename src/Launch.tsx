import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from "react-router-dom";
import 'antd/dist/antd.css';
import { Descriptions, Badge, Col, Row, Image} from 'antd';
import Title from 'antd/lib/typography/Title';
import Masonry from 'react-masonry-css';
import './Launch.css'
function Launch() {
    let params = useParams();
    const [item, setItem] = useState<any>([]);
    const url = "https://api.spacexdata.com/v4/launches/" + params['id'];
    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
      };
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
                            <Descriptions title="Launch Info" bordered>
                                <Descriptions.Item label="Mission Status" span={3}>
                                    {item['success'] ? <Badge status="success" text="Success" /> : <Badge status="error" text="Failure" />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Flight Number" span={1}>{"#" + item['flight_number']}</Descriptions.Item>
                                <Descriptions.Item label="Name" span={1}>{item['name']}</Descriptions.Item>
                                <Descriptions.Item label="Launchpad" span={1}>{item['launchpad']}</Descriptions.Item>
                                <Descriptions.Item label="Date" span={3}>{item['date_local']}</Descriptions.Item>
                                <Descriptions.Item label="Booster Type">{item['cores'][0]['core']}</Descriptions.Item>
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

export default Launch
