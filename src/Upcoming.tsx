import { useEffect } from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card } from 'antd';
import moment from 'moment';
import Countdown from './Countdown';
import { YoutubeFilled, ReadFilled, RedditCircleFilled } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import { Link } from "react-router-dom";

import { connect } from 'react-redux'
import { fetchUpcoming, fetchLaunchpads, fetchStarship } from './redux'

function Upcoming({ upcomingData, launchpadsData, starshipData, fetchUpcoming, fetchLaunchpads, fetchStarship }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", width: "100%" }

    const { Meta } = Card;
    const [launch, setLaunch] = useState<any>([]);
    const [tbd, setTBD] = useState<any>([]);

    const skeleton = [] as any;
    for (var i = 0; i < 24; i++) {
        skeleton.push(<Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={i}><Card
            style={style}
            actions={[
                <YoutubeFilled key={"youtube" + i} />,
                <ReadFilled key={"article" + i} />,
                <RedditCircleFilled key={"reddit" + i} />
            ]}
        >
            <Skeleton loading={true} active></Skeleton>
        </Card></Col>)
    }
    function comp(a, b) {
        return new Date(a.date_unix).getTime() - new Date(b.date_unix).getTime();
    }

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
        
        setLaunch(Object.keys(launchArray).map((key) => launchArray[key]).sort(comp))
        setTBD(Object.keys(tbdArray).map((key) => tbdArray[key]).sort(comp))
    }, [upcomingData.loading,starshipData.starship.upcoming, upcomingData.upcoming])

    function action(item) {
        let array = [] as any;
        if (item['webcast'] !== null) {
            array.push(<a href={item['webcast']} target="_blank" rel="noreferrer" style={{ zIndex: 100 }}><YoutubeFilled key="youtube" /></a>)
        }
        if (item['article'] !== null) {
            array.push(<a href={item['article'] === null ? item['wikipedia'] : item['article']} target="_blank" rel="noreferrer"><ReadFilled key="article" /></a>)
        }
        if (item['reddit']['campaign'] !== null) {
            array.push(<a href={item['reddit']['campaign']} target="_blank" rel="noreferrer"><RedditCircleFilled key="reddit" /></a>)
        }
        return (array)
    }

    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID)
        return (launchpad !== undefined? launchpad['full_name'] : "Unknown")
    }

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }
    function getLocalTimeString(epoc: number) {
        const d = moment.unix(epoc).local().format("MMMM YYYY");
        return "NET " + d.toString();
    }

    function createCard(item) {
        if(upcomingData.upcoming || starshipData.starship.upcoming) {
            if (item['type'] === "starship") {
                return(
                    <Card
                        hoverable
                        style={style}
                        bodyStyle={styleBody}
                        cover={<Link to={"/launch/" + item['id']}><img alt="example" src={(item['image'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['image']} style={styleCover} /></Link>}
                        actions={action(item['links'])}
                    >
                        <div>
                            <Link to={"launch/" + item['id']}>
                                <Meta title={item['name']} />
                                <Meta description={item['launchpad']} style={{ fontWeight: 'bold', lineHeight: "1rem", marginBottom: "0.5rem" }} />
                                <Meta description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                <br />
                                {<Meta description={<Countdown time={item['date_unix']} />} />}
                            </Link>
                        </div>
                    </Card>
                )
            } else {
                return (
                    <Card
                        hoverable
                        style={style}
                        bodyStyle={styleBody}
                        cover={<Link to={"/launch/" + item['id']}><img alt="example" src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} /></Link>}
                        actions={action(item['links'])}
                    >
                        <div>
                            <Link to={"launch/" + item['id']}>
                                <Meta title={"#" + item['flight_number'] + " " + item['name']} />
                                <Meta description={getLaunchpad(item['launchpad'])} style={{ fontWeight: 'bold', lineHeight: "1rem", marginBottom: "0.5rem" }} />
                                {item['date_precision'] !== 'hour' ? <Meta description={getLocalTimeString(item['date_unix'])} style={{ fontWeight: 'bold' }} /> : <Meta description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />}
    
                                <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                <br />
                                {item['date_precision'] !== 'hour' ? null : <Meta description={<Countdown time={item['date_unix']} />} />}
                            </Link>
                        </div>
                    </Card>
                )
            }
        }
    }
    if (upcomingData.loading || launchpadsData.loading) {
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
                        <Title level={2}>Upcoming Missions</Title>
                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                            {launch.map((item: { [x: string]: number; }) => (
                                <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id']}>
                                    {createCard(item)}

                                </Col>
                            )
                            )
                            }
                        </Row >
                        <Row>
                            <Col>
                                <Title level={3}>Unverified Missions</Title>
                                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                    {tbd.map((item: { [x: string]: number; }, value) => (
                                        <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id']}>
                                            {createCard(item)}
                                        </Col>
                                    ))}
                                </Row >
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
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
)(Upcoming)