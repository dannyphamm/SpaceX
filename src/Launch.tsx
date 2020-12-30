import React, { useState } from 'react'
import { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import 'antd/dist/antd.css';
import { Descriptions, Badge } from 'antd';
function Launch() {
    let params = useParams();
    const [item, setItem] = useState<any>([]);
    useEffect(() => {

        fetch("https://api.spacexdata.com/v4/launches/" + params['id'])
            .then(res => res.json())
            .then(
                (result) => {
                    setItem(result)
                },
                (error) => {

                }
            )
        console.log(item)
    }, [])


    if (item.length === 0) {
        return (
            <h1>Loading</h1>
        )
    } else {
        return (
            <Descriptions title="Launch Info" bordered>
                <Descriptions.Item label="Flight Number">{item['flight_number']}</Descriptions.Item>
                <Descriptions.Item label="Name">{item['name']}</Descriptions.Item>
                <Descriptions.Item label="Launchpad" span={2}>{item['launchpad']}</Descriptions.Item>
                <Descriptions.Item label="Booster Type">{item['cores'][0]['core']}</Descriptions.Item>
                <Descriptions.Item label="Booster Flight Number">{item['cores'][0]['flight']}</Descriptions.Item>
                <Descriptions.Item label="Date" span={2}>{item['date_local']}</Descriptions.Item>
                <Descriptions.Item label="Countdown" span={3}>
                    <Badge status="processing" text="Running" />
                </Descriptions.Item>
                <Descriptions.Item label="Landing Attempt" span={1}>{item['cores'][0]['core']}</Descriptions.Item>
                <Descriptions.Item label="Landing Location" span={1}>{item['cores'][0]['core']}</Descriptions.Item>
                <Descriptions.Item label="Details" span={3}>{item['details']}</Descriptions.Item>
            </Descriptions>
        )
    }
}

export default Launch
