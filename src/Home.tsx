import { Col, Row, Card } from 'antd'
import React from 'react'
import moment from 'moment';
import { useState } from 'react'
import Countdown from './Countdown';
import PropTypes from 'prop-types'
import Meta from 'antd/lib/card/Meta';
import { useEffect } from 'react';
import YouTube from 'react-youtube';
import './Home.css'
function Home({ value, valueLP }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column"};
    const center = { justifyContent: "center" }

    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px" }
    const opts = {
        height: '100%',
        width: '100%'
      };
    const [launch, setLaunch] = useState<any>([]);
    const [items1, setItems1] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);

    Promise.resolve(value).then((result) => {
        setItems1(result.sort(comp))
    })
    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
    useEffect(() => {
        let launchArray = [] as any;
        for (let i in items1) {
            if (items1[i]["date_precision"] === "hour") {
                launchArray[i] = { ...launchArray[i], ...items1[i] }
            } 
        }
        setLaunch(Object.keys(launchArray).map((key) => launchArray[key]).sort(comp))
    }, [items1])
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['name']);
    }

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).local().format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }

    if (launch.length === 0 || launchpads.length === 0) {
        return (
            <h1>Loading</h1>
        )
    } else {
        return (
            <div>
                <Row style={center} gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 4 }} key={launch[0]['id']}>
                        <Card
                            hoverable
                            style={style}
                            bodyStyle={styleBody}
                            cover={<img alt="example" src={(launch[0]['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : launch[0]['links']['patch']['large']} style={styleCover} />}
                        >
                            <Meta title={launch[0]['name']} />
                            <Meta title={"Launchpad: " + getLaunchpad(launch[0]['launchpad'])} description={getLocalTime(launch[0]['date_unix'])} style={{ fontWeight: 'bold' }} />
                            <Meta description={(launch[0]['details'] === null ? "No Information Provided" : launch[0]['details'])} />
                            <br />
                            <Meta description={<Countdown time={launch[0]['date_unix']}></Countdown>} />
                        </Card>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 20 }}>
                    
                    <YouTube videoId={launch[0]['links']['youtube_id']} opts={opts} containerClassName="livestream"/>
                    
                    </Col>
                </Row >

            </div>
        )
    }
}
Home.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}
export default Home