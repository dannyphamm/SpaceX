import { Col, Row, Image } from 'antd'
import React from 'react'
import moment from 'moment';
import { useState } from 'react'
import Countdown from './Countdown';
import PropTypes from 'prop-types'
function Home({ value, valueLP }) {
    const styleDescription = { justifyContent: "center", textAlign: "center" as const }
    const center = { textAlign: "center" as const }
    const styleName = { textAlign: "center" as const, fontSize: "2rem", fontWeight: "bold" as const }
    const styleCountdown = { fontSize: "3rem" }
    const styleLaunchpad = { fontSize: "2rem", textAlign: "center" as const }
    const background = { backgroundColor: "#A9A9A9" }
    const image = { margin: "15px" }


    const [items, setItems] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);

    Promise.resolve(value).then((result) => {
        setItems(result.sort(comp))
        console.log(items)
    })
    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })

    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['name']);
    }

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }

    if (items.length === 0 || launchpads.length === 0) {
        return (
            <h1>Loading</h1>
        )
    } else {
        return (
            <div>
                <Row style={center}>
                    <Col span={24}>
                        <Image
                            width={400}
                            style={image}
                            src={(items[0]['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : items[0]['links']['patch']['large']}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col style={background}>
                        <Row >
                            <Col span={24} style={styleName}>
                                {items[0]['name']}
                            </Col>
                        </Row>
                        <Row style={styleLaunchpad}>
                            <Col span={24}>
                                {"Launchpad: " + getLaunchpad(items[0]['launchpad'])}
                                <br></br>
                                {getLocalTime(items[0]['date_unix'])}
                            </Col>
                        </Row>
                        <Row style={styleDescription}>
                            <Col span={8}>
                                {(items[0]['details'] === null ? "No Information Provided" : items[0]['details'])}
                            </Col>
                        </Row>
                        <Row style={styleDescription}>
                            <Col span={24} style={styleCountdown}>
                                <Countdown time={items[0]['date_unix']} ></Countdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
Home.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}
export default Home