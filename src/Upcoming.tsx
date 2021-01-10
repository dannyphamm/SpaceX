import React, { useEffect } from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card, Pagination } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import Countdown from './Countdown';
import { YoutubeFilled, ReadFilled } from '@ant-design/icons';
import PropTypes from 'prop-types'
import Title from 'antd/lib/typography/Title';
function Upcoming({ value, valueLP }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px" }
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }

    const { Meta } = Card;
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(25);
    const [pageSize, setPageSize] = useState<number>(25)
    const [minValue1, setMinValue1] = useState<number>(0);
    const [maxValue1, setMaxValue1] = useState<number>(25);
    const [pageSize1, setPageSize1] = useState<number>(25)
    const [launch, setLaunch] = useState<any>([]);
    const [tbd, setTBD] = useState<any>([]);
    const [items1, setItems1] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);
    const skeleton = [] as any;

    for (var i = 0; i < 25; i++) {
        skeleton.push(<Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}><Card
            style={style}
            actions={[
                <YoutubeFilled key="youtube" />,
                <ReadFilled key="article" />
            ]}
        >
            <Skeleton loading={true} active></Skeleton>
        </Card></Col>)
    }
    function comp(a, b) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    Promise.resolve(value).then((result) => {
        //console.log(result)
        setItems1(result.sort(comp));

    })
    useEffect(() => {
        let tbdArray = [] as any;
        let launchArray = [] as any;
        for (let i in items1) {
            if (items1[i]["date_precision"] !== "hour") {
                tbdArray[i] = { ...tbdArray[i], ...items1[i] }

            } else {
                launchArray[i] = { ...launchArray[i], ...items1[i] }
            }
        }
        setLaunch(Object.keys(launchArray).map((key) => launchArray[key]).sort(comp))
        setTBD(Object.keys(tbdArray).map((key) => tbdArray[key]).sort(comp))
    }, [items1])

    Promise.resolve(valueLP).then((result) => {
        setLaunchPads(result)
    })
    function handleChange(value, pageSize) {
        setPageSize(pageSize)
        if (value <= 1) {
            setMinValue(0)
            setMaxValue(pageSize)
        } else {
            setMinValue((value - 1) * pageSize)
            setMaxValue(value * pageSize)
        }
    }
    function handleChange1(value, pageSize1) {
        setPageSize1(pageSize1)
        if (value <= 1) {
            setMinValue1(0)
            setMaxValue1(pageSize1)
        } else {
            setMinValue1((value - 1) * pageSize1)
            setMaxValue1(value * pageSize1)
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
    function getLocalTimeString(epoc: number) {
        const d = moment.unix(epoc).format("MMMM YYYY");
        return "NET " + d.toString();
    }


    if (launch.length === 0 || launchpads.length === 0) {
        return (
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                {skeleton}
            </Row>
        )
    } else {
        return (
            <div>
                <Row>
                    <Col>
                        <Title level={2}>Upcoming Launches</Title>
                        <Pagination
                            style={paginationStyle}
                            defaultCurrent={1}
                            onChange={handleChange}
                            pageSize={pageSize}
                            total={launch.length}
                            responsive={true}
                            pageSizeOptions={["25", "50", "75", "100"]}
                        />
                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                            {launch.slice(minValue, maxValue).map((item: { [x: string]: number; }) => (
                                <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id']}>
                                    <Card
                                        hoverable
                                        style={style}
                                        bodyStyle={styleBody}
                                        cover={<img alt="example" src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} />}
                                    >
                                        <Meta title={item['name']} />
                                        <Meta title={"Launchpad: " + getLaunchpad(item['launchpad'])} />
                                        <Meta description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                        <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />

                                        <br />
                                        <Meta description={<Countdown time={item['date_unix']}/>}/>

                                    </Card>
                                </Col>
                            )
                            )
                            }
                        </Row >
                        <Row>
                            <Col>
                                <Title level={2}>Unverified Launches</Title>
                                <Pagination
                                    style={paginationStyle}
                                    defaultCurrent={1}
                                    onChange={handleChange1}
                                    pageSize={pageSize1}
                                    total={tbd.length}
                                    responsive={true}
                                    pageSizeOptions={["25", "50", "75", "100"]}
                                />
                                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                    {tbd.slice(minValue1, maxValue1).map((item: { [x: string]: number; }) => (
                                        <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id']}>
                                            <Card
                                                hoverable
                                                style={style}
                                                bodyStyle={styleBody}
                                                cover={<img alt="example" src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} />}
                                            >
                                                <Meta title={item['name']} />
                                                <Meta title={"Launchpad: " + getLaunchpad(item['launchpad'])} />
                                                <Meta description={getLocalTimeString(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                                <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                            </Card>
                                        </Col>
                                    )
                                    )
                                    }
                                </Row >
                            </Col>
                        </Row>
                    </Col>
                </Row>



            </div>
        )
    }
}
Upcoming.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}

export default Upcoming
