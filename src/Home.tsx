import { ReadFilled, YoutubeFilled } from '@ant-design/icons';
import { Card, Col, Row, Skeleton } from 'antd'
import React from 'react'
import moment from 'moment';
import { useState } from 'react'
import Countdown from './Countdown';
import PropTypes from 'prop-types'
function Home({ value, valueLP }) {
    const style = { margin: "0 auto", height: "100%", display: "flex", flexFlow: "row"};
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", maxWidth: "500px" }
    const { Meta } = Card;

    const [items, setItems] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);
    const skeleton = [] as any;
    for (var i = 0; i < 25; i++) {
        skeleton.push(<Col className="gutter-row" xs="8" sm="16" md="24" lg="32"><Card
            style={{ width: 500 }}
            actions={[
                <YoutubeFilled key="youtube" />,
                <ReadFilled key="article" />
            ]}
        >
            <Skeleton loading={true} active></Skeleton>
        </Card></Col>)
    }
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    Promise.resolve(value).then((result) => {
        setItems(result.sort(comp))
        console.log(items)
    })
    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
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
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                {skeleton}
            </Row>
        )
    } else {
        return (
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col>
                    <Card
                        key={items[0]['id']}
                        style={style}
                        bodyStyle={styleBody}
                        cover={<img alt="example" src={(items[0]['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : items[0]['links']['patch']['large']} style={styleCover} />}
                    >
                        <Meta title={items[0]['name']} style={{fontSize:"75px"}} />
                        <Meta title={"Launchpad: " + getLaunchpad(items[0]['launchpad'])} description={getLocalTime(items[0]['date_unix'])} style={{fontSize:"50px"}} />
                        <Meta description={(items[0]['details'] === null ? "No Information Provided" : items[0]['details'])} style={{fontSize:"30px"}}/>
                        <br />
                        <Meta description={<Countdown time={items[0]['date_unix']}></Countdown>} style={{fontSize:"75px"}}/>
                        </Card>
                </Col>
            </Row >
        )
    }
}
Home.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}
export default Home
