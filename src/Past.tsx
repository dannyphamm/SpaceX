import React from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card, Pagination, Badge } from 'antd';
import moment from 'moment';
import { YoutubeFilled, ReadFilled, RedditCircleFilled } from '@ant-design/icons';
import { connect } from 'react-redux'
import { fetchPast, fetchLaunchpads, fetchStarship } from './redux'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
function Past({ pastData, launchpadsData, fetchPast, fetchLaunchpads, starshipData, fetchStarship }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", width: "100%" }
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }

    const { Meta } = Card;

    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(24);
    const [pageSize, setPageSize] = useState<number>(24);
    const [data, setData] = useState<any>([24]);

    const [ready, setReady] = useState<boolean>(false);
    const skeleton = [] as any;
    for (var i = 0; i < 24; i++) {
        skeleton.push(<Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={i}><Card
            style={style}
            actions={[
                <YoutubeFilled key="youtube" />,
                <ReadFilled key="article" />,
                <RedditCircleFilled key="reddit" />
            ]}
        >
            <Skeleton loading={true} active></Skeleton>
        </Card></Col>)
    }
    useEffect(() => {
        fetchPast()
        fetchLaunchpads();
        fetchStarship();
    }, [])
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(b.date_unix).getTime() - new Date(a.date_unix).getTime();
    }
    useEffect(() => {
        if (!starshipData.loading && !pastData.loading) {
            let data1 = [] as any;
            for (let i in starshipData.starship.previous) {
                let data2 = [] as any
                data2[i] = {
                    type: "starship",
                    id: starshipData.starship.previous[i]['id'],
                    image: starshipData.starship.previous[i]['image'],
                    name: starshipData.starship.previous[i]['name'],
                    launchpad: starshipData.starship.previous[i]['pad']['name'],
                    details: starshipData.starship.previous[i]['mission']['description'],
                    status: starshipData.starship.previous[i]['status'],
                    date_unix: moment(starshipData.starship.previous[i]['net']).unix(),
                    links:
                    {
                        reddit: {
                            campaign: null,
                        },
                        webcast: null,
                        article: starshipData.starship.previous[i]['program'][0]['wiki_url']
                    }

                }
                data1.push(data2[i])
            }
            for (let i in pastData.past) {
                if (i !== "last_updated") {
                    data1.push(pastData.past[i])
                }
            }

            setData(data1.sort(comp))
            setReady(true)
        }

    }, [starshipData.loading, pastData.loading])

    function getLaunchpad(launchpadID: any) {
        const launchpad = launchpadsData.launchpads.find(launchpad => launchpad['id'] === launchpadID);
        return (launchpad['full_name']);
    }

    function getLocalTime(epoc: number) {
        const d = moment.unix(epoc).local().format("hh:mmA DD/MM/YYYY");
        return d.toString();
    }

    function handleChange(value1, pageSize) {
        setPageSize(pageSize)
        if (value1 <= 1) {
            setMinValue(0)
            setMaxValue(pageSize)
        } else {
            setMinValue((value1 - 1) * pageSize)
            setMaxValue(value1 * pageSize)
        }
    }

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
    function missionStatus(item) {
        if (item['type'] === 'starship') {
            return (
                (item.status.abbrev === 'Success' ? <Badge status="success" text="Mission Success" /> : item.status.abbrev === 'Partial Failure' ? <Badge status="warning" text="Partial Failure" /> : <Badge status="error" text="Failure" />)
            )
        } else {
            const mission = item['success'];
            let landed = 0
            for (let i in item['cores']) {
                if (!item['cores'][i]['landing_attempt']) {
                    return (<>
                        {mission ? <Badge status="success" text="Mission Success" /> : <Badge status="error" text="Mission Failure" />}
                        <Badge status="default" text="No Landing Attempt" style={{ margin: "0 1rem" }} />
                    </>)
                } else {
                    if (item['cores'][i]['landing_success']) {
                        landed += 1;
                    }
                }
            }

            if (landed === item['cores'].length) {
                return (<>
                    {mission ? <Badge status="success" text="Mission Success" /> : <Badge status="error" text="Mission Failure" />}
                    {<Badge status="success" text="Successful Landing" style={{ margin: "0 1rem" }} />}
                </>)
            } else if (landed === 0) {
                return (<>
                    {mission ? <Badge status="success" text="Mission Success" /> : <Badge status="error" text="Mission Failure" />}
                    {<Badge status="error" text="Landing Failure" style={{ margin: "0 1rem" }} />}
                </>)
            } else {
                return (<>
                    {mission ? <Badge status="success" text="Mission Success" /> : <Badge status="error" text="Mission Failure" />}
                    {<Badge status="warning" text="Partial Landing" style={{ margin: "0 1rem" }} />}
                </>)
            }
        }

    }
    function createCard(item) {
        if (item['type'] === "starship") {
            return (
                <Card
                    hoverable
                    style={style}
                    bodyStyle={styleBody}
                    cover={<Link to={"launch/" + item['id']}><img alt="example" src={(item['image'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['image']} style={styleCover} /></Link>}
                    actions={action(item['links'])}
                >
                    <div>
                        <Link to={"launch/" + item['id']}>
                            <Meta title={item['name']} />
                            <Meta description={item['launchpad']} style={{ fontWeight: 'bold', lineHeight: "1rem", marginBottom: "0.5rem" }} />
                            <Meta description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                            <Meta description={missionStatus(item)} />
                            <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
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
                    cover={<Link to={"launch/" + item['id']}><img alt="example" src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} /></Link>}
                    actions={action(item['links'])}
                >
                    <div>
                        <Link to={"launch/" + item['id']}>
                            <Meta title={"#" + item['flight_number'] + " " + item['name']} />
                            <Meta description={getLaunchpad(item['launchpad'])} style={{ fontWeight: 'bold', lineHeight: "1rem", marginBottom: "0.5rem" }} />
                            <Meta description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                            <Meta description={missionStatus(item)} />
                            <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                            <br />
                        </Link>
                    </div>
                </Card>
            )
        }
    }
    function loadData() {
        if (!data) {
            return (
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    {skeleton}
                </Row>
            )

        }
        if (Object.keys!(data).length === 0 || pastData.loading || launchpadsData.loading || starshipData.loading) {
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
                        total={pastData.past.length}
                        responsive={true}
                        pageSizeOptions={["24", "48", "72", "96"]}
                    />

                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                        {data.slice(minValue, maxValue).map((item, index) => (

                            <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id'] + index}>
                                {createCard(item)}

                            </Col>
                        )
                        )
                        }
                    </Row >
                </div >
            )
        }
    }
    return (
        (ready ?
            loadData()
            : <Skeleton />)

    )
}
const mapStateToProps = state => {
    return {
        pastData: state.past,
        launchpadsData: state.launchpads,
        starshipData: state.starship
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPast: () => dispatch(fetchPast()),
        fetchLaunchpads: () => dispatch(fetchLaunchpads()),
        fetchStarship: () => dispatch(fetchStarship())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Past)