import React, { useContext } from 'react';
import { Slider, Row, Button, Space } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { GlobalContext } from './GlobalContext';
import moment from 'moment';
import './Timeline.css';

export default function Timeline() {
    const contextID = 'Global';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { timeline, playing, timeframe } = getOptions(contextID);

    const maxDate = Math.floor(moment.duration(timeframe[1].diff(timeframe[0])).asDays());

    const marks = {
        0: timeframe[0].format('YYYY MMM DD'),
        [maxDate]: timeframe[1].format('YYYY MMM DD')
    };

    return (
        <Row justify='center' style={{ padding: '20px 50px' }}>
            <Slider
                marks={marks}
                max={maxDate}
                tooltipVisible
                style={{ width: '100%' }}
                onAfterChange={(event) => {
                    setOptions(contextID, {
                        ...getOptions(contextID),
                        timeline: moment(timeframe[0]).add(event, 'days'),
                        playing: false
                    });
                }}
                tipFormatter={(value) => {
                    return moment(timeframe[0]).add(value, 'days').format('YYYY MMM DD');
                }}
            />
            <Space size='middle'>
                <Button
                    type='primary'
                    onClick={() => {
                        setOptions(contextID, { ...getOptions(contextID), timeline: timeline.subtract(1, 'days') });
                    }}
                    icon={<StepBackwardOutlined />}
                />
                <Button type='primary' onClick={() => {}} icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} />

                <Button
                    type='primary'
                    onClick={() => {
                        setOptions(contextID, { ...getOptions(contextID), timeline: timeline.add(1, 'days') });
                    }}
                    icon={<StepForwardOutlined />}
                />
            </Space>
        </Row>
    );
}
