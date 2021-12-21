import { Col, Row, Card, Skeleton } from 'antd'
import moment from 'moment';
import { useState } from 'react';
import Meta from 'antd/lib/card/Meta';
import { useEffect } from 'react';
import YouTube from 'react-youtube';
import { Link } from "react-router-dom";
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { connect } from 'react-redux'
import { fetchUpcoming, fetchLaunchpads, fetchStarship } from './redux'
import FlipCountdown from '@rumess/react-flip-countdown';
import { useThemeSwitcher } from 'react-css-theme-switcher';
function Home({ upcomingData, starshipData, launchpadsData, fetchUpcoming, fetchLaunchpads, fetchStarship }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const center = { justifyContent: "center" }
    const { currentTheme } = useThemeSwitcher();
    const [isDark, setDark] = useState(false);
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", width: "100%" }

    const [launch, setLaunch] = useState<any>([]);
    useEffect(() => {
        fetchStarship();
        fetchUpcoming();
        fetchLaunchpads();
    }, [fetchLaunchpads, fetchUpcoming, fetchStarship])

    useEffect(() => {
        let tbdArray = [] as any;
        let launchArray = [] as any;
        for (let i in upcomingData.upcoming) {
            if (upcomingData.upcoming[i]["date_precision"] === "hour") {
                launchArray.push(upcomingData.upcoming[i])
            } else {
                tbdArray.push(upcomingData.upcoming[i])
            }
        }
        for (let i in starshipData.starship.upcoming) {
            let data = [] as any
            data[i] = {
                type: "starship",
                id: starshipData.starship.upcoming[i]['id'],
                image: starshipData.starship.upcoming[i]['image'],
                name: starshipData.starship.upcoming[i]['name'],
                launchpad: starshipData.starship.upcoming[i]['pad']['name'],
                details: starshipData.starship.upcoming[i]['mission']['description'],
                date_unix: moment(starshipData.starship.upcoming[i]['net']).unix(),
                date_net: moment(starshipData.starship.upcoming[i]['window_start']).toString(),
                links:
                {
                    reddit: {
                        campaign: null,
                    },
                    webcast: null,
                    article: starshipData.starship.upcoming[i]['program'][0]['wiki_url']
                }
            }
            launchArray.push(data[i])

        }
        console.log(launchArray)
        setLaunch(Object.keys(launchArray).map((key) => launchArray[key]).sort(comp))
    }, [upcomingData.loading, starshipData.starship.upcoming, upcomingData.upcoming])

    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

    function getLaunchpad(launchpadID: any) {

        const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['name']);
    }
    useEffect(() => {
        if (currentTheme === "dark") {
            setDark(true)
        } else {
            setDark(false)
        }
    }, [currentTheme])
    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).local().format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }
    if (!launch) {
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
    }
    if (launch.length === 0 || launchpadsData.loading || upcomingData.loading  || starshipData.loading ) {
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
        if (launch && launch[0].type === "starship") {
            return(
                <>
                <Row style={center}>
                    <Col span={24}>
                        <Row style={center} gutter={[{ xs: 8, sm: 16, md: 24, lg: 24 }, { xs: 8, sm: 16, md: 24, lg: 24 }]}>
                            <Col className="gutter-row" span={24} style={{ textAlign: "center" }}>
                                <Card
                                    style={style}
                                >
                                    <FlipCountdown
                                        endAt={moment(launch[0]['date_net']).format('lll').toString()}
                                    />
                                </Card>
                            </Col>
                            <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 8 }} key={launch[0]['id']}>
                                <Card
                                    hoverable
                                    style={style}
                                    bodyStyle={styleBody}
                                    cover={<Link to={"launch/" + launch[0]['id']}><img alt="example" src={(launch[0]['image'] === null) ? "https://www.spacex.com/static/images/share.jpg" : launch[0]['image']} style={styleCover} /></Link>}
                                >
                                    <Link to={"launch/" + launch[0]['id']}>
                                        <div>
                                            <Meta title={launch[0]['name']} />
                                            <Meta title={"Launchpad: " + launch[0]['launchpad']} description={getLocalTime(launch[0]['date_unix'])} style={{ fontWeight: 'bold' }} />
                                            <Meta description={(launch[0]['details'] === null ? "No Information Provided" : launch[0]['details'])} />
                                        </div>
                                    </Link>
                                </Card>
                            </Col>

                            <Col className="gutter-row tweets" xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 4 }}>
                                <Card
                                    bodyStyle={{ padding: 0 }}

                                >
                                    <TwitterTimelineEmbed
                                        sourceType="profile"
                                        screenName="spacex"
                                        theme={isDark ? "dark" : "light"}
                                        options={{ height: '100%' }}
                                        noScrollbar
                                        key={isDark ? "1" : "2"}
                                        transparent
                                    />
                                </Card>
                            </Col>
                        </Row >

                    </Col>
                </Row>
            </>
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
                                            <Card
                                                bodyStyle={{ padding: 0 }}

                                            >
                                                <TwitterTimelineEmbed
                                                    sourceType="profile"
                                                    screenName="spacex"
                                                    theme={isDark ? "dark" : "light"}
                                                    options={{ height: '100%' }}
                                                    noScrollbar
                                                    key={isDark ? "1" : "2"}
                                                    transparent
                                                />
                                            </Card>
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
                                            <Card
                                                bodyStyle={{ padding: 0 }}

                                            >
                                                <TwitterTimelineEmbed
                                                    sourceType="profile"
                                                    screenName="spacex"
                                                    theme={isDark ? "dark" : "light"}
                                                    options={{ height: '100%' }}
                                                    noScrollbar
                                                    key={isDark ? "1" : "2"}
                                                    transparent
                                                />
                                            </Card>
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

}

const mapStateToProps = state => {
    return {
        upcomingData: state.upcoming,
        launchpadsData: state.launchpads,
        starshipData: state.starship
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUpcoming: () => dispatch(fetchUpcoming()),
        fetchLaunchpads: () => dispatch(fetchLaunchpads()),
        fetchStarship: () => dispatch(fetchStarship())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)