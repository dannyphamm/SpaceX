import React from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card, Pagination } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import Countdown from './Countdown';
import { YoutubeFilled, ReadFilled } from '@ant-design/icons';
import PropTypes from 'prop-types'
function Upcoming({ value, valueLP }) {
    const style = { width: 350, margin: "0 auto", height: "100%", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px" }
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }

    const { Meta } = Card;
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(25);
    const [pageSize, setPageSize] = useState<number>(25)
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
    })
    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
    function handleChange(value, pageSize) {
        setPageSize(pageSize)
        if (value <= 1) {
            setMinValue(0)
            setMaxValue(pageSize)
            console.log(pageSize)
        } else {
            setMinValue((value - 1) * pageSize)
            setMaxValue(value * pageSize)
            console.log(value)
        }
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
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                {skeleton}
            </Row>
        )
    } else {
        return (
            <div>
                <Pagination
                    style={paginationStyle}
                    defaultCurrent={1}
                    onChange={handleChange}
                    pageSize={pageSize}
                    total={items.length}
                    responsive={true}
                    pageSizeOptions={["25", "50", "75", "100"]}
                />
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    {items.map((item: { [x: string]: number; }) => (
                        <Col className="gutter-row" xs="8" sm="16" md="24" lg="32">
                            <Card
                                key={item['id']}
                                hoverable
                                style={style}
                                bodyStyle={styleBody}
                                cover={<img alt="example" src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} />}
                            >
                                <Meta title={item['name']} />
                                <Meta title={"Launchpad: " + getLaunchpad(item['launchpad'])} description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                <br />
                                <Meta description={<Countdown time={item['date_unix']}></Countdown>} />
                            </Card>
                        </Col>
                    )
                    )
                    }
                </Row >
            </div>
        )
    }
}
Upcoming.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}

export default Upcoming
