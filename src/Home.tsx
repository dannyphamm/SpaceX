import { Col, Row, Card, Skeleton } from 'antd'
import React from 'react'
import moment from 'moment';
import { useState } from 'react';
import Meta from 'antd/lib/card/Meta';
import { useEffect } from 'react';
import YouTube from 'react-youtube';
import { Link } from "react-router-dom";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { connect } from 'react-redux'
import { fetchUpcoming, fetchLaunchpads } from './redux'
import PropTypes from 'prop-types'
import FlipCountdown from '@rumess/react-flip-countdown';
function Home({ upcomingData, launchpadsData, fetchUpcoming, fetchLaunchpads, theme }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const center = { justifyContent: "center" }

    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", width: "100%" }

    const [launch, setLaunch] = useState<any>([]);
    useEffect(() => {
        fetchUpcoming();
        fetchLaunchpads();
    }, [])

    useEffect(() => {
        let launchArray = [] as any;
        for (let i in upcomingData.upcoming) {
            if (upcomingData.upcoming[i]["date_precision"] === "hour") {
                launchArray[i] = { ...launchArray[i], ...upcomingData.upcoming[i] }
            }
        }
        setLaunch(Object.keys(launchArray).map((key) => launchArray[key]).sort(comp))
    }, [upcomingData.loading])
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    function getLaunchpad(launchpadID: any) {

        const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['name']);
    }

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).local().format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }
    if (upcomingData.loading || launchpadsData.loading || launch.length === 0) {
        return (
            <Row style={center} gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 10 }}>
                    <Card
                        style={style}
                    >
                        <Skeleton loading={true} active></Skeleton>
                    </Card>
                </Col>
            </Row >
        )
    } else {
        return (
            <>
                {launch[0]['links']['youtube_id'] === null ?
                    <>
                        <Row style={center}>
                            <Col span={24}>
                                <Row style={center} gutter={[{ xs: 8, sm: 16, md: 24, lg: 24 }, { xs: 8, sm: 16, md: 24, lg: 24 }]}>
                                    <Col className="gutter-row" span={24} style={{ textAlign: "center" }}>
                                        <Card
                                            style={style}
                                        >
                                            <FlipCountdown
                                                endAt={launch[0]['date_local']}
                                            />
                                        </Card>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 8 }} key={launch[0]['id']}>
                                        <Card
                                            hoverable
                                            style={style}
                                            bodyStyle={styleBody}
                                            cover={<Link to={"launch/" + launch[0]['id']}><img alt="example" src={(launch[0]['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : launch[0]['links']['patch']['large']} style={styleCover} /></Link>}
                                        >
                                            <Link to={"launch/" + launch[0]['id']}>
                                                <div>
                                                    <Meta title={launch[0]['name']} />
                                                    <Meta title={"Launchpad: " + getLaunchpad(launch[0]['launchpad'])} description={getLocalTime(launch[0]['date_unix'])} style={{ fontWeight: 'bold' }} />
                                                    <Meta description={(launch[0]['details'] === null ? "No Information Provided" : launch[0]['details'])} />
                                                </div>
                                            </Link>
                                        </Card>
                                    </Col>
                                    <Col className="gutter-row tweets" xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 4 }}>
                                        <TwitterTimelineEmbed
                                            sourceType="profile"
                                            screenName="spacex"
                                            theme={theme}
                                            options={{ height: '100%' }}
                                        />
                                    </Col>
                                </Row >

                            </Col>
                        </Row>
                    </>
                    :
                    <>
                        <Row style={center}>
                            <Col span={24}>
                                <Row style={center} gutter={[{ xs: 8, sm: 16, md: 24, lg: 24 }, { xs: 8, sm: 16, md: 24, lg: 24 }]}>
                                    <Col className="gutter-row" span={24} style={{ textAlign: "center" }}>
                                        <Card
                                            style={style}
                                        >
                                            <FlipCountdown
                                                endAt={launch[0]['date_local']}
                                            />
                                        </Card>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 3 }} key={launch[0]['id']}>
                                        <Card
                                            hoverable
                                            style={style}
                                            bodyStyle={styleBody}
                                            cover={<Link to={"launch/" + launch[0]['id']}><img alt="example" src={(launch[0]['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : launch[0]['links']['patch']['large']} style={styleCover} /></Link>}
                                        >
                                            <Link to={"launch/" + launch[0]['id']}>
                                                <div>
                                                    <Meta title={launch[0]['name']} />
                                                    <Meta title={"Launchpad: " + getLaunchpad(launch[0]['launchpad'])} description={getLocalTime(launch[0]['date_unix'])} style={{ fontWeight: 'bold' }} />
                                                    <Meta description={(launch[0]['details'] === null ? "No Information Provided" : launch[0]['details'])} />
                                                </div>
                                            </Link>
                                        </Card>

                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 18 }}>
                                        <YouTube videoId={launch[0]['links']['youtube_id']} containerClassName="livestream1" />
                                    </Col>
                                    <Col className="gutter-row tweets" xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 3 }}>
                                        <TwitterTimelineEmbed
                                            sourceType="profile"
                                            screenName="spacex"
                                            theme={theme}
                                            options={{ height: '100%' }}
                                            className="twitter"
                                        />
                                    </Col>
                                </Row >
                            </Col>
                        </Row>

                    </>

                }
            </>
        )
    }
}

Home.propTypes = {
    theme: PropTypes.string,
}
const mapStateToProps = state => {
    return {
        upcomingData: state.upcoming,
        launchpadsData: state.launchpads
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUpcoming: () => dispatch(fetchUpcoming()),
        fetchLaunchpads: () => dispatch(fetchLaunchpads())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)