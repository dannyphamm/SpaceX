import React from 'react'
import { useState } from 'react'
import { Skeleton, Row, Col, Card, Pagination } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import { YoutubeFilled, ReadFilled, RedditCircleFilled, CheckCircleFilled, MinusSquareFilled } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
function Past({ value, valueLP }) {
    const style = { height: "100%", margin: "0 auto", display: "flex", flexFlow: "column" };
    const styleBody = { flex: "1 1 auto" };
    const styleCover = { padding: "10px 10px"}
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }

    const { Meta } = Card;

    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(25);
    const [pageSize, setPageSize] = useState<number>(25)
    const [items, setItems] = useState<any>([]);
    const [launchpads, setLaunchPads] = useState<any>([]);
    const skeleton = [] as any;
    for (var i = 0; i < 25; i++) {
        skeleton.push(<Col className="gutter-row" xs={{ span: 24}} lg={{ span: 12}} xl={{ span: 8}} xxl={{ span: 6}}><Card
            style={style}
            actions={[
                <YoutubeFilled key="youtube" />,
                <ReadFilled key="article" />
            ]}
        >
            <Skeleton loading={true} active></Skeleton>
        </Card></Col>)
    }
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(b.date_unix).getTime() - new Date(a.date_unix).getTime();
    }

    Promise.resolve(value).then((result) => {
        setItems(result.sort(comp))
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
    function landingSuccess(item) {
        const landing = item['cores'][0]['landing_sucess'];
        return (landing === null ? <span><MinusSquareFilled /> No attempted Landing</span> : (landing === false ? <span><CheckCircleFilled /> Unsuccessful Landing</span> : <span><CheckCircleFilled /> Sucessful Landing</span>))
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
                    {items.slice(minValue, maxValue).map((item) => (
                        <Col className="gutter-row" xs={{ span: 24}} lg={{ span: 12}} xl={{ span: 8}} xxl={{ span: 6}} key={item['id']}>
                            <Link to={"launch/" + item['id']}>
                                <Card
                                    hoverable
                                    style={style}
                                    bodyStyle={styleBody}
                                    cover={<img alt={item['name']} src={item['links']['patch']['large']} style={styleCover} />}
                                    actions={[
                                        <YoutubeFilled key="youtube" href={item['links']['webcast']} target="_blank" rel="noreferrer" />,
                                        <a href={item['links']['article'] === null ? item['links']['wikipedia'] : item['links']['article']} target="_blank" rel="noreferrer"><ReadFilled key="article" /></a>,
                                        <a href={item['links']['reddit']['campaign']} target="_blank" rel="noreferrer"><RedditCircleFilled key="reddit" /></a>
                                    ]}
                                >
                                    <Meta title={item['name']} />
                                    <Meta title={"Launchpad: " + getLaunchpad(item['launchpad'])} description={getLocalTime(item['date_unix'])} style={{ fontWeight: 'bold' }} />
                                    <Meta description={landingSuccess(item)} />
                                    <br />
                                    <Meta description={(item['details'] === null ? "No Information Provided" : item['details'])} />
                                </Card>
                            </Link>
                        </Col>
                    )
                    )
                    }
                </Row >
            </div>
        )
    }

}
Past.propTypes = {
    value: PropTypes.object,
    valueLP: PropTypes.object,
}
export default Past
