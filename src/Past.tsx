import React from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card, Pagination, Badge } from 'antd';
import moment from 'moment';
import { YoutubeFilled, ReadFilled, RedditCircleFilled } from '@ant-design/icons';
import { connect } from 'react-redux'
import { fetchPast, fetchLaunchpads } from './redux'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
function Past({ pastData, launchpadsData, fetchPast, fetchLaunchpads }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px", width: "100%" }
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }

    const { Meta } = Card;

    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(24);
    const [pageSize, setPageSize] = useState<number>(24);
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
    }, [])


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


    if (pastData.loading || launchpadsData.loading) {
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
                    {pastData.past.slice(minValue, maxValue).map((item, index) => (

                        <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item['id'] + index}>
                            <Card

                                hoverable
                                style={style}
                                bodyStyle={styleBody}

                                cover={<Link to={"launch/" + item['id']}><img alt={item['name']} src={(item['links']['patch']['large'] === null) ? "https://www.spacex.com/static/images/share.jpg" : item['links']['patch']['large']} style={styleCover} /></Link>}
                                actions={action(item['links'])}
                            >
                                <div>
                                    <Link to={"launch/" + item['id']}>
                                        <Meta title={item['name']} />
                                        <Meta title={getLaunchpad(item['launchpad'])} description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                        <Meta description={missionStatus(item)} />
                                        <br />
                                        <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                    </Link>
                                </div>

                            </Card>

                        </Col>
                    )
                    )
                    }
                </Row >
            </div >
        )
    }

}
const mapStateToProps = state => {
    return {
        pastData: state.past,
        launchpadsData: state.launchpads
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPast: () => dispatch(fetchPast()),
        fetchLaunchpads: () => dispatch(fetchLaunchpads())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Past)