import React, { useContext } from 'react';
import { Slider, Row, Button, Space } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { GlobalContext } from './GlobalContext';

export default function Timeline() {
    const contextID = 'Global';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { playbackSpeed, timeline, playing } = getOptions(contextID);

    console.log(playbackSpeed, timeline, playing);
    return (
        <Row justify='center' style={{ padding: '20px 50px' }}>
            <Slider
                defaultValue={0}
                style={{ width: '100%' }}
                onChange={(event) => {
                    setOptions(contextID, { ...getOptions(contextID), timeline: event, playing: false });
                }}
                value={timeline}
            />
            <Space size='middle'>
                <Button
                    type='primary'
                    onClick={() => {
                        setOptions(contextID, { ...getOptions(contextID), timeline: timeline - 1 });
                    }}
                    icon={<StepBackwardOutlined />}
                />
                <Button type='primary' onClick={() => {}} icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} />

                <Button
                    type='primary'
                    onClick={() => {
                        setOptions(contextID, { ...getOptions(contextID), timeline: timeline + 1 });
                    }}
                    icon={<StepForwardOutlined />}
                />
            </Space>
        </Row>
    );
}
